import https from 'https';

const testImages = [
  'https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-test-a.jpg',
  'https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-test-b.jpg',
  'https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-test-c.jpg'
];

function checkHeaders(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    }).on('error', (err) => {
      resolve({ url, statusCode: 500, error: err.message });
    });
  });
}

async function run() {
  console.log('=== VERIFYING LIVE TEST IMAGE ACCESSIBILITY ===\n');
  for (const img of testImages) {
    const res = await checkHeaders(img);
    console.log(`URL: ${res.url}`);
    console.log(`  Status Code:   ${res.statusCode}`);
    console.log(`  Content-Type:   ${res.contentType}`);
    console.log(`  Content-Length: ${res.contentLength} bytes`);
    console.log('');
  }
}

run();
