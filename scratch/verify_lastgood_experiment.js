import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import { URL } from 'url';

const eGroup = [
  '천호동-탄성코트',
  '천호동-세탁실탄성코트',
  '대치동-탄성코트'
];

const nGroup = [
  '원동-탄성코트',
  '오산동-탄성코트',
  '부산동-탄성코트'
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

async function run() {
  console.log('=== LAST-KNOWN-GOOD / NEOCOAT PARITY EXPERIMENT AUDIT ===\n');

  console.log('--- GROUP E (Existing Indexed URLs - 3 URLs) ---');
  for (const k of eGroup) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    const res = await fetchRaw(url);
    const ogImg = (res.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const bodyImgs = res.body.match(/<img\s+[^>]*?>/gi) || [];

    console.log(`URL: ?k=${k}`);
    console.log(`  HTTP Status: ${res.statusCode}`);
    console.log(`  og:image:    ${ogImg}`);
    console.log(`  body imgs:   ${bodyImgs.length}`);
    console.log(`  Neocoat Parity?: ${ogImg.includes('bareumgonggan-search-thumbnail-v2.jpg') && bodyImgs.length === 0 ? 'YES (PASS)' : 'NO'}`);
    console.log('');
  }

  console.log('--- GROUP N (CLEAN New Region URLs - 3 URLs) ---');
  for (const k of nGroup) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    const res = await fetchRaw(url);
    const ogImg = (res.body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i) || [])[1] || 'NONE';
    const bodyImgs = res.body.match(/<img\s+[^>]*?>/gi) || [];

    console.log(`URL: ?k=${k}`);
    console.log(`  HTTP Status: ${res.statusCode}`);
    console.log(`  og:image:    ${ogImg}`);
    console.log(`  body imgs:   ${bodyImgs.length}`);
    console.log(`  Neocoat Parity?: ${ogImg.includes('bareumgonggan-search-thumbnail-v2.jpg') && bodyImgs.length === 0 ? 'YES (PASS)' : 'NO'}`);
    console.log('');
  }
}

run();
