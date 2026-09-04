import https from 'https';
import { URL } from 'url';

const urls = [
  // CONTROL
  { name: 'CONTROL 1', k: '천호동-탄성코트', expectedImg: 'bareumgonggan-search-thumbnail-v2.jpg', expectBodyImg: false },
  { name: 'CONTROL 2', k: '천호동-세탁실탄성코트', expectedImg: 'bareumgonggan-search-thumbnail-v2.jpg', expectBodyImg: false },
  { name: 'CONTROL 3', k: '대치동-탄성코트', expectedImg: 'bareumgonggan-search-thumbnail-v2.jpg', expectBodyImg: false },

  // TEST-A
  { name: 'TEST-A 1', k: '개봉동-탄성코트', expectedImg: 'bareumgonggan-field-01.jpg', expectBodyImg: false },
  { name: 'TEST-A 2', k: '삼성동-탄성코트', expectedImg: 'bareumgonggan-field-02.jpg', expectBodyImg: false },
  { name: 'TEST-A 3', k: '개봉동-세탁실탄성코트', expectedImg: 'bareumgonggan-field-03.jpg', expectBodyImg: false },

  // TEST-B
  { name: 'TEST-B 1', k: '남현동-탄성코트시공', expectedImg: 'bareumgonggan-field-04.jpg', expectBodyImg: true },
  { name: 'TEST-B 2', k: '공릉동-탄성코트업체', expectedImg: 'bareumgonggan-field-05.jpg', expectBodyImg: true },
  { name: 'TEST-B 3', k: '이문동-탄성코트업체', expectedImg: 'bareumgonggan-field-06.jpg', expectBodyImg: true }
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

async function run() {
  console.log('=== VERIFYING LIVE PRODUCTION 9-URL EXPERIMENT ===\n');

  for (const item of urls) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(item.k)}`;
    try {
      const { statusCode, body } = await fetchUrl(url);
      
      const ogMatch = body.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"[^>]*?>/i);
      const ogImg = ogMatch ? ogMatch[1] : 'NONE';
      
      const bodyImgMatches = body.match(/<img\s+[^>]*?src="([^"]*)"[^>]*?>/gi) || [];
      
      const imgMatched = ogImg.includes(item.expectedImg);
      const bodyImgMatched = item.expectBodyImg ? (bodyImgMatches.length > 0) : (bodyImgMatches.length === 0);
      
      console.log(`[${item.name}] ?k=${item.k}`);
      console.log(`  HTTP Status: ${statusCode}`);
      console.log(`  og:image:    ${ogImg}`);
      console.log(`  body imgs:   ${bodyImgMatches.length}`);
      console.log(`  Status:      ${imgMatched && bodyImgMatched ? 'PASS' : 'FAIL (Deploying...)'}`);
      console.log('');
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
    }
  }
}

run();
