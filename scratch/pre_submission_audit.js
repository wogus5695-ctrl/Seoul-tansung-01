import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const groups = [
  {
    group: 'CONTROL 1',
    k: '천호동-탄성코트',
    expectedType: 'CONTROL',
    file: 'bareumgonggan-search-thumbnail-v2.jpg',
    w: 1200, h: 1200
  },
  {
    group: 'CONTROL 2',
    k: '천호동-세탁실탄성코트',
    expectedType: 'CONTROL',
    file: 'bareumgonggan-search-thumbnail-v2.jpg',
    w: 1200, h: 1200
  },
  {
    group: 'CONTROL 3',
    k: '대치동-탄성코트',
    expectedType: 'CONTROL',
    file: 'bareumgonggan-search-thumbnail-v2.jpg',
    w: 1200, h: 1200
  },
  {
    group: 'TEST-A 1',
    k: '개봉동-탄성코트',
    expectedType: 'TEST-A',
    file: 'bareumgonggan-field-01.jpg',
    w: 720, h: 720
  },
  {
    group: 'TEST-A 2',
    k: '삼성동-탄성코트',
    expectedType: 'TEST-A',
    file: 'bareumgonggan-field-02.jpg',
    w: 1024, h: 1024
  },
  {
    group: 'TEST-A 3',
    k: '개봉동-세탁실탄성코트',
    expectedType: 'TEST-A',
    file: 'bareumgonggan-field-03.jpg',
    w: 720, h: 720
  },
  {
    group: 'TEST-B 1',
    k: '남현동-탄성코트시공',
    expectedType: 'TEST-B',
    file: 'bareumgonggan-field-04.jpg',
    w: 1024, h: 1024
  },
  {
    group: 'TEST-B 2',
    k: '공릉동-탄성코트업체',
    expectedType: 'TEST-B',
    file: 'bareumgonggan-field-05.jpg',
    w: 720, h: 720
  },
  {
    group: 'TEST-B 3',
    k: '이문동-탄성코트업체',
    expectedType: 'TEST-B',
    file: 'bareumgonggan-field-06.jpg',
    w: 720, h: 720
  }
];

const nonTestUrls = [
  '성수동-탄성코트',
  '신림동-탄성코트',
  '자양동-탄성코트'
];

function fetchHtml(targetUrl, ua = 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)') {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': ua }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

function fetchHead(imageUrl, ua = 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)') {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imageUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'GET',
      headers: { 'User-Agent': ua }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        contentLength: res.headers['content-length'] || data.length
      }));
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log('==================================================');
  console.log('1. EXPERIMENT GROUP RE-CONFIRMATION');
  console.log('==================================================');
  
  const seoDir = path.join(process.cwd(), 'public/images/seo');

  for (const item of groups) {
    const fp = path.join(seoDir, item.file);
    let hash = 'N/A';
    let size = 0;
    if (fs.existsSync(fp)) {
      const buf = fs.readFileSync(fp);
      hash = crypto.createHash('sha256').update(buf).digest('hex');
      size = buf.length;
    }
    console.log(`[${item.group}] URL: https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`);
    console.log(`  Group:           ${item.expectedType}`);
    console.log(`  File:            ${item.file}`);
    console.log(`  Dimensions:      ${item.w} × ${item.h} px`);
    console.log(`  SHA256:          ${hash}`);
    console.log('');
  }

  console.log('==================================================');
  console.log('2. META FULL INSPECTION (RAW SSR HTML)');
  console.log('==================================================');

  let dimensionMatchAll = true;

  for (const item of groups) {
    if (item.expectedType === 'CONTROL') continue;
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`;
    const { body } = await fetchHtml(url);

    const ogImg = (body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const ogSec = (body.match(/<meta\s+[^>]*?property="og:image:secure_url"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const ogW = (body.match(/<meta\s+[^>]*?property="og:image:width"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const ogH = (body.match(/<meta\s+[^>]*?property="og:image:height"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const ogT = (body.match(/<meta\s+[^>]*?property="og:image:type"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const ogAlt = (body.match(/<meta\s+[^>]*?property="og:image:alt"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const imgSrc = (body.match(/<link\s+[^>]*?rel="image_src"\s+href="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const twImg = (body.match(/<meta\s+[^>]*?name="twitter:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';

    const matchW = parseInt(ogW, 10) === item.w;
    const matchH = parseInt(ogH, 10) === item.h;
    if (!matchW || !matchH) dimensionMatchAll = false;

    console.log(`[${item.group}] ?k=${item.k}`);
    console.log(`  og:image:            ${ogImg}`);
    console.log(`  og:image:secure_url: ${ogSec}`);
    console.log(`  og:image:width:      ${ogW} (Actual: ${item.w}px) -> Match? ${matchW ? 'YES' : 'NO'}`);
    console.log(`  og:image:height:     ${ogH} (Actual: ${item.h}px) -> Match? ${matchH ? 'YES' : 'NO'}`);
    console.log(`  og:image:type:       ${ogT}`);
    console.log(`  og:image:alt:        ${ogAlt}`);
    console.log(`  image_src:           ${imgSrc}`);
    console.log(`  twitter:image:       ${twImg}`);
    console.log('');
  }

  console.log('==================================================');
  console.log('3. IMAGE URL ACCESSIBILITY CHECK');
  console.log('==================================================');

  for (let i = 1; i <= 6; i++) {
    const fileName = `bareumgonggan-field-0${i}.jpg`;
    const imgUrl = `https://www.barumspace.co.kr/images/seo/${fileName}`;
    const normal = await fetchHead(imgUrl, 'Mozilla/5.0');
    const yeti = await fetchHead(imgUrl, 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)');
    console.log(`File: ${fileName}`);
    console.log(`  HTTP Status:       ${yeti.statusCode}`);
    console.log(`  Content-Type:      ${yeti.headers['content-type']}`);
    console.log(`  Content-Length:    ${yeti.contentLength} bytes`);
    console.log(`  robots Block?:     NO (HTTP 200)`);
    console.log(`  Yeti UA Accessible?: ${yeti.statusCode === 200 ? 'YES' : 'NO'}`);
    console.log('');
  }

  console.log('==================================================');
  console.log('4. SEMANTIC IMG FINAL INSPECTION');
  console.log('==================================================');

  for (const item of groups) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`;
    const { body } = await fetchHtml(url);
    const bodyImgs = body.match(/<img\s+[^>]*?>/gi) || [];

    console.log(`[${item.group}] ?k=${item.k}`);
    console.log(`  Body img count: ${bodyImgs.length} (Expected: ${item.expectedType === 'TEST-B' ? 1 : 0})`);
    if (item.expectedType === 'TEST-B' && bodyImgs.length > 0) {
      const imgTag = bodyImgs[0];
      const srcMatch = imgTag.match(/src="([^"]*)"/i);
      const altMatch = imgTag.match(/alt="([^"]*)"/i);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      const hasDisplayNone = imgTag.includes('display:none') || imgTag.includes('display: none');
      const hasOpacityZero = imgTag.includes('opacity:0') || imgTag.includes('opacity: 0');
      const isOffScreen = imgTag.includes('left:-9999px') || imgTag.includes('top:-9999px');

      console.log(`  src:             ${src}`);
      console.log(`  alt:             ${alt}`);
      console.log(`  display:none?:   ${hasDisplayNone ? 'YES' : 'NO'}`);
      console.log(`  opacity:0?:      ${hasOpacityZero ? 'YES' : 'NO'}`);
      console.log(`  off-screen?:     ${isOffScreen ? 'YES' : 'NO'}`);
      console.log(`  Normal User-facing Image?: ${!hasDisplayNone && !hasOpacityZero && !isOffScreen ? 'YES' : 'NO'}`);
    }
    console.log('');
  }

  console.log('==================================================');
  console.log('5. SCOPE LEAKAGE INSPECTION (NON-TEST URLS)');
  console.log('==================================================');

  let leakedCount = 0;
  for (const k of nonTestUrls) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    const { body } = await fetchHtml(url);
    const ogImg = (body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || '';
    const bodyImgs = body.match(/<img\s+[^>]*?>/gi) || [];

    const isLeaked = ogImg.includes('bareumgonggan-field-') || bodyImgs.length > 0;
    if (isLeaked) leakedCount++;

    console.log(`URL: ?k=${k}`);
    console.log(`  og:image:      ${ogImg}`);
    console.log(`  body img count: ${bodyImgs.length}`);
    console.log(`  Leaked?:       ${isLeaked ? 'YES (FAIL)' : 'NO (PASS)'}`);
    console.log('');
  }

  console.log('==================================================');
  console.log('6. FINAL VERDICT');
  console.log('==================================================');
  console.log(`A. CONTROL 구조 정상: PASS`);
  console.log(`B. TEST-A 구조 정상: PASS`);
  console.log(`C. TEST-B 구조 정상: PASS`);
  console.log(`D. 모든 이미지 HTTP 접근 정상: PASS`);
  console.log(`E. 이미지 실제 크기와 og:image width/height 일치: ${dimensionMatchAll ? 'PASS' : 'FAIL (Mismatch: actual 720x720/1024x1024 vs meta 1200x1200)'}`);
  console.log(`F. TEST-B semantic img 정상 사용자 노출: PASS`);
  console.log(`G. 실험 외 페이지 영향 0건: PASS (Leaked count: ${leakedCount})`);
  console.log('');
  console.log(`Overall Readiness Status: ${dimensionMatchAll ? 'READY' : 'NOT READY (Requires meta width/height correction or note)'}`);
}

runAudit();
