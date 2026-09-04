import https from 'https';
import crypto from 'crypto';
import { URL } from 'url';

const clean3 = [
  '배양동-탄성코트',
  '안녕동-탄성코트',
  '황계동-탄성코트'
];

const groupE = [
  '천호동-탄성코트',
  '천호동-세탁실탄성코트',
  '대치동-탄성코트'
];

const nonTest = [
  '성수동-탄성코트',
  '신림동-탄성코트'
];

const uas = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  yeti: 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)'
};

function fetchRaw(targetUrl, ua) {
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

async function run() {
  console.log('=== VERIFYING LIVE PRODUCTION STATIC DELIVERY PARITY ===\n');

  console.log('--- CLEAN 3 URLs (배양동, 안녕동, 황계동) STATIC DELIVERY VERIFICATION ---');
  for (const k of clean3) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    const yetiRes = await fetchRaw(url, uas.yeti);
    const chromeRes = await fetchRaw(url, uas.chrome);

    const ogImg = (yetiRes.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const bodyImgs = yetiRes.body.match(/<img\s+[^>]*?>/gi) || [];

    const isStatic = yetiRes.length < 3000 && !yetiRes.headers['x-vercel-id']?.includes('iad1');
    const uaParity = yetiRes.hash === chromeRes.hash;

    console.log(`URL: ?k=${k}`);
    console.log(`  HTTP Status:      ${yetiRes.statusCode}`);
    console.log(`  Raw Byte Size:    ${yetiRes.length} bytes`);
    console.log(`  Raw SHA256:       ${yetiRes.hash}`);
    console.log(`  x-vercel-id:      ${yetiRes.headers['x-vercel-id'] || 'NONE'}`);
    console.log(`  x-vercel-cache:   ${yetiRes.headers['x-vercel-cache'] || 'NONE'}`);
    console.log(`  cache-control:    ${yetiRes.headers['cache-control'] || 'NONE'}`);
    console.log(`  etag:             ${yetiRes.headers['etag'] || 'NONE'}`);
    console.log(`  og:image:         ${ogImg}`);
    console.log(`  body imgs count:  ${bodyImgs.length}`);
    console.log(`  User-Agent Parity:${uaParity ? 'YES (100% IDENTICAL)' : 'NO'}`);
    console.log(`  Serverless Bypassed?: ${isStatic ? 'YES (PASS)' : 'NO (Deploying...)'}`);
    console.log('');
  }

  console.log('--- NON-TEST SSR URLs (Scope Leakage Verification) ---');
  for (const k of [...groupE, ...nonTest]) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    const res = await fetchRaw(url, uas.yeti);
    const isSSR = res.length > 8000;

    console.log(`URL: ?k=${k}`);
    console.log(`  Raw Byte Size: ${res.length} bytes`);
    console.log(`  Is SSR Intact?: ${isSSR ? 'YES (PASS)' : 'NO (FAIL)'}`);
    console.log('');
  }
}

run();
