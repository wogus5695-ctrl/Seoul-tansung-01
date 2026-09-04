import handler from '../api/seo.js';

const testCases = [
  { url: '/?k=은평-신사동-탄성코트', label: 'Eunpyeong Sinsa-dong (Correction URL)' },
  { url: '/?k=신사동-탄성코트', label: 'Gangnam Sinsa-dong (Original Shortcut URL)' },
  { url: '/?k=부천-신흥동-줄눈시공', label: 'Bucheon Sinheung-dong (Correction URL 1)' },
  { url: '/?k=오정-신흥동-탄성코트', label: 'Ojeong Sinheung-dong (Correction URL 2)' }
];

async function runTests() {
  for (const tc of testCases) {
    const mockRes = {
      headers: {},
      statusCode: 200,
      body: '',
      setHeader(name, val) { this.headers[name] = val; },
      status(code) { this.statusCode = code; return this; },
      send(content) { this.body = content; return this; },
      end() { return this; }
    };
    const mockReq = { url: tc.url, headers: { host: 'www.barumspace.co.kr' } };

    await handler(mockReq, mockRes);

    const title = mockRes.body.match(/<title>(.*?)<\/title>/)?.[1];
    const h1 = mockRes.body.match(/<h1 style="[^"]*">(.*?)<\/h1>/)?.[1];
    const desc = mockRes.body.match(/<meta name="description" content="(.*?)" \/>/)?.[1];
    const canonical = mockRes.body.match(/<link rel="canonical" href="(.*?)" \/>/)?.[1];
    
    // Extract Body Section Description from HTML
    const bodyDescMatch = mockRes.body.match(/<p style="color:#666; font-size:1.05rem; line-height:1.75; margin:0; word-break:break-all; text-align:left;">(.*?)<\/p>/s);
    // Alternatively look for h3 region ... 제안 밑의 p tag
    const h3Match = mockRes.body.match(/<h3>(.*?)<\/h3>/)?.[1];
    const pMatch = mockRes.body.match(/<h3>.*?<\/h3>\s*<p style="[^"]*">(.*?)<\/p>/s)?.[1];

    console.log(`\n================ ${tc.label} ================`);
    console.log(`URL:       ${tc.url}`);
    console.log(`Title:     ${title}`);
    console.log(`H1:        ${h1}`);
    console.log(`Canonical: ${canonical}`);
    console.log(`Meta Desc: ${desc}`);
    console.log(`Body H3:   ${h3Match ? h3Match.trim() : 'NOT FOUND'}`);
    console.log(`Body Desc: ${pMatch ? pMatch.trim() : 'NOT FOUND'}`);
  }
}

runTests().catch(console.error);
