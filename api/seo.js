import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { parseAndValidateK, getActiveRegions, generateDynamicUrl, generateAbsoluteDynamicUrl, getAllowedServicesForRegion, findRegionByUrlToken } from '../src/data/regionResolver.js';
import { serviceKeywords, FAQ_CATALOG } from '../src/data/serviceKeywords.js';
import { getSeoEngineVersion } from '../src/data/seoV2/featureFlag.js';
import { buildV2Content, buildV3Content } from '../src/data/seoV2/contentBuilder.js';
import { buildV2InternalLinks, buildV3InternalLinks } from '../src/data/seoV2/linkEngine.js';
import { seoulRegions } from '../src/data/seoulRegions.js';
import { thumbnailTestMap, thumbnailDimensions, testBKeywords } from '../src/data/thumbnailTestMap.js';
import fs from 'fs';
import path from 'path';

// This serverless function intercepts requests to the site (like / and /sitemap-seoul)
// and dynamically injects meta tags, H1, and pre-rendered content for SEO robots.
export default async function handler(req, res) {
  // Parse incoming URL and k parameters robustly under Vercel Rewrites
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  // Under vercel rewrite, req.url may change to /api/seo. We check req.query or the x-vercel-original-url if present
  let kParam = '';
  const originalUrlHeader = req.headers['x-vercel-original-url'] || req.headers['x-matched-path'] || '';
  if (originalUrlHeader) {
    try {
      const origUrl = new URL(originalUrlHeader, `http://${req.headers.host || 'localhost'}`);
      kParam = origUrl.searchParams.get('k')?.trim() || '';
    } catch (e) {
      // fallback
    }
  }
  
  if (!kParam) {
    // Fallback to query object or request url
    kParam = (req.query?.k || url.searchParams.get('k') || '').trim();
  }

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
      const exactMatch = findRegionByUrlToken(prefix);
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

  // Read app.html compiled template from the deployment output
  // Vercel routes index.html as a static asset, we can read it from the relative build output path
  let htmlPath = path.join(process.cwd(), 'dist', 'app.html');
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  }
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'index.html'); // Fallback for safety
  }

  let html = fs.readFileSync(htmlPath, 'utf-8');

  // Check if we are requesting privacy-policy
  if (pathname === '/privacy-policy') {
    const privacyTitle = "개인정보처리방침 | 바름공간";
    const privacyDesc = "올케어 서비스가 운영하는 바름공간의 개인정보처리방침입니다.";
    const privacyCanonical = "https://www.barumspace.co.kr/privacy-policy";

    html = html.replace(/<title>.*?<\/title>/, "<title>" + privacyTitle + "</title>");
    html = html.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="' + privacyDesc + '" />');
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="' + privacyTitle + '" />');
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="' + privacyDesc + '" />');

    html = html.replace('</head>', '<link rel="canonical" href="' + privacyCanonical + '" />\n<meta property="og:url" content="' + privacyCanonical + '" />\n</head>');

    let privacyHtml = '<div style="padding: 40px 20px; max-width: 800px; margin: 0 auto; font-family: sans-serif; color: #333; line-height: 1.75;">';
    privacyHtml += '<h1 style="font-size: 2rem; color: #183f35; margin-bottom: 20px; border-bottom: 2px solid #183f35; padding-bottom: 12px;">개인정보처리방침</h1>';
    privacyHtml += '<div style="background: #f0e9dc; padding: 18px 20px; border-radius: 6px; margin-bottom: 32px; font-weight: bold; color: #183f35;">올케어 서비스는 ‘바름공간’ 브랜드를 통해 탄성코트 및 줄눈시공 상담 서비스를 제공하며, 이용자의 개인정보를 관련 법령에 따라 안전하게 처리합니다.</div>';
    privacyHtml += '<h2>1. 개인정보처리방침의 목적</h2><p>올케어 서비스(이하 \'회사\'라 함)는 운영 브랜드 \'바름공간\'(https://www.barumspace.co.kr)을 이용하는 고객의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본 방침은 회사가 제공하는 탄성코트 및 줄눈시공 안내·상담 서비스에서 개인정보가 어떻게 처리되고 관리되는지 알리는 데 목적이 있습니다.</p>';
    privacyHtml += '<h2>2. 개인정보처리자 및 운영 브랜드</h2><ul><li><strong>개인정보처리자(사업자명):</strong> 올케어 서비스</li><li><strong>운영 브랜드:</strong> 바름공간</li><li><strong>대표자:</strong> 김재현</li><li><strong>사업자등록번호:</strong> 405-15-02677</li><li><strong>대표 연락처:</strong> 010-8189-6900</li><li><strong>웹사이트:</strong> https://www.barumspace.co.kr</li></ul>';
    privacyHtml += '<h2>3. 처리하는 개인정보 항목</h2><p>본 홈페이지는 회원가입 기능이 없으며, 별도의 온라인 문의 작성 폼이나 서버 수집 DB를 운영하지 않습니다.</p><ul><li><strong>전화 상담 시:</strong> 전화문의(010-8189-6900)를 통해 이용자가 자발적으로 제공하는 정보 (성함, 연락처, 시공 요청 지역 등)</li><li><strong>카카오톡 상담 시:</strong> 카카오톡 채널 링크를 통한 채팅 상담 시 이용자가 직접 전송하는 대화 내용 및 현장 사진</li></ul>';
    privacyHtml += '<h2>4. 개인정보의 처리 목적</h2><p>탄성코트 및 줄눈시공 상담·견적 안내, 현장 상태 확인 및 시공 서비스 이행, A/S 관리를 위해 처리합니다.</p>';
    privacyHtml += '<h2>5. 개인정보의 보유 및 이용 기간</h2><p>상담 및 시공 서비스 완료 시까지 보유·이용 후 지체 없이 파기합니다. 단, 관계 법령에 따른 보존 의무가 있는 경우 법정 기간(시공 보증 및 소비자 불만 처리 기록 3년, 계약 기록 5년) 동안 안전하게 보관합니다.</p>';
    privacyHtml += '<h2>6. 개인정보의 제3자 제공 여부</h2><p>원칙적으로 제3자에게 제공하지 않습니다.</p>';
    privacyHtml += '<h2>7. 개인정보 처리업무 위탁 여부</h2><p>개인정보 처리업무를 외부에 위탁하지 않으며 직접 관리합니다.</p>';
    privacyHtml += '<h2>8. 개인정보의 파기 절차 및 방법</h2><p>보유기간 경과 또는 처리 목적 달성 시 복구 불가능한 방법으로 지체 없이 삭제 및 파기합니다.</p>';
    privacyHtml += '<h2>9. 정보주체의 권리와 행사 방법</h2><p>대표 전화(010-8189-6900)를 통해 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.</p>';
    privacyHtml += '<h2>10. 개인정보의 안전성 확보조치</h2><p>관리적·기술적 보안 조치를 이행하고 있습니다.</p>';
    privacyHtml += '<h2>11. 개인정보 보호책임자 및 담당자</h2><p>김재현 대표 (연락처: 010-8189-6900, 평일 09:00~18:00)</p>';
    privacyHtml += '<h2>12. 개인정보 침해 관련 문의 및 구제 방법</h2><p>개인정보분쟁조정위원회(1833-6972), 개인정보침해신고센터(118)</p>';
    privacyHtml += '<h2>13. 쿠키 등 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2><p>쿠키 및 방문자 분석/추적 도구(Google Analytics, Meta Pixel, 네이버 애널리틱스 등)를 일절 사용하지 않습니다.</p>';
    privacyHtml += '<h2>14. 개인정보처리방침의 변경 및 시행일</h2><p>공고일자: 2026년 7월 27일 / 시행일자: 2026년 7월 27일</p>';
    privacyHtml += '<div style="margin-top: 40px;"><a href="/">메인 페이지로 돌아가기</a></div>';
    privacyHtml += '</div>';

    html = html.replace('<div id="root"></div>', '<div id="root">' + privacyHtml + '</div>');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

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
      if (r.metro !== '서울' && r.metro !== '인천' && r.metro !== '경기') return;
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
    seoContent += '<p style="color: #666; margin-bottom: 30px;">서울·인천·경기 주요 시·구·읍·면·동 단위의 탄성코트 및 줄눈시공 서비스 페이지 안내 목록입니다.</p>';

    // Region Hub Cross-Navigation CTA
    seoContent += '<div style="background: #f8f9fa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; margin-bottom: 40px;">';
    seoContent += '<div style="font-weight: bold; font-size: 0.95rem; color: #183f35; margin-bottom: 12px;">지역별 통합 페이지</div>';
    seoContent += '<div style="display: flex; gap: 12px; flex-wrap: wrap;">';
    seoContent += '<a href="/sitemap-seoul" style="display: inline-block; padding: 10px 20px; background: #183f35; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 0.95rem;">서울 · 경기 · 인천 (현재 페이지)</a>';
    seoContent += '<a href="/sitemap-chungcheong" style="display: inline-block; padding: 10px 20px; background: #fff; color: #333; text-decoration: none; border: 1px solid #ccc; border-radius: 4px; font-weight: 600; font-size: 0.95rem;">대전 · 세종 · 충청 &rarr;</a>';
    seoContent += '</div></div>';

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
            const allowedServices = getAllowedServicesForRegion(reg);
            allowedServices.forEach(k => {
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

  // Check if we are requesting sitemap-chungcheong
  if (pathname === '/sitemap-chungcheong') {
    const hubTitle = "충청권 탄성코트 시공 지역별 페이지 안내 | 바름공간";
    const hubDesc = "대전광역시, 세종특별자치시, 충청북도 청주시 및 충청남도 천안·아산 주요 구·동 단위의 탄성코트 전문 시공 서비스 페이지 안내 목록입니다.";
    
    const hubCanonical = "https://www.barumspace.co.kr/sitemap-chungcheong";

    // Replace Meta Tags
    html = html.replace(/<title>.*?<\/title>/, "<title>" + hubTitle + "</title>");
    html = html.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="' + hubDesc + '" />');
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="' + hubTitle + '" />');
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="' + hubDesc + '" />');

    // Inject canonical & og:url tags
    html = html.replace('</head>', '<link rel="canonical" href="' + hubCanonical + '" />\n<meta property="og:url" content="' + hubCanonical + '" />\n</head>');

    // Fetch all active production regions
    const activeList = getActiveRegions();
    
    // Grouping for Chungcheong (Batch 1A: Daejeon + Sejong, Batch 1B: Cheongju, Batch 1C: Cheonan + Asan)
    const chungcheongGroups = {
      '대전권': { label: '대전광역시', districts: {} },
      '세종권': { label: '세종특별자치시', districts: {} },
      '충북권': { label: '충청북도 (청주시)', districts: {} },
      '충남권': { label: '충청남도 (천안·아산)', districts: {} }
    };

    activeList.forEach(r => {
      if (r.metro !== '대전' && r.metro !== '세종' && r.metro !== '충북' && r.metro !== '충남') return;
      const metroKey = r.metro === '대전' ? '대전권' : (r.metro === '세종' ? '세종권' : (r.metro === '충북' ? '충북권' : '충남권'));
      const group = chungcheongGroups[metroKey];
      
      let distKey = '전체';
      if (r.metro === '대전') {
        distKey = (r.groupName && r.groupName !== '대전시') ? r.groupName : '시 단위';
      } else if (r.metro === '충북') {
        distKey = (r.groupName && r.groupName !== '청주시') ? r.groupName : '시 단위';
      } else if (r.metro === '충남') {
        distKey = r.groupName || '시 단위';
      }
      
      if (!group.districts[distKey]) {
        group.districts[distKey] = {
          name: distKey,
          regions: []
        };
      }
      group.districts[distKey].regions.push(r);
    });

    let seoContent = '<div style="padding: 40px; max-width: 1200px; margin: 0 auto; font-family: sans-serif;">';
    seoContent += '<h1 style="font-size: 2rem; color: #183f35; margin-bottom: 20px;">충청권 탄성코트 시공 지역별 페이지 안내</h1>';
    seoContent += '<p style="color: #666; margin-bottom: 30px;">대전광역시, 세종특별자치시, 충청북도 청주시 및 충청남도 천안·아산 주요 구·동 단위의 탄성코트 전문 시공 서비스 안내 목록입니다.</p>';

    // Region Hub Cross-Navigation CTA
    seoContent += '<div style="background: #f8f9fa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; margin-bottom: 40px;">';
    seoContent += '<div style="font-weight: bold; font-size: 0.95rem; color: #183f35; margin-bottom: 12px;">지역별 통합 페이지</div>';
    seoContent += '<div style="display: flex; gap: 12px; flex-wrap: wrap;">';
    seoContent += '<a href="/sitemap-seoul" style="display: inline-block; padding: 10px 20px; background: #fff; color: #333; text-decoration: none; border: 1px solid #ccc; border-radius: 4px; font-weight: 600; font-size: 0.95rem;">&larr; 서울 · 경기 · 인천</a>';
    seoContent += '<a href="/sitemap-chungcheong" style="display: inline-block; padding: 10px 20px; background: #183f35; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 0.95rem;">대전 · 세종 · 충청 (현재 페이지)</a>';
    seoContent += '</div></div>';

    for (const metroKey of Object.keys(chungcheongGroups)) {
      const metro = chungcheongGroups[metroKey];
      const distKeys = Object.keys(metro.districts);
      if (distKeys.length === 0) continue;

      let childCount = 0;
      distKeys.forEach(dk => { childCount += metro.districts[dk].regions.length; });

      seoContent += '<div style="margin-bottom: 50px;">';
      seoContent += '<h2 style="font-size: 1.6rem; color: #183f35; border-bottom: 3px solid #183f35; padding-bottom: 10px; margin-bottom: 24px;">' + metro.label + ' <span style="font-size: 1rem; color: #666; font-weight: normal;">(총 ' + childCount + '개 지역)</span></h2>';

      for (const distKey of distKeys) {
        const district = metro.districts[distKey];
        
        seoContent += '<div style="margin-bottom: 30px; border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px; background: #fff;">';
        if (distKey !== '전체' && distKey !== '시 단위') {
          seoContent += '<h3 style="font-size: 1.3rem; color: #183f35; margin: 0 0 16px 0; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px;">[' + distKey + '] <span style="font-size: 0.9rem; color: #666; font-weight: normal;">(하위 지역: ' + district.regions.length + '개)</span></h3>';
        } else if (distKey === '시 단위') {
          seoContent += '<h3 style="font-size: 1.3rem; color: #183f35; margin: 0 0 16px 0; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px;">시 단위 종합 <span style="font-size: 0.9rem; color: #666; font-weight: normal;">(하위 지역: ' + district.regions.length + '개)</span></h3>';
        } else {
          seoContent += '<h3 style="font-size: 1.3rem; color: #183f35; margin: 0 0 16px 0; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px;">세종특별자치시 전역 <span style="font-size: 0.9rem; color: #666; font-weight: normal;">(하위 지역: ' + district.regions.length + '개)</span></h3>';
        }

        seoContent += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">';
        
        district.regions.forEach(reg => {
          seoContent += '<div style="border: 1px solid #eee; padding: 12px; border-radius: 4px; background: #fafafa;">';
          seoContent += '<h5 style="font-size: 0.9rem; color: #333; font-weight: bold; margin: 0 0 8px 0;">' + reg.name + '</h5>';
          seoContent += '<ul style="list-style: none; padding: 0; margin: 0; line-height: 1.6; font-size: 0.85rem;">';
          const allowedServices = getAllowedServicesForRegion(reg);
          allowedServices.forEach(k => {
            const dynUrl = generateDynamicUrl(reg.urlRegion, k.keyword);
            seoContent += '<li><a href="' + dynUrl + '" style="color: #0076ff; text-decoration: none;">' + reg.displayName + ' ' + k.keyword + '</a></li>';
          });
          seoContent += '</ul></div>';
        });

        seoContent += '</div></div>';
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

      // Determine region context name for duplicate correction URLs
      const isCorrectionUrl = matchedRegion.displayName !== matchedRegion.urlRegion;
      const cleanParent = (matchedRegion.parentRegionName || "").replace(/특별시|광역시/g, "");
      const regionContextName = isCorrectionUrl 
        ? `${cleanParent} ${regionName}`.trim().replace(/\s+/g, ' ')
        : regionName;

      let upperNotice = matchedService.heroDescriptionTemplate.replace(/{region}/g, regionContextName);

      const fullRegionName = (matchedRegion.parentRegionName ? matchedRegion.parentRegionName + ' ' : '') + regionName;
      const isTaskEndsWithSiGong = taskName.endsWith('시공');

      // Feature Flag Check (Wave 1 Pilot for Elastic Coating keywords in Pilot regions)
      const forceV2 = usePreview || url.searchParams.get('v2') === 'true';
      const engineVersion = getSeoEngineVersion(regionName, taskName, forceV2);

      let metaDescText = matchedService.metaDescriptionTemplate.replace(/{region}/g, matchedRegion.displayName || regionName);
      if (engineVersion === 'V3') {
        const v3Content = buildV3Content(matchedRegion, matchedService);
        metaDescText = v3Content.metaDescription;
      }

      if (isOfficial) {
        title = `${regionName} ${taskName}${isTaskEndsWithSiGong ? ' 안내' : ' 시공 안내'} | 바름공간`;
        desc = metaDescText;
      } else if (isShort) {
        title = `${regionName} ${taskName}${isTaskEndsWithSiGong ? ' 전문' : ' 전문 시공'} | 바름공간`;
        desc = metaDescText;
      } else {
        title = `${regionName} ${taskName} | 바름공간`;
        desc = metaDescText;
      }

      // Inject Meta Tags into HTML
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);

      const cleanUrl = generateAbsoluteDynamicUrl('https://www.barumspace.co.kr', matchedRegion.urlRegion, matchedService.keyword);
      const customThumb = thumbnailTestMap[kParam];
      const customDim = thumbnailDimensions[kParam] || { width: 1200, height: 1200 };
      const seoThumbnailUrl = customThumb 
        ? `https://www.barumspace.co.kr${customThumb}`
        : 'https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-v2.jpg';

      // Construct Shared Schema JSON-LD (Service, BreadcrumbList, FAQPage)
      const defaultSiteUrl = 'https://www.barumspace.co.kr';
      const schemas = [];

      // 1. Service schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': `${regionName} ${taskName}`,
        'provider': {
          '@type': 'Organization',
          'name': '바름공간'
        },
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': isCorrectionUrl ? `${matchedRegion.districtName || ""} ${regionName}`.trim() : (matchedRegion.districtName || regionName)
        },
        'description': desc,
        'image': seoThumbnailUrl
      });

      // 2. Breadcrumb schema
      const isChungcheong = matchedRegion.metro === '대전' || matchedRegion.metro === '세종' || matchedRegion.metro === '충북' || matchedRegion.metro === '충남' || matchedRegion.metro === '충청';
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': '홈', 'item': defaultSiteUrl },
          { '@type': 'ListItem', 'position': 2, 'name': isChungcheong ? '충청권 지역별 안내' : '수도권 지역별 안내', 'item': isChungcheong ? `${defaultSiteUrl}/sitemap-chungcheong` : `${defaultSiteUrl}/sitemap-seoul` },
          { '@type': 'ListItem', 'position': 3, 'name': `${regionName} ${taskName}`, 'item': cleanUrl }
        ]
      });

      let faqEntries = [];
      if (engineVersion === 'V3') {
        const v3Content = buildV3Content(matchedRegion, matchedService);
        faqEntries = v3Content.faqs.map(f => ({ name: f.q, text: f.a }));
      } else if (engineVersion === 'V2') {
        const v2Content = buildV2Content(matchedRegion, matchedService);
        faqEntries = v2Content.faqs.map(f => ({ name: f.q, text: f.a }));
      } else {
        faqEntries = matchedService.faqSet.map(q => ({
          name: q,
          text: FAQ_CATALOG[q] || '상세 시공 문의 시 전문 답변을 준비해 드립니다.'
        }));
      }

      // 3. FAQPage schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqEntries.map(f => ({
          '@type': 'Question',
          'name': f.name,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.text
          }
        }))
      });

      // Construct and Inject all 17 target SEO tags + JSON-LD
      const seoTags = `
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${cleanUrl}" />
<link rel="image_src" href="${seoThumbnailUrl}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${cleanUrl}" />
<meta property="og:image" content="${seoThumbnailUrl}" />
<meta property="og:image:secure_url" content="${seoThumbnailUrl}" />
<meta property="og:image:width" content="${customDim.width}" />
<meta property="og:image:height" content="${customDim.height}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:alt" content="${regionName} ${taskName} 전문 시공 바름공간" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${seoThumbnailUrl}" />
<script type="application/ld+json" id="jsonld-schema">
${JSON.stringify(schemas)}
</script>
</head>`;
      html = html.replace('</head>', seoTags);

      const isTestB = testBKeywords.has(kParam);
      let botContent = '';

      if (engineVersion === 'V3') {
        const v3Data = buildV3Content(matchedRegion, matchedService);
        const v3Links = buildV3InternalLinks(matchedRegion, matchedService);
        botContent = `
<div id="root">
  <div style="max-width:800px; margin:0 auto; padding:40px 20px; font-family:sans-serif; color:#333;">
    <h1 style="font-size:2.5rem; color:#183f35; margin-bottom:10px;">${v3Data.h1Text}</h1>
    <p style="font-size:1.1rem; font-weight:600; color:#556b2f; margin-bottom:20px;">${v3Data.heroIntro}</p>
    ${isTestB ? `<div style="margin-bottom:25px;"><img src="${seoThumbnailUrl}" alt="${matchedRegion.displayName} ${matchedService.keyword} 시공 현장" style="max-width:100%; height:auto; border-radius:4px;" /></div>` : ''}
    <p style="font-size:1.05rem; line-height:1.6; margin-bottom:30px;">${v3Data.metaContextText}</p>
    
    ${v3Data.h2Sections.map(sec => `
    <section style="margin-bottom:32px;">
      <h2 style="font-size:1.5rem; color:#183f35; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:14px;">${sec.title}</h2>
      ${sec.paragraphs.map(p => `<p style="font-size:1rem; line-height:1.7; color:#444; margin-bottom:12px;">${p}</p>`).join('')}
    </section>`).join('')}

    <section style="background-color:#f4f6f0; border-left:4px solid #183f35; border-radius:4px; padding:20px; margin-bottom:32px;">
      <h2 style="font-size:1.3rem; color:#183f35; margin:0 0 14px 0;">시공 전 소비자 필수 점검 리스트</h2>
      <ul style="list-style:none; padding:0; margin:0;">
        ${v3Data.checklist.map(item => `
        <li style="margin-bottom:10px; font-size:0.95rem; line-height:1.5; color:#333;">
          <strong style="color:#183f35;">✓ ${item.title}:</strong> ${item.desc}
        </li>`).join('')}
      </ul>
    </section>

    <h2 style="font-size:1.5rem; color:#183f35; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:16px;">시공 관련 자주 묻는 질문(FAQ)</h2>
    <ul style="list-style:none; padding:0; margin:0 0 40px 0;">
      ${v3Data.faqs.map(f => `
      <li style="margin-bottom:16px; border-bottom:1px dashed #eee; padding-bottom:12px;">
        <strong style="color:#183f35; display:block; margin-bottom:4px;">Q: ${f.q}</strong>
        <span style="color:#666; font-size:0.95rem;">A: ${f.a}</span>
      </li>`).join('')}
    </ul>

    <!-- SEO ENGINE V3 INTERNAL LINK ENGINE (SSR HTML DISCOVERY) -->
    <div style="background-color:#f9f8f3; border:1px solid #e2dec9; border-radius:8px; padding:24px; margin-bottom:32px;">
      ${v3Links.sameRegionTasks.length > 0 ? `
      <div style="margin-bottom:20px;">
        <h3 style="font-size:1.15rem; color:#183f35; margin:0 0 10px 0;">관련 탄성코트 서비스 안내</h3>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:10px;">
          ${v3Links.sameRegionTasks.map(link => `
          <li><a href="${link.href}" style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid #ccc; border-radius:4px; color:#183f35; text-decoration:none; font-size:0.95rem;">${link.label}</a></li>`).join('')}
        </ul>
      </div>` : ''}

      ${v3Links.sameDistrictRegions.length > 0 ? `
      <div style="margin-bottom:20px;">
        <h3 style="font-size:1.15rem; color:#183f35; margin:0 0 10px 0;">${v3Links.sameDistrictTitle}</h3>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:10px;">
          ${v3Links.sameDistrictRegions.map(link => `
          <li><a href="${link.href}" style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid #ccc; border-radius:4px; color:#556b2f; text-decoration:none; font-size:0.95rem;">${link.label}</a></li>`).join('')}
        </ul>
      </div>` : ''}

      ${v3Links.parentRegionLink ? `
      <div style="margin-bottom:20px;">
        <h3 style="font-size:1.15rem; color:#183f35; margin:0 0 10px 0;">${v3Links.parentRegionTitle}</h3>
        <div>
          <a href="${v3Links.parentRegionLink.href}" style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid #183f35; border-radius:4px; color:#183f35; text-decoration:none; font-weight:bold; font-size:0.95rem;">${v3Links.parentRegionLink.label} &rarr;</a>
        </div>
      </div>` : ''}

      <div>
        <a href="${v3Links.hubLink.href}" style="color:#0076ff; font-weight:bold; text-decoration:none; font-size:0.95rem;">${v3Links.hubLink.label} &rarr;</a>
      </div>
    </div>
    
    <div style="border-top:1px solid #ddd; padding-top:20px;">
      <a href="/" style="color:#0076ff; text-decoration:none;">바름공간 메인 홈페이지 바로가기</a>
    </div>
  </div>
</div>`;
      } else if (engineVersion === 'V2') {
        const v2Data = buildV2Content(matchedRegion, matchedService);
        const v2Links = buildV2InternalLinks(matchedRegion, matchedService);
        botContent = `
<div id="root">
  <div style="max-width:800px; margin:0 auto; padding:40px 20px; font-family:sans-serif; color:#333;">
    <h1 style="font-size:2.5rem; color:#183f35; margin-bottom:10px;">${v2Data.h1Text}</h1>
    <p style="font-size:1.1rem; font-weight:600; color:#556b2f; margin-bottom:20px;">${v2Data.heroIntro}</p>
    ${isTestB ? `<div style="margin-bottom:25px;"><img src="${seoThumbnailUrl}" alt="${matchedRegion.displayName} ${matchedService.keyword} 시공 현장" style="max-width:100%; height:auto; border-radius:4px;" /></div>` : ''}
    <p style="font-size:1.05rem; line-height:1.6; margin-bottom:30px;">${v2Data.metaContextText}</p>
    
    ${v2Data.h2Sections.map(sec => `
    <section style="margin-bottom:32px;">
      <h2 style="font-size:1.5rem; color:#183f35; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:14px;">${sec.title}</h2>
      ${sec.paragraphs.map(p => `<p style="font-size:1rem; line-height:1.7; color:#444; margin-bottom:12px;">${p}</p>`).join('')}
    </section>`).join('')}

    <h2 style="font-size:1.5rem; color:#183f35; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:16px;">시공 관련 자주 묻는 질문(FAQ)</h2>
    <ul style="list-style:none; padding:0; margin:0 0 40px 0;">
      ${v2Data.faqs.map(f => `
      <li style="margin-bottom:16px; border-bottom:1px dashed #eee; padding-bottom:12px;">
        <strong style="color:#183f35; display:block; margin-bottom:4px;">Q: ${f.q}</strong>
        <span style="color:#666; font-size:0.95rem;">A: ${f.a}</span>
      </li>`).join('')}
    </ul>

    <!-- SEO ENGINE V2 INTERNAL LINK ENGINE (SSR HTML DISCOVERY) -->
    <div style="background-color:#f9f8f3; border:1px solid #e2dec9; border-radius:8px; padding:24px; margin-bottom:32px;">
      ${v2Links.sameRegionTasks.length > 0 ? `
      <div style="margin-bottom:20px;">
        <h3 style="font-size:1.15rem; color:#183f35; margin:0 0 10px 0;">관련 탄성코트 서비스 안내</h3>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:10px;">
          ${v2Links.sameRegionTasks.map(link => `
          <li><a href="${link.href}" style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid #ccc; border-radius:4px; color:#183f35; text-decoration:none; font-size:0.95rem;">${link.label}</a></li>`).join('')}
        </ul>
      </div>` : ''}

      ${v2Links.sameDistrictRegions.length > 0 ? `
      <div style="margin-bottom:20px;">
        <h3 style="font-size:1.15rem; color:#183f35; margin:0 0 10px 0;">${v2Links.sameDistrictTitle}</h3>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:10px;">
          ${v2Links.sameDistrictRegions.map(link => `
          <li><a href="${link.href}" style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid #ccc; border-radius:4px; color:#556b2f; text-decoration:none; font-size:0.95rem;">${link.label}</a></li>`).join('')}
        </ul>
      </div>` : ''}

      ${v2Links.parentRegionLink ? `
      <div style="margin-bottom:20px;">
        <h3 style="font-size:1.15rem; color:#183f35; margin:0 0 10px 0;">${v2Links.parentRegionTitle}</h3>
        <div>
          <a href="${v2Links.parentRegionLink.href}" style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid #183f35; border-radius:4px; color:#183f35; text-decoration:none; font-weight:bold; font-size:0.95rem;">${v2Links.parentRegionLink.label} &rarr;</a>
        </div>
      </div>` : ''}

      <div>
        <a href="${v2Links.hubLink.href}" style="color:#0076ff; font-weight:bold; text-decoration:none; font-size:0.95rem;">${v2Links.hubLink.label} &rarr;</a>
      </div>
    </div>
    
    <div style="border-top:1px solid #ddd; padding-top:20px;">
      <a href="/" style="color:#0076ff; text-decoration:none;">바름공간 메인 홈페이지 바로가기</a>
    </div>
  </div>
</div>`;
      } else {
        botContent = `
<div id="root">
  <div style="max-width:800px; margin:0 auto; padding:40px 20px; font-family:sans-serif; color:#333;">
    <h1 style="font-size:2.5rem; color:#183f35; margin-bottom:10px;">${regionName} ${taskName}</h1>
    <p style="font-size:1.1rem; font-weight:600; color:#556b2f; margin-bottom:20px;">${upperNotice}</p>
    ${isTestB ? `<div style="margin-bottom:25px;"><img src="${seoThumbnailUrl}" alt="${matchedRegion.displayName} ${matchedService.keyword} 시공 현장" style="max-width:100%; height:auto; border-radius:4px;" /></div>` : ''}
    <p style="font-size:1.05rem; line-height:1.6; margin-bottom:30px;">${desc}</p>
    
    <h2 style="font-size:1.5rem; color:#183f35; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:16px;">시공 관련 자주 묻는 질문(FAQ)</h2>
    <ul style="list-style:none; padding:0; margin:0 0 40px 0;">`;
      
        matchedService.faqSet.forEach(q => {
          botContent += `
      <li style="margin-bottom:16px; border-bottom:1px dashed #eee; padding-bottom:12px;">
        <strong style="color:#183f35; display:block; margin-bottom:4px;">Q: ${q}</strong>
        <span style="color:#666; font-size:0.95rem;">A: ${FAQ_CATALOG[q] || '상세 시공 문의 시 전문 답변을 준비해 드립니다.'}</span>
      </li>`;
        });
      
        botContent += `
    </ul>
    
    <div style="border-top:1px solid #ddd; padding-top:20px;">
      <a href="/" style="color:#0076ff; text-decoration:none;">바름공간 메인 홈페이지 바로가기</a>
    </div>
  </div>
</div>`;
      }

      html = html.replace('<div id="root"></div>', botContent);

      // Prevent shared CDN cache pollution and ensure search engines check for updates
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }
  }

  if (pathname === '/' || pathname === '/index.html') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // If page is not matched, return 404
  html = html.replace(/<title>.*?<\/title>/, "<title>페이지를 찾을 수 없습니다 | 바름공간</title>");
  html = html.replace('</head>', '<meta name="robots" content="noindex, follow" />\n</head>');
  html = html.replace('<div id="root"></div>', '<div id="root" style="padding:50px; text-align:center;"><h1>페이지를 찾을 수 없습니다. (404 Not Found)</h1></div>');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(404).send(html);
}
