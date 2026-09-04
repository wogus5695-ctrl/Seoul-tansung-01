import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import { URL } from 'url';

function fetchUrl(targetUrl, ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36') {
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
  console.log('=== NEOCOAT vs BAREUMGONGGAN FORENSIC AUDIT ===\n');

  // Try fetching neocoat homepage and sitemap
  try {
    const home = await fetchUrl('https://www.neocoat.co.kr/');
    console.log('Neocoat Homepage Fetch Status:', home.statusCode);
    console.log('Byte size:', home.length);
    console.log('Head HTML preview:\n', home.body.substring(0, 1000));
  } catch (err) {
    console.error('Error fetching Neocoat homepage:', err.message);
  }

  // Try sitemap.xml
  try {
    const sitemap = await fetchUrl('https://www.neocoat.co.kr/sitemap.xml');
    console.log('Neocoat Sitemap Status:', sitemap.statusCode);
    console.log('Sitemap preview:\n', sitemap.body.substring(0, 1000));
  } catch (err) {
    console.error('Error fetching Neocoat sitemap:', err.message);
  }
}

run();
