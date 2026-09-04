import handler from '../api/seo.js';

console.log('=== VERIFYING SEO METADATA FOR SAMPLE PAGES ===');

const mockRes = {
  headers: {},
  statusCode: 200,
  body: '',
  setHeader(name, val) {
    this.headers[name] = val;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  send(content) {
    this.body = content;
    return this;
  },
  end() {
    return this;
  }
};

const verifyMetadata = async (kParam) => {
  mockRes.statusCode = 200;
  mockRes.headers = {};
  mockRes.body = '';
  
  const mockReq = {
    url: `/?k=${encodeURIComponent(kParam)}`,
    headers: {
      host: 'www.barumspace.co.kr'
    }
  };
  
  await handler(mockReq, mockRes);
  const html = mockRes.body;
  
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
  const h1 = html.match(/<h1>(.*?)<\/h1>/)?.[1] || '';
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1] || '';
  const ogUrl = html.match(/<meta property="og:url" content="(.*?)"/)?.[1] || '';
  
  // Extract BreadcrumbListItem URL from JSON-LD
  const schemaMatch = html.match(/<script id="jsonld-schema" type="application\/ld\+json">(.*?)<\/script>/);
  let schemaUrl = '';
  if (schemaMatch) {
    try {
      const schemas = JSON.parse(schemaMatch[1]);
      const breadcrumb = schemas.find(s => s['@type'] === 'BreadcrumbList');
      schemaUrl = breadcrumb?.itemListElement?.[2]?.item || '';
    } catch (e) {
      schemaUrl = 'Error parsing JSON-LD';
    }
  }
  
  console.log(`\nURL: /?k=${kParam}`);
  console.log(`  - Title: ${title}`);
  console.log(`  - H1: ${h1}`);
  console.log(`  - Canonical: ${canonical}`);
  console.log(`  - og:url: ${ogUrl}`);
  console.log(`  - Structured Data URL: ${schemaUrl}`);
};

const main = async () => {
  await verifyMetadata('화곡본동-현관줄눈시공');
  await verifyMetadata('화곡본동-아파트탄성코트');
  await verifyMetadata('가양동-세탁실탄성코트');
  await verifyMetadata('상일동-베란다탄성코트');
};

main();

