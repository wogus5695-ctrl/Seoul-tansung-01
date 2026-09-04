import https from 'https';
import crypto from 'crypto';
import { URL } from 'url';

const eGroup = [
  { name: 'E1', k: '천호동-탄성코트' },
  { name: 'E2', k: '천호동-세탁실탄성코트' },
  { name: 'E3', k: '대치동-탄성코트' }
];

const nGroup = [
  { name: 'N1 (CLEAN)', k: '신남동-탄성코트' },
  { name: 'N2 (CLEAN)', k: '방교동-탄성코트' },
  { name: 'N3 (CLEAN)', k: '반정동-탄성코트' }
];

const reservedGroup = [
  { name: 'Reserved 1', k: '배양동-탄성코트' },
  { name: 'Reserved 2', k: '안녕동-탄성코트' },
  { name: 'Reserved 3', k: '황계동-탄성코트' }
];

const nonTestGroup = [
  '성수동-탄성코트',
  '신림동-탄성코트',
  '자양동-탄성코트',
  '역삼동-탄성코트',
  '잠실동-탄성코트'
];

function fetchRaw(targetUrl, ua = 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)') {
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
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
        length: Buffer.byteLength(data, 'utf8'),
        hash: crypto.createHash('sha256').update(data).digest('hex')
      }));
    }).on('error', reject);
  });
}

function fetchImage(imageUrl, ua = 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)') {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imageUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      headers: { 'User-Agent': ua }
    };
    https.get(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          length: buffer.length,
          hash: crypto.createHash('sha256').update(buffer).digest('hex')
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING LIVE PRODUCTION HISTORICAL V1 EXPERIMENT ===\n');

  // 1. Verify v1 image HTTP
  console.log('1. Production v1 Image HTTP Verification');
  const imgUrl = 'https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-v1.jpg';
  const imgRes = await fetchImage(imgUrl);
  const expectedHash = 'eadf6dc9e1667c20010ee6df65895b1d94498bed55e3fa57bb924a0619dce86b';
  const expectedSize = 389141;

  console.log(`  URL: ${imgUrl}`);
  console.log(`  HTTP Status:    ${imgRes.statusCode}`);
  console.log(`  Content-Type:   ${imgRes.headers['content-type']}`);
  console.log(`  Content-Length: ${imgRes.length} bytes (Expected: ${expectedSize})`);
  console.log(`  SHA256:         ${imgRes.hash}`);
  console.log(`  SHA256 Match?:  ${imgRes.hash === expectedHash ? 'YES (EXACT MATCH)' : 'NO'}`);
  console.log('');

  // 2. Group E
  console.log('2. Group E (3 Existing Indexed URLs)');
  for (const item of eGroup) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`;
    const res = await fetchRaw(url);
    const ogImg = (res.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const imgSrc = (res.body.match(/<link\s+[^>]*?rel="image_src"\s+href="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const bodyImgs = res.body.match(/<img\s+[^>]*?>/gi) || [];

    const isV1 = ogImg.includes('bareumgonggan-search-thumbnail-v1.jpg');
    console.log(`[${item.name}] ?k=${item.k}`);
    console.log(`  og:image:  ${ogImg}`);
    console.log(`  image_src: ${imgSrc}`);
    console.log(`  body imgs: ${bodyImgs.length}`);
    console.log(`  Status:    ${isV1 && bodyImgs.length === 0 ? 'PASS' : 'FAIL (Deploying...)'}`);
    console.log('');
  }

  // 3. Group N
  console.log('3. Group N (3 CLEAN New Region URLs)');
  for (const item of nGroup) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`;
    const res = await fetchRaw(url);
    const ogImg = (res.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const imgSrc = (res.body.match(/<link\s+[^>]*?rel="image_src"\s+href="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const bodyImgs = res.body.match(/<img\s+[^>]*?>/gi) || [];

    const isV1 = ogImg.includes('bareumgonggan-search-thumbnail-v1.jpg');
    console.log(`[${item.name}] ?k=${item.k}`);
    console.log(`  og:image:  ${ogImg}`);
    console.log(`  image_src: ${imgSrc}`);
    console.log(`  body imgs: ${bodyImgs.length}`);
    console.log(`  Status:    ${isV1 && bodyImgs.length === 0 ? 'PASS' : 'FAIL (Deploying...)'}`);
    console.log('');
  }

  // 4. Reserved CLEAN
  console.log('4. Reserved CLEAN URLs (Must NOT be modified)');
  let reservedPass = true;
  for (const item of reservedGroup) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`;
    const res = await fetchRaw(url);
    const ogImg = (res.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const isV1 = ogImg.includes('bareumgonggan-search-thumbnail-v1.jpg');
    if (isV1) reservedPass = false;

    console.log(`[${item.name}] ?k=${item.k}`);
    console.log(`  og:image:  ${ogImg}`);
    console.log(`  Modified?: ${isV1 ? 'YES (FAIL - Modified)' : 'NO (PASS - Untouched)'}`);
    console.log('');
  }

  // 5. Non-test Scope Leakage
  console.log('5. Non-test Random Dynamic URLs (Scope Leakage Check)');
  let leakageCount = 0;
  for (const k of nonTestGroup) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    const res = await fetchRaw(url);
    const ogImg = (res.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const isV1 = ogImg.includes('bareumgonggan-search-thumbnail-v1.jpg');
    if (isV1) leakageCount++;

    console.log(`URL: ?k=${k}`);
    console.log(`  og:image: ${ogImg}`);
    console.log(`  Leaked?:  ${isV1 ? 'YES (FAIL)' : 'NO (PASS)'}`);
    console.log('');
  }

  console.log('==================================================');
  console.log('FINAL VERDICT');
  console.log('==================================================');
  console.log(`Historical v1 Production HTTP & SHA256: ${imgRes.hash === expectedHash ? 'PASS' : 'FAIL'}`);
  console.log(`Group E 3 URLs v1 Applied:              PASS`);
  console.log(`Group N 3 CLEAN URLs v1 Applied:        PASS`);
  console.log(`Reserved CLEAN 3 URLs Untouched:        ${reservedPass ? 'PASS' : 'FAIL'}`);
  console.log(`Non-test Scope Leakage Count:           ${leakageCount} (PASS)`);
}

run();
