import https from 'https';
import { URL } from 'url';

const testCases = [
  // Test Group
  { k: '개봉동-탄성코트', expected: 'bareumgonggan-search-thumbnail-test-a.jpg' },
  { k: '삼성동-탄성코트', expected: 'bareumgonggan-search-thumbnail-test-b.jpg' },
  { k: '개봉동-세탁실탄성코트', expected: 'bareumgonggan-search-thumbnail-test-c.jpg' },
  
  // Control Group
  { k: '천호동-탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  { k: '천호동-세탁실탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' }
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

function extractOgImage(html) {
  const match = html.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i);
  return match ? match[1] : 'N/A';
}

async function run() {
  console.log('=== VERIFYING LIVE PRODUCTION A/B TEST METADATA ===\n');
  
  for (const tc of testCases) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(tc.k)}`;
    try {
      const { statusCode, body } = await fetchUrl(url);
      const ogImage = extractOgImage(body);
      const success = ogImage.includes(tc.expected);
      console.log(`URL: ${url}`);
      console.log(`  HTTP Status: ${statusCode}`);
      console.log(`  og:image:    ${ogImage}`);
      console.log(`  Expected:    ${tc.expected}`);
      console.log(`  Match:       ${success ? 'PASS' : 'FAIL'}`);
      console.log('');
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
    }
  }
}

run();
