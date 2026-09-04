import https from 'https';
import crypto from 'crypto';
import { URL } from 'url';

const neocoatUrl = 'https://www.neocoat.co.kr/?k=%EC%B2%9C%ED%98%B8%EB%8F%99-%EC%84%B8%ED%83%81%EC%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8';
const barumUrl = 'https://www.barumspace.co.kr/?k=%EB%B0%B0%EC%96%91%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8';

function fetchHeaders(targetUrl, ua = 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)') {
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
  console.log('=== DELIVERY ARCHITECTURE AUDIT ===\n');

  console.log('--- NEOCOAT PRODUCTION DELIVERY RESPONSE ---');
  const neo = await fetchHeaders(neocoatUrl);
  console.log(`URL: ${neocoatUrl}`);
  console.log(`HTTP Status:      ${neo.statusCode}`);
  console.log(`x-vercel-id:      ${neo.headers['x-vercel-id'] || 'NONE'}`);
  console.log(`x-vercel-cache:   ${neo.headers['x-vercel-cache'] || 'NONE'}`);
  console.log(`cache-control:    ${neo.headers['cache-control'] || 'NONE'}`);
  console.log(`etag:             ${neo.headers['etag'] || 'NONE'}`);
  console.log(`age:              ${neo.headers['age'] || 'NONE'}`);
  console.log(`content-encoding: ${neo.headers['content-encoding'] || 'NONE'}`);
  console.log(`content-length:   ${neo.headers['content-length'] || 'NONE'}`);
  console.log(`server:           ${neo.headers['server'] || 'NONE'}`);
  console.log(`Body Length:      ${neo.length} bytes`);
  console.log(`Body SHA256:      ${neo.hash}`);
  console.log('');

  console.log('--- BAREUMGONGGAN PRODUCTION DELIVERY RESPONSE ---');
  const barum = await fetchHeaders(barumUrl);
  console.log(`URL: ${barumUrl}`);
  console.log(`HTTP Status:      ${barum.statusCode}`);
  console.log(`x-vercel-id:      ${barum.headers['x-vercel-id'] || 'NONE'}`);
  console.log(`x-vercel-cache:   ${barum.headers['x-vercel-cache'] || 'NONE'}`);
  console.log(`cache-control:    ${barum.headers['cache-control'] || 'NONE'}`);
  console.log(`etag:             ${barum.headers['etag'] || 'NONE'}`);
  console.log(`age:              ${barum.headers['age'] || 'NONE'}`);
  console.log(`content-encoding: ${barum.headers['content-encoding'] || 'NONE'}`);
  console.log(`content-length:   ${barum.headers['content-length'] || 'NONE'}`);
  console.log(`server:           ${barum.headers['server'] || 'NONE'}`);
  console.log(`Body Length:      ${barum.length} bytes`);
  console.log(`Body SHA256:      ${barum.hash}`);
}

run();
