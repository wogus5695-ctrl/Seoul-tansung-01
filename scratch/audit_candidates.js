import https from 'https';
import { URL } from 'url';

const testUrl = 'https://www.barumspace.co.kr/?k=%EA%B0%9C%EB%B4%89%EB%8F%99-%EC%95%84%ED%8C%8C%ED%8A%B8%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8';

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
  console.log(`Fetching: ${testUrl}`);
  try {
    const { statusCode, headers, body } = await fetchUrl(testUrl);
    console.log(`HTTP Status: ${statusCode}`);
    console.log(`x-vercel-cache: ${headers['x-vercel-cache'] || 'N/A'}`);
    
    // Find all images in SSR HTML
    console.log('\n=== Image Candidates in SSR HTML ===');
    
    // 1. Meta og:image, twitter:image, image_src
    const metaRegex = /<(meta|link)\s+[^>]*?(?:property|name|rel)="([^"]+)"\s+(?:content|href)="([^"]*)"[^>]*?>/gi;
    let match;
    while ((match = metaRegex.exec(body)) !== null) {
      const type = match[2];
      const val = match[3];
      if (type.includes('image') || type === 'canonical') {
        console.log(`[Meta/Link] ${type} -> ${val}`);
      }
    }
    
    // 2. Schema JSON-LD image
    const jsonLdRegex = /<script\s+[^>]*?type="application\/ld\+json"[^>]*?>([\s\S]*?)<\/script>/gi;
    let jsonMatch;
    while ((jsonMatch = jsonLdRegex.exec(body)) !== null) {
      const content = jsonMatch[1];
      if (content.includes('image')) {
        console.log(`[JSON-LD] Found JSON-LD containing "image"`);
        // Extract the image property value
        const imgProp = content.match(/"image"\s*:\s*"([^"]+)"/);
        if (imgProp) {
          console.log(`  JSON-LD Image property value: ${imgProp[1]}`);
        }
      }
    }

    // 3. Img tags
    const imgRegex = /<img\s+[^>]*?src="([^"]*)"[^>]*?>/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(body)) !== null) {
      console.log(`[img tag] src -> ${imgMatch[1]}`);
    }

    // 4. Background images
    const bgRegex = /background-image\s*:\s*url\(([^)]+)\)/gi;
    let bgMatch;
    while ((bgMatch = bgRegex.exec(body)) !== null) {
      console.log(`[CSS background-image] url -> ${bgMatch[1]}`);
    }
    
  } catch (err) {
    console.error('Error fetching URL:', err);
  }
}

run();
