import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { parseAndValidateK, getActiveRegions, generateDynamicUrl, generateAbsoluteDynamicUrl } from '../src/data/regionResolver.js';
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

  // Legacy Redirect Map
  const legacyRedirectMap = {
    '부평-동': '부평동',
    '연수-동': '연수동',
    '덕양-동': '고양동',
    '중원-동': null, // 확인 불가능 -> 404
    '분당-동': '분당동',
    '의정부-동': '의정부동',
    '과천-동': '과천동',
    '권선-동': '권선동',
    '영통-동': '영통동',
    '만안-동': '안양동',
    '광명-동': '광명동',
    '원미-동': '원미동',
    '오정-동': '오정동'
  };

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
      // 1. If prefix matches legacyRedirectMap directly
      if (prefix in legacyRedirectMap) {
        const dest = legacyRedirectMap[prefix];
        if (dest === null) {
          let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
          if (!fs.existsSync(htmlPath)) htmlPath = path.join(process.cwd(), 'index.html');
          let html = fs.readFileSync(htmlPath, 'utf-8');
          html = html.replace(/<title>.*?<\/title>/, "<title>페이지를 찾을 수 없습니다 | 바름공간</title>");
          html = html.replace('</head>', '<meta name="robots" content="noindex, follow" />\n</head>');
          html = html.replace('<div id="root"></div>', '<div id="root" style="padding:50px; text-align:center;"><h1>페이지를 찾을 수 없습니다. (404 Not Found)</h1></div>');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.status(404).send(html);
        } else {
          const redirectUrl = `https://www.barumspace.co.kr/?k=${encodeURIComponent(dest + '-' + matchedService.keyword)}`;
          res.setHeader('Location', redirectUrl);
          return res.status(301).end();
        }
      }

      // 2. If it contains a hyphen and is not a valid active key (meaning it's an old combined parent-dong structure, e.g. 일산동-풍산동 or 하남-풍산동)
      const exactMatch = keywordMetadata.find(km => km.urlRegionKey === prefix && km.isIndexable);
      if (!exactMatch && prefix.includes('-')) {
        const tokens = prefix.split('-');
        const lastToken = tokens[tokens.length - 1]; // e.g. "풍산동"
        
        // Find if this target dong exists in keywordMetadata
        const targetDong = keywordMetadata.find(km => km.urlRegionKey === lastToken && km.isIndexable && km.keywordVariant === 'lowerRegion');
        if (targetDong) {
          const redirectUrl = `https://www.barumspace.co.kr/?k=${encodeURIComponent(targetDong.urlRegionKey + '-' + matchedService.keyword)}`;
          res.setHeader('Location', redirectUrl);
          return res.status(301).end();
        }
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
              const dynUrl = generateDynamicUrl(reg.urlRegion, k.keyword);
              seoContent += '<li><a href="' + dynUrl + '" style="color: #0076ff; text-decoration: none;">' + reg.displayName + ' ' + k.keyword + '</a></li>';
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

      const isShort = matchedRegion.id.endsWith('-short');
      const isOfficial = matchedRegion.id.endsWith('-official');
      const isDong = !isShort && !isOfficial;

      let title = "";
      let desc = "";
      let upperNotice = "";

      if (isOfficial) {
        if (matchedService.serviceGroup === 'elastic') {
          title = `${regionName} ${taskName} 시공 안내 | 바름공간`;
        } else {
          title = `${regionName} ${taskName} 안내 | 타일 틈 정리`;
        }
        if (matchedService.searchIntent === 'agency') {
          title = `${regionName} ${taskName} | 공식 시공 기준 안내`;
        }
        desc = `${regionName} ${taskName}의 벽면 점검, 보양, 균열 보수 및 도포 과정을 정밀하게 안내합니다.`;
        upperNotice = `${regionName} 지역을 위한 맞춤형 ${taskName} 시공 안내입니다.`;
      } else if (isShort) {
        if (matchedService.serviceGroup === 'elastic') {
          title = `${regionName} ${taskName} 전문 시공 | 바름공간`;
        } else {
          title = `${regionName} ${taskName} 추천 마감 | 타일 틈 케어`;
        }
        if (matchedService.searchIntent === 'agency') {
          title = `${regionName} ${taskName} | 시공 전 상세 점검사항`;
        }
        desc = `${regionName} 지역 베란다와 세탁실 ${taskName} 상담 시 확인할 벽면 상태와 시공 기준을 안내합니다.`;
        upperNotice = `${regionName} 지역의 주거 공간에 맞춘 ${taskName} 시공을 안내합니다.`;
      } else {
        title = `${regionName} ${taskName} | 바름공간`;
        desc = `${regionName} 지역의 안정적인 타일 및 벽면 관리를 위한 ${taskName} 전문 안내입니다.`;
        upperNotice = `${regionName} 지역을 위한 맞춤형 ${taskName} 안내`;
      }

      // Inject Meta Tags into HTML
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);

      const cleanUrl = generateAbsoluteDynamicUrl('https://www.barumspace.co.kr', matchedRegion.urlRegion, matchedService.keyword);

      // Inject Canonical, og:url and og:image
      html = html.replace('</head>', `<link rel="canonical" href="${cleanUrl}" />\n<meta property="og:url" content="${cleanUrl}" />\n<meta property="og:image" content="https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-v1.png" />\n</head>`);

      // Pre-render content for bots (H1 and localized texts, FAQs)
      let botContent = `<div style="display:none;" id="seo-pre-rendered">`;
      botContent += `<h1>${regionName} ${taskName}</h1>`;
      botContent += `<p class="upper-notice">${upperNotice}</p>`;
      botContent += `<p class="main-desc">${desc}</p>`;
      botContent += `<h2>시공 관련 자주 묻는 질문(FAQ)</h2>`;
      botContent += `<ul>`;
      matchedService.faqSet.forEach(q => {
        botContent += `<li><strong>Q: ${q}</strong></li>`;
      });
      botContent += `</ul>`;
      botContent += `</div>`;

      html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${botContent}`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }
  }

  // If page is not matched, return 404
  html = html.replace(/<title>.*?<\/title>/, "<title>페이지를 찾을 수 없습니다 | 바름공간</title>");
  html = html.replace('</head>', '<meta name="robots" content="noindex, follow" />\n</head>');
  html = html.replace('<div id="root"></div>', '<div id="root" style="padding:50px; text-align:center;"><h1>페이지를 찾을 수 없습니다. (404 Not Found)</h1></div>');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(404).send(html);
}
