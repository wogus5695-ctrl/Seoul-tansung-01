import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const pastKeyword = '남현동-탄성코트시공';
const pastUrl = `https://www.barumspace.co.kr/?k=${encodeURIComponent(pastKeyword)}`;

const currentKeywords = [
  '당왕동-탄성코트',
  '석정동-탄성코트',
  '안성-숭인동-탄성코트',
  '안성-영동-탄성코트',
  '옥산동-탄성코트'
];

const testUrls = [
  { name: 'TEST A', k: '개봉동-탄성코트', file: 'bareumgonggan-search-thumbnail-test-a.jpg' },
  { name: 'TEST B', k: '삼성동-탄성코트', file: 'bareumgonggan-search-thumbnail-test-b.jpg' },
  { name: 'TEST C', k: '개봉동-세탁실탄성코트', file: 'bareumgonggan-search-thumbnail-test-c.jpg' }
];

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    }).on('error', reject);
  });
}

function analyzeHtml(html) {
  const getMeta = (prop) => {
    const m = html.match(new RegExp(`<meta\\s+[^>]*?(?:property|name)="${prop}"\\s+content="([^"]*)"[^>]*?>`, 'i'));
    return m ? m[1] : null;
  };
  const getLink = (rel) => {
    const m = html.match(new RegExp(`<link\\s+[^>]*?rel="${rel}"\\s+href="([^"]*)"[^>]*?>`, 'i'));
    return m ? m[1] : null;
  };
  
  const ogImage = getMeta('og:image');
  const ogImageSecure = getMeta('og:image:secure_url');
  const ogImageType = getMeta('og:image:type');
  const ogImageWidth = getMeta('og:image:width');
  const ogImageHeight = getMeta('og:image:height');
  const ogImageAlt = getMeta('og:image:alt');
  const imageSrc = getLink('image_src');
  const twitterImage = getMeta('twitter:image');
  
  // JSON-LD
  let jsonLdImage = null;
  const jsonLdMatch = html.match(/<script\s+[^>]*?type="application\/ld\+json"[^>]*?>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      const imgM = block.match(/"image"\s*:\s*"([^"]+)"/);
      if (imgM) {
        jsonLdImage = imgM[1];
        break;
      }
    }
  }
  
  // Body img tags
  const bodyImgs = [];
  const imgRegex = /<img\s+[^>]*?src="([^"]*)"[^>]*?>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    bodyImgs.push(match[1]);
  }
  
  // Picture/source tags
  const pictureCount = (html.match(/<picture[^>]*>/gi) || []).length;
  
  // CSS background-image
  const bgImgs = [];
  const bgRegex = /background-image\s*:\s*url\(([^)]+)\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    bgImgs.push(match[1]);
  }
  
  const candidates = [ogImage, ogImageSecure, imageSrc, twitterImage, jsonLdImage].filter(Boolean);
  
  return {
    ogImage,
    ogImageSecure,
    ogImageType,
    ogImageWidth,
    ogImageHeight,
    ogImageAlt,
    imageSrc,
    twitterImage,
    jsonLdImage,
    bodyImgs,
    pictureCount,
    bgImgs,
    candidateCount: candidates.length
  };
}

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return 'NOT_FOUND';
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function run() {
  console.log('=== STEP 2 AUDIT SCRIPT START ===\n');

  console.log('--- 1. PAST EXPOSED URL CHECK ---');
  const pastRes = await fetchUrl(pastUrl);
  console.log(`URL: ${pastUrl}`);
  console.log(`Status: ${pastRes.statusCode}`);
  const pastAnalysis = analyzeHtml(pastRes.body);
  console.log(`  og:image: ${pastAnalysis.ogImage}`);
  console.log(`  image_src: ${pastAnalysis.imageSrc}`);
  console.log(`  json-ld: ${pastAnalysis.jsonLdImage}`);
  console.log(`  body img count: ${pastAnalysis.bodyImgs.length}`);
  console.log(`  Candidate Count: ${pastAnalysis.candidateCount}`);

  console.log('\n--- 2. CURRENT 5 NON-EXPOSED URLS CHECK ---');
  for (const kw of currentKeywords) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(kw)}`;
    const res = await fetchUrl(url);
    console.log(`URL: ${url} (${kw})`);
    console.log(`Status: ${res.statusCode}`);
    const analysis = analyzeHtml(res.body);
    console.log(`  og:image: ${analysis.ogImage}`);
    console.log(`  image_src: ${analysis.imageSrc}`);
    console.log(`  json-ld: ${analysis.jsonLdImage}`);
    console.log(`  body img count: ${analysis.bodyImgs.length}`);
    console.log(`  Candidate Count: ${analysis.candidateCount}`);
  }

  console.log('\n--- 3. TEST URLS CHECK ---');
  for (const t of testUrls) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(t.k)}`;
    const res = await fetchUrl(url);
    const analysis = analyzeHtml(res.body);
    console.log(`${t.name} (${t.k}):`);
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  og:image: ${analysis.ogImage}`);
    console.log(`  image_src: ${analysis.imageSrc}`);
    console.log(`  json-ld: ${analysis.jsonLdImage}`);
  }

  console.log('\n--- 4. IMAGE HASHES ---');
  const imgDir = path.join(process.cwd(), 'public/images/seo');
  const files = ['bareumgonggan-search-thumbnail-v2.jpg', 'bareumgonggan-search-thumbnail-test-a.jpg', 'bareumgonggan-search-thumbnail-test-b.jpg', 'bareumgonggan-search-thumbnail-test-c.jpg'];
  for (const f of files) {
    const fp = path.join(imgDir, f);
    const hash = getFileHash(fp);
    const size = fs.existsSync(fp) ? fs.statSync(fp).size : 0;
    console.log(`${f}:`);
    console.log(`  Size: ${size} bytes`);
    console.log(`  SHA256: ${hash}`);
  }
}

run();
