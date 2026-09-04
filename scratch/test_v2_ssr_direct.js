import handler from '../api/seo.js';

async function testV2Handler() {
  const req = {
    url: '/?k=삼성동-탄성코트',
    headers: { host: 'www.barumspace.co.kr' },
    query: { k: '삼성동-탄성코트' }
  };

  let statusCode = 0;
  let headers = {};
  let body = '';

  const res = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (code) => {
      statusCode = code;
      return {
        send: (html) => {
          body = html;
        }
      };
    }
  };

  await handler(req, res);

  console.log('=== V2 SSR HANDLER DIRECT TEST RESULT ===');
  console.log('Status Code:', statusCode);
  console.log('Content-Type:', headers['Content-Type']);
  console.log('Cache-Control:', headers['Cache-Control']);
  
  // Extract Title, H1, H2s, Text length
  const titleMatch = body.match(/<title>(.*?)<\/title>/);
  const h1Match = body.match(/<h1.*?>(.*?)<\/h1>/);
  const h2Matches = [...body.matchAll(/<h2.*?>(.*?)<\/h2>/g)].map(m => m[1]);
  const jsonLdMatch = body.match(/<script type="application\/ld\+json" id="jsonld-schema">\s*([\s\S]*?)\s*<\/script>/);

  console.log('\nPage Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
  console.log('H1 Tag:', h1Match ? h1Match[1] : 'NOT FOUND');
  console.log('H2 Tags Count:', h2Matches.length);
  console.log('H2 List:', h2Matches);
  console.log('JSON-LD Schema Present:', jsonLdMatch ? 'YES ✅' : 'NO ❌');
  
  if (jsonLdMatch) {
    const schemas = JSON.parse(jsonLdMatch[1]);
    const faqSchema = schemas.find(s => s['@type'] === 'FAQPage');
    console.log('FAQPage Schema Entity Count:', faqSchema ? faqSchema.mainEntity.length : 0);
  }

  // Check text disappearance / hidden text
  const hasHiddenCss = body.includes('display:none') || body.includes('visibility:hidden') || body.includes('opacity:0');
  console.log('Hidden Text CSS Found:', hasHiddenCss ? 'WARNING ⚠️' : 'NONE ✅');

  console.log('\nSSR Body Length:', body.length, 'bytes');
}

testV2Handler();
