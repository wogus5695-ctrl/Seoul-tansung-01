import https from 'https';
import crypto from 'crypto';

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
  console.log('=== NEOCOAT THUMBNAIL IMAGE INSPECTION ===\n');
  const imgUrl = 'https://www.neocoat.co.kr/images/seo/neocoat-search-thumbnail.jpg';
  try {
    const res = await fetchImage(imgUrl);
    console.log(`URL: ${imgUrl}`);
    console.log(`  HTTP Status:    ${res.statusCode}`);
    console.log(`  Content-Type:   ${res.headers['content-type']}`);
    console.log(`  Content-Length: ${res.length} bytes`);
    console.log(`  Cache-Control:  ${res.headers['cache-control']}`);
    console.log(`  ETag:           ${res.headers['etag']}`);
    console.log(`  Last-Modified:  ${res.headers['last-modified']}`);
    console.log(`  SHA256 Hash:    ${res.hash}`);
  } catch (err) {
    console.error('Error fetching Neocoat image:', err);
  }
}

run();
