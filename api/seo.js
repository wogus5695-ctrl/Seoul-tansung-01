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
    
    const hubCanonical = "https://seoul-tansung-01.vercel.app/sitemap-seoul";

    // Replace Meta Tags
    html = html.replace(/<title>.*?<\/title>/, "<title>" + hubTitle + "</title>");
    html = html.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="' + hubDesc + '" />');
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="' + hubTitle + '" />');
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="' + hubDesc + '" />');

    // Inject canonical & og:url tags
    html = html.replace('</head>', '<link rel="canonical" href="' + hubCanonical + '" />\n<meta property="og:url" content="' + hubCanonical + '" />\n</head>');

    // Fetch all active production regions
    const activeList = getActiveRegions();
    const seoulList = activeList.filter(r => r.metro === '서울');
    const incheonList = activeList.filter(r => r.metro === '인천');
    const gyeonggiList = activeList.filter(r => r.metro === '경기');

    const seoulDistricts = Array.from(new Set(seoulList.map(r => r.districtName))).sort();
    const seoulGrouped = {};
    seoulDistricts.forEach(dist => {
      seoulGrouped[dist] = seoulList.filter(r => r.districtName === dist);
    });

    const incheonDistricts = Array.from(new Set(incheonList.map(r => r.groupName))).sort();
    const incheonGrouped = {};
    incheonDistricts.forEach(dist => {
      incheonGrouped[dist] = incheonList.filter(r => r.groupName === dist);
    });

    const gyeonggiDistricts = Array.from(new Set(gyeonggiList.map(r => r.groupName))).sort();
    const gyeonggiGrouped = {};
    gyeonggiDistricts.forEach(dist => {
      gyeonggiGrouped[dist] = gyeonggiList.filter(r => r.groupName === dist);
    });

    const metroGroups = [
      { label: '서울 권역', districts: seoulDistricts, grouped: seoulGrouped },
      { label: '인천 권역', districts: incheonDistricts, grouped: incheonGrouped },
      { label: '경기 권역', districts: gyeonggiDistricts, grouped: gyeonggiGrouped }
    ];

    let seoContent = '<div style="padding: 40px; max-width: 1200px; margin: 0 auto; font-family: sans-serif;">';
    seoContent += '<h1 style="font-size: 2rem; color: #183f35; margin-bottom: 20px;">서울·인천·경기 탄성코트·줄눈시공 지역별 페이지 안내</h1>';
    seoContent += '<p style="color: #666; margin-bottom: 40px;">서울·인천·경기 주요 시·구·읍·면·동 단위의 탄성코트 및 줄눈시공 서비스 페이지안내 목록입니다.</p>';

    for (const metro of metroGroups) {
      seoContent += '<div style="margin-bottom: 50px;">';
      seoContent += '<h2 style="font-size: 1.6rem; color: #183f35; border-bottom: 3px solid #183f35; padding-bottom: 10px; margin-bottom: 24px;">' + metro.label + '</h2>';
      seoContent += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">';
      for (const distName of metro.districts) {
        seoContent += '<div style="border: 1px solid #e5e5e5; padding: 20px; border-radius: 4px; background: #fff;">';
        seoContent += '<h3 style="font-size: 1.2rem; color: #183f35; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; margin-bottom: 12px;">' + distName + '</h3>';
        for (const reg of metro.grouped[distName]) {
          seoContent += '<div style="margin-bottom: 14px;">';
          seoContent += '<h4 style="font-size: 0.95rem; color: #555; margin: 4px 0;">' + reg.name + '</h4>';
          seoContent += '<ul style="list-style: none; padding: 0; margin: 0; line-height: 1.6; font-size: 0.85rem;">';
          for (const k of serviceKeywords) {
            const encoded = encodeURIComponent(reg.urlRegion + '-' + k.keyword);
            seoContent += '<li><a href="/?k=' + encoded + '" style="color: #0076ff; text-decoration: none;">' + reg.name + ' ' + k.keyword + '</a></li>';
          }
          seoContent += '</ul>';
          seoContent += '</div>';
        }
        seoContent += '</div>';
      }
      seoContent += '</div>';
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
      const regionName = matchedRegion.displayName;
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
        title = `${regionName} 세탁실탄성코트 | 배관 주변과 벽면 마감`;
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
        desc = `${regionName} ${taskName} 시공 전 기존 벽면의 들뜸 and 오염 상태를 확인하고, 베란다·세탁실 바탕면 정리부터 필요한 마감 범위를 안내합니다.`;
      } else {
        desc = `${regionName} ${taskName} 전 기존 줄눈의 오염과 갈라짐을 확인하고, 필요한 제거 범위와 욕실 환경에 맞는 자재·색상을 안내합니다.`;
      }

      // Inject Meta Tags into HTML
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);

      // Clean parameter representation (strips tracking tags)
      const cleanCanonical = `https://seoul-tansung-01.vercel.app/?k=${encodeURIComponent(matchedRegion.urlRegion + '-' + taskName)}` + (usePreview ? '&preview=true' : '');
      const seoThumbnailUrl = "https://seoul-tansung-01.vercel.app/images/seo/bareumgonggan-search-thumbnail-v1.png";
      
      const additionalMetaTags = `
<link rel="canonical" href="${cleanCanonical}" />
<meta property="og:url" content="${cleanCanonical}" />
<meta property="og:image" content="${seoThumbnailUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="1200" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="바름공간 탄성코트·줄눈시공 전문 업체" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${seoThumbnailUrl}" />
<meta name="twitter:image:alt" content="바름공간 탄성코트·줄눈시공 전문 업체" />
<link rel="image_src" href="${seoThumbnailUrl}" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${title}",
  "description": "${desc}",
  "url": "${cleanCanonical}",
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "${seoThumbnailUrl}",
    "width": 1200,
    "height": 1200
  }
}
</script>
</head>`;
      
      html = html.replace('</head>', additionalMetaTags);

      // 3. Pre-render Content split by Service Group
      let bodyHtml = "";
      if (matchedService.serviceGroup === 'elastic') {
        bodyHtml = `
          <div style="padding: 20px; font-family: sans-serif; line-height: 1.6;">
            <h1>${regionName} ${taskName}</h1>
            <p><strong>공간 구분:</strong> ${matchedService.primarySpace}</p>
            <h2>히어로 소개</h2>
            <p>${matchedService.heroTitleTemplate} - ${matchedService.heroDescriptionTemplate}</p>
            
            <h2>탄성코트 핵심 마감 설명</h2>
            <ul>
              <li>베란다·세탁실·다용도실 벽면 노후 분석</li>
              <li>기존 페인트 도장막 들뜸 및 곰팡이 유발 부위 긁어내기</li>
              <li>균열 틈새 실리콘 보강 보수 진행</li>
              <li>단순 결로 관리와 배관 주위 누수 원인의 선행 구분 검토</li>
              <li>경화 시점의 자연스러운 건조 및 환기 프로세스</li>
              <li>친환경 마모 방지 세라믹 펄 색상 선정</li>
            </ul>

            <h2>시공 과정 안내</h2>
            <ol>
              <li>사진 상담: 공간 상태와 부식 부위의 사진을 확인합니다.</li>
              <li>기존 상태 확인: 도막 들뜸과 누수 징후를 판별합니다.</li>
              <li>범위·자재 안내: 작업 면적과 자재 특성을 공유합니다.</li>
              <li>바탕 정리·시공: 친환경 탄성코팅재 정밀 스프레이 분사를 진행합니다.</li>
              <li>마감 검수: 도포 도막 두께 확인 및 세부 양생 가이드를 전송합니다.</li>
            </ol>

            <h2>자주 묻는 질문 (FAQ)</h2>
            <dl>
              ${matchedService.faqSet.map(q => `
                <dt><strong>Q. ${q}</strong></dt>
                <dd>A. 시공 전 환경 진단과 전문 전처리를 통해 안전하고 오래 유지되는 시공 품질을 보증합니다.</dd>
              `).join('')}
            </dl>
          </div>
        `;
      } else {
        bodyHtml = `
          <div style="padding: 20px; font-family: sans-serif; line-height: 1.6;">
            <h1>${regionName} ${taskName}</h1>
            <p><strong>공간 구분:</strong> ${matchedService.primarySpace}</p>
            <h2>히어로 소개</h2>
            <p>${matchedService.heroTitleTemplate} - ${matchedService.heroDescriptionTemplate}</p>
            
            <h2>줄눈시공 핵심 마감 설명</h2>
            <ul>
              <li>욕실·화장실·현관·베란다 타일 틈의 시멘트 노화 점검</li>
              <li>기존 백시멘트 줄눈 균일 깊이(기초 파내기) 홈파기 처리</li>
              <li>타일 옆면 접착면 확보를 통한 이탈성 탈락 방지</li>
              <li>습기가 장기 고이는 샤워부스 및 욕실 바닥 친환경 줄눈제 배합</li>
              <li>현관 및 오염 부위 은펄, 실버 등 맞춤형 인테리어 조색 선택</li>
              <li>건조 시간 동안의 통행 차단 및 안전 양생 관리</li>
            </ul>

            <h2>시공 과정 안내</h2>
            <ol>
              <li>사진 상담: 타일 간격 및 실리콘 손상부 사진을 분석합니다.</li>
              <li>기존 상태 확인: 백시멘트 강도와 균열 상태를 진단합니다.</li>
              <li>범위·자재 안내: 줄눈 홈 깊이 설계와 조색을 의논합니다.</li>
              <li>바탕 정리·시공: 숙련된 충진기를 사용하여 친환경 줄눈제를 홈에 정밀 주입합니다.</li>
              <li>마감 검수: 표면 광택 상태 확인 및 양생 완료 시점 안내를 완료합니다.</li>
            </ol>

            <h2>자주 묻는 질문 (FAQ)</h2>
            <dl>
              ${matchedService.faqSet.map(q => `
                <dt><strong>Q. ${q}</strong></dt>
                <dd>A. 시공 전 환경 진단과 전문 전처리를 통해 안전하고 오래 유지되는 시공 품질을 보증합니다.</dd>
              `).join('')}
            </dl>
          </div>
        `;
      }

      html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } else {
      // Return HTTP 404 with standard Error HTML and noindex
      const errorTitle = "페이지를 찾을 수 없습니다";
      const errorDesc = "요청하신 시공 정보 또는 지역명이 정확하지 않습니다.";

      html = html.replace(/<title>.*?<\/title>/, `<title>${errorTitle}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${errorDesc}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${errorTitle}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${errorDesc}" />`);

      // Inject noindex meta, remove og:url / canonical tags
      html = html.replace('</head>', `<meta name="robots" content="noindex, follow" />\n</head>`);

      const errorBody = `
        <div style="padding: 80px 20px; font-family: sans-serif; text-align: center;">
          <h1 style="font-size: 2rem; color: #183f35; margin-bottom: 16px;">요청한 페이지를 찾을 수 없습니다</h1>
          <p style="color: #666; margin-bottom: 30px; font-size: 1.05rem; line-height: 1.6;">
            입력한 지역명 또는 시공 서비스가 등록되어 있지 않습니다.<br />
            지역별 페이지 안내에서 정상적인 서비스 페이지를 확인해 주세요.
          </p>
          <div style="display: flex; justify-content: center; gap: 16px;">
            <a href="/" style="display: inline-block; padding: 12px 24px; background-color: #183f35; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">메인 페이지로 이동</a>
            <a href="/sitemap-seoul" style="display: inline-block; padding: 12px 24px; border: 1px solid #183f35; color: #183f35; text-decoration: none; border-radius: 4px; font-weight: bold;">서울 지역별 페이지 확인</a>
          </div>
        </div>
      `;
      html = html.replace('<div id="root"></div>', `<div id="root">${errorBody}</div>`);
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(html);
    }
  }

  // Fallback to serving the normal main page HTML
  const mainCanonical = "https://seoul-tansung-01.vercel.app/";
  html = html.replace('</head>', `<link rel="canonical" href="${mainCanonical}" />\n<meta property="og:url" content="${mainCanonical}" />\n</head>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
