import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { parseAndValidateK, getActiveRegions } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { seoulRegions } from '../src/data/seoulRegions.js';
import fs from 'fs';
import path from 'path';

// This serverless function intercepts requests to the site (like / and /sitemap-seoul)
// and dynamically injects meta tags, H1, and pre-rendered content for SEO robots.
export default async function handler(req, res) {
  // Parse incoming URL and k parameters
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const kParam = url.searchParams.get('k')?.trim() || '';
  const pathname = url.pathname;

  // 301 Permanent Redirect logic for old joined error URLs and long keywords
  // e.g. 부평구-산곡동-탄성코트 -> 부평-산곡동-탄성코트, 안양-비산동-탄성코트 -> bisan-dong-탄성코트
  if (kParam) {
    const sortedKeywords = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);
    let matchedService = null;
    let prefix = '';
    
    for (const s of sortedKeywords) {
      if (kParam.endsWith(`-${s.keyword}`)) {
        matchedService = s;
        prefix = kParam.substring(0, kParam.length - s.keyword.length - 1);
        break;
      }
    }


    if (matchedService && prefix) {
      // Find if prefix matches any clean routeKey
      const directMatch = keywordMetadata.find(km => km.routeKey === prefix);
      let targetRouteKey = null;


      if (directMatch) {
        // Already clean or matched
      } else {
        // If not direct match, extract parent prefix and clean dong name
        const parts = prefix.split('-');
        const dongName = parts[parts.length - 1];
        const parentPrefix = parts.slice(0, -1).join('-');

        const candidates = keywordMetadata.filter(km => km.displayRegion === dongName && km.type === 'dong');
        if (candidates.length === 1) {
          targetRouteKey = candidates[0].routeKey;
        } else if (candidates.length > 1 && parentPrefix) {
          const cleanParentPrefix = parentPrefix.replace(/구$/, '').replace(/시$/, '');
          const matchedTarget = candidates.find(cand => {
            const parentClean = cand.parentRegion.replace(/구/g, '').replace(/시/g, '').replace(/권/g, '');
            return parentClean.includes(cleanParentPrefix);
          });
          if (matchedTarget) {
            targetRouteKey = matchedTarget.routeKey;
          }
        }
      }


      if (targetRouteKey) {
        const redirectUrl = `https://www.barumspace.co.kr/?k=${encodeURIComponent(targetRouteKey + '-' + matchedService.keyword)}`;
        res.setHeader('Location', redirectUrl);
        return res.status(301).end();
      }
    }
  }

  // Read index.html compiled template from the deployment output
  // Vercel routes index.html as a static asset, we can read it from the relative build output path
  let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'index.html'); // Fallback for safety
  }

  let html = fs.readFileSync(htmlPath, 'utf-8');

  // Check if we are requesting sitemap-seoul
  if (pathname === '/sitemap-seoul') {
    const hubTitle = "서울·인천·경기 탄성코트·줄눈시공 지역별 페이지 | 바름공간";
    const hubDesc = "서울·인천·경기 주요 시·구·읍·면·동 단위의 탄성코트 및 줄눈시공 서비스 페이지를 확인할 수 있습니다.";
    
    const hubCanonical = "https://www.barumspace.co.kr/sitemap-seoul";

    // Replace Meta Tags
    html = html.replace(/<title>.*?<\/title>/, "<title>" + hubTitle + "</title>");
    html = html.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="' + hubDesc + '" />');
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="' + hubTitle + '" />');
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="' + hubDesc + '" />');

    // Inject canonical & og:url tags
    html = html.replace('</head>', '<link rel="canonical" href="' + hubCanonical + '" />\n<meta property="og:url" content="' + hubCanonical + '" />\n</head>');

    // Fetch all active production regions
    const activeList = getActiveRegions();
    
    // Grouping
    const metroGroups = {
      '서울권': { label: '서울권', cities: {} },
      '경기권': { label: '경기권', cities: {} },
      '인천권': { label: '인천권', cities: {} }
    };

    activeList.forEach(r => {
      const metroKey = r.metro === '서울' ? '서울권' : (r.metro === '인천' ? '인천권' : '경기권');
      const group = metroGroups[metroKey];
      
      if (r.metro === '서울' || r.metro === '인천') {
        const cityKey = r.groupName;
        if (!group.cities[cityKey]) {
          group.cities[cityKey] = {
            name: cityKey,
            districts: {
              '전체': { name: '전체', regions: [] }
            }
          };
        }
        group.cities[cityKey].districts['전체'].regions.push(r);
      } else {
        // Gyeonggi
        const cityKey = r.city;
        if (!group.cities[cityKey]) {
          group.cities[cityKey] = {
            name: cityKey,
            districts: {}
          };
        }
        
        const isDistrict = r.groupName && r.groupName.endsWith('구') && r.groupName !== r.city;
        const distKey = isDistrict ? r.groupName : '시 단위';
        
        if (!group.cities[cityKey].districts[distKey]) {
          group.cities[cityKey].districts[distKey] = {
            name: distKey,
            regions: []
          };
        }
        group.cities[cityKey].districts[distKey].regions.push(r);
      }
    });

    let seoContent = '<div style="padding: 40px; max-width: 1200px; margin: 0 auto; font-family: sans-serif;">';
    seoContent += '<h1 style="font-size: 2rem; color: #183f35; margin-bottom: 20px;">서울·인천·경기 탄성코트·줄눈시공 지역별 페이지 안내</h1>';
    seoContent += '<p style="color: #666; margin-bottom: 40px;">서울·인천·경기 주요 시·구·읍·면·동 단위의 탄성코트 및 줄눈시공 서비스 페이지 안내 목록입니다.</p>';

    for (const metroKey of Object.keys(metroGroups)) {
      const metro = metroGroups[metroKey];
      seoContent += '<div style="margin-bottom: 50px;">';
      seoContent += '<h2 style="font-size: 1.6rem; color: #183f35; border-bottom: 3px solid #183f35; padding-bottom: 10px; margin-bottom: 24px;">' + metro.label + '</h2>';

      for (const cityKey of Object.keys(metro.cities)) {
        const city = metro.cities[cityKey];
        
        // Count children
        let childCount = 0;
        Object.keys(city.districts).forEach(dk => {
          childCount += city.districts[dk].regions.length;
        });

        seoContent += '<div style="margin-bottom: 30px; border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px; background: #fff;">';
        seoContent += '<h3 style="font-size: 1.3rem; color: #183f35; margin: 0 0 16px 0; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px;">' + cityKey + ' <span style="font-size: 0.9rem; color: #666; font-weight: normal;">(하위 지역: ' + childCount + '개)</span></h3>';

        for (const distKey of Object.keys(city.districts)) {
          const district = city.districts[distKey];
          
          if (distKey !== '전체') {
            seoContent += '<h4 style="font-size: 1.05rem; color: #183f35; margin-top: 16px; margin-bottom: 8px;">[' + distKey + ']</h4>';
          }

          seoContent += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">';
          
          district.regions.forEach(reg => {
            seoContent += '<div style="border: 1px solid #eee; padding: 12px; border-radius: 4px; background: #fafafa;">';
            seoContent += '<h5 style="font-size: 0.9rem; color: #333; font-weight: bold; margin: 0 0 8px 0;">' + reg.name + '</h5>';
            seoContent += '<ul style="list-style: none; padding: 0; margin: 0; line-height: 1.6; font-size: 0.85rem;">';
            serviceKeywords.forEach(k => {
              const encoded = encodeURIComponent(reg.urlRegion + '-' + k.keyword);
              seoContent += '<li><a href="/?k=' + encoded + '" style="color: #0076ff; text-decoration: none;">' + reg.displayName + ' ' + k.keyword + '</a></li>';
            });
            seoContent += '</ul></div>';
          });

          seoContent += '</div>';
        }
        seoContent += '</div>';
      }
      seoContent += '</div>';
    }
    seoContent += '</div>';

    html = html.replace('<div id="root"></div>', '<div id="root">' + seoContent + '</div>');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // Handle Dynamic SEO pages (?k=지역명-작업명)
  if (kParam) {
    const usePreview = url.searchParams.get('preview') === 'true';
    const parseResult = parseAndValidateK(kParam, usePreview);

    if (parseResult.isValid) {
      const matchedRegion = parseResult.region;
      const matchedService = parseResult.service;
      const regionName = matchedRegion.name;
      const taskName = matchedService.keyword;

      // 1. Dynamic Title Mapping
      let title = "";
      if (taskName === '탄성코트') {
        title = `${regionName} 탄성코트 시공 | 베란다·세탁실 벽면 마감`;
      } else if (taskName === '탄성코트시공') {
        title = `${regionName} 탄성코트시공 | 바탕면 정리와 시공 과정`;
      } else if (taskName === '베란다탄성코트') {
        title = `${regionName} 베란다탄성코트 | 벽면 상태 확인과 마감 시공`;
      } else if (taskName === '세탁실탄성코트') {
        title = `${regionName} 세탁실탄성코트 | 배관 주변 and 벽면 마감`;
      } else if (taskName === '아파트탄성코트') {
        title = `${regionName} 아파트탄성코트 | 베란다·세탁실 시공 안내`;
      } else if (taskName === '탄성코트업체') {
        title = `${regionName} 탄성코트업체 | 시공 전 확인 기준`;
      } else if (taskName === '줄눈시공') {
        title = `${regionName} 줄눈시공 | 욕실·현관 타일 틈새 마감`;
      } else if (taskName === '욕실줄눈시공') {
        title = `${regionName} 욕실줄눈시공 | 기존 줄눈 제거와 마감 안내`;
      } else if (taskName === '현관줄눈시공') {
        title = `${regionName} 현관줄눈시공 | 타일 색상과 오염 관리`;
      } else if (taskName === '베란다줄눈시공') {
        title = `${regionName} 베란다줄눈시공 | 기존 줄눈 상태와 마감`;
      } else if (taskName === '줄눈시공업체') {
        title = `${regionName} 줄눈시공업체 | 견적과 시공 범위 확인`;
      } else if (taskName === '화장실줄눈시공') {
        title = `${regionName} 화장실줄눈시공 | 타일 틈새 정리와 시공`;
      } else {
        title = `${regionName} ${taskName} 시공 | 바름공간`;
      }

      // 2. Dynamic Meta Description Mapping
      let desc = "";
      if (matchedService.serviceGroup === 'elastic') {
        desc = `${regionName} ${taskName} 시공 전 기존 벽면의 들뜸 및 오염 상태를 확인하고, 베란다·세탁실 바탕면 정리부터 필요한 마감 범위를 안내합니다.`;
      } else {
        desc = `${regionName} ${taskName} 전 기존 줄눈의 오염과 갈라짐을 확인하고, 필요한 제거 범위와 욕실 환경에 맞는 자재·색상을 안내합니다.`;
      }

      // Inject Meta Tags into HTML
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);

      // Clean parameter representation (strips tracking tags)
      const cleanParam = encodeURIComponent(matchedRegion.urlRegion + '-' + matchedService.keyword);
      const cleanUrl = `https://www.barumspace.co.kr/?k=${cleanParam}`;

      // Inject Canonical & OpenGraph URL
      html = html.replace('</head>', `<link rel="canonical" href="${cleanUrl}" />\n<meta property="og:url" content="${cleanUrl}" />\n</head>`);

      // Pre-render content for bots (H1 and localized texts)
      let botContent = `<div style="display:none;" id="seo-pre-rendered">`;
      botContent += `<h1>${regionName} ${taskName}</h1>`;
      botContent += `<p>${desc}</p>`;
      botContent += `</div>`;

      html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${botContent}`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }
  }

  // If page is not matched, return 404
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(404).send('<h1>페이지를 찾을 수 없습니다. (404 Not Found)</h1>');
}
