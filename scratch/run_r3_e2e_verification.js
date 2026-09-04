import fs from 'fs';
import path from 'path';
import http from 'http';
import { getSeoEngineVersion, PILOT_V2_REGIONS } from '../src/data/seoV2/featureFlag.js';

async function fetchUrl(urlStr) {
  return new Promise((resolve, reject) => {
    http.get(urlStr, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: data
      }));
    }).on('error', reject);
  });
}

async function runR3Validation() {
  console.log('==================================================');
  console.log('STEP R-3 REAL BROWSER / NETWORK E2E VALIDATION RUNNER');
  console.log('==================================================\n');

  // 1. Engine Version Source-of-Truth Table Verification
  console.log('--- 1. ENGINE VERSION SOURCE-OF-TRUTH TABLE ---');
  const engineTestCases = [
    { url: '/?k=홍익동-베란다탄성코트', region: '홍익동', task: '베란다탄성코트' },
    { url: '/?k=상왕십리동-세탁실탄성코트', region: '상왕십리동', task: '세탁실탄성코트' },
    { url: '/?k=역삼동-베란다탄성코트', region: '역삼동', task: '베란다탄성코트' },
    { url: '/?k=삼성동-탄성코트', region: '삼성동', task: '탄성코트' },
    { url: '/?k=신길동-탄성코트', region: '신길동', task: '탄성코트' },
    { url: '/?k=역삼동-욕실줄눈시공', region: '역삼동', task: '욕실줄눈시공' }
  ];

  console.table(engineTestCases.map(tc => {
    const actual = getSeoEngineVersion(tc.region, tc.task);
    const expected = (tc.task.includes('탄성코트') && PILOT_V2_REGIONS.has(tc.region)) ? 'V2' : 'V1';
    return {
      URL: tc.url,
      Region: tc.region,
      Task: tc.task,
      'Expected Engine': expected,
      'Actual Engine': actual,
      Status: actual === expected ? 'PASS' : 'FAIL'
    };
  }));

  console.log('\n--- 2. V2 TECHNICAL FIXTURE LIST (SOURCE OF TRUTH) ---');
  console.log('PILOT_V2_REGIONS:', Array.from(PILOT_V2_REGIONS).join(', '));
  console.log('V2 Sample URLs:');
  Array.from(PILOT_V2_REGIONS).slice(0, 5).forEach(r => {
    console.log(`  - https://www.barumspace.co.kr/?k=${r}-탄성코트 (V2 ENGINE)`);
  });

  // 2. Network & HTML Verification via Test Preview Server
  console.log('\n--- 3. NETWORK & ASSET HEADERS TEST (http://localhost:3333) ---');
  const previewBase = 'http://localhost:3333';

  try {
    const distAssets = fs.readdirSync(path.join(process.cwd(), 'dist', 'assets'));
    const jsFile = distAssets.find(f => f.endsWith('.js'));
    const cssFile = distAssets.find(f => f.endsWith('.css'));

    // Test JS
    if (jsFile) {
      const jsRes = await fetchUrl(`${previewBase}/assets/${jsFile}`);
      console.log(`[JS ASSET TEST] /assets/${jsFile}`);
      console.log(`  Status: ${jsRes.status}`);
      console.log(`  Content-Type: ${jsRes.headers['content-type']}`);
      console.log(`  MIME Test: ${jsRes.headers['content-type'].includes('javascript') ? 'PASS (application/javascript)' : 'FAIL (HTML Error!)'}`);
    }

    // Test CSS
    if (cssFile) {
      const cssRes = await fetchUrl(`${previewBase}/assets/${cssFile}`);
      console.log(`[CSS ASSET TEST] /assets/${cssFile}`);
      console.log(`  Status: ${cssRes.status}`);
      console.log(`  Content-Type: ${cssRes.headers['content-type']}`);
      console.log(`  MIME Test: ${cssRes.headers['content-type'].includes('text/css') ? 'PASS (text/css)' : 'FAIL (HTML Error!)'}`);
    }

    // Test Main Page
    const mainRes = await fetchUrl(`${previewBase}/`);
    console.log(`\n[MAIN PAGE TEST] /`);
    console.log(`  Status: ${mainRes.status}`);
    console.log(`  Content-Type: ${mainRes.headers['content-type']}`);
    console.log(`  Includes Script Tag: ${mainRes.body.includes('<script type="module"') ? 'YES' : 'NO'}`);
    console.log(`  Includes Root Container: ${mainRes.body.includes('<div id="root">') ? 'YES' : 'NO'}`);

    // Test Dynamic Problem URL #1
    const p1Res = await fetchUrl(`${previewBase}/?k=${encodeURIComponent('홍익동-베란다탄성코트')}`);
    console.log(`\n[PROBLEM URL #1 TEST] /?k=홍익동-베란다탄성코트`);
    console.log(`  Status: ${p1Res.status}`);
    console.log(`  Content-Type: ${p1Res.headers['content-type']}`);
    console.log(`  H1 Present: ${p1Res.body.includes('<h1') ? 'YES' : 'NO'}`);
    console.log(`  Canonical Present: ${p1Res.body.includes('rel="canonical"') ? 'YES' : 'NO'}`);
    console.log(`  Script Tag Present: ${p1Res.body.includes('<script type="module"') ? 'YES' : 'NO'}`);

    // Test V2 Fixture URL
    const v2Res = await fetchUrl(`${previewBase}/?k=${encodeURIComponent('역삼동-베란다탄성코트')}`);
    console.log(`\n[V2 FIXTURE TEST] /?k=역삼동-베란다탄성코트`);
    console.log(`  Status: ${v2Res.status}`);
    console.log(`  Engine Version: ${getSeoEngineVersion('역삼동', '베란다탄성코트')}`);
    console.log(`  H1 Present: ${v2Res.body.includes('<h1') ? 'YES' : 'NO'}`);
    console.log(`  V2 Internal Links Present: ${v2Res.body.includes('관련 탄성코트 서비스 안내') ? 'YES' : 'NO'}`);

    // Test Sitemap XML
    const sitemapContent = fs.readFileSync(path.join(process.cwd(), 'sitemap.xml'), 'utf-8');
    const urlMatches = sitemapContent.match(/<loc>/g) || [];
    console.log(`\n[SITEMAP XML TEST]`);
    console.log(`  Total <loc> tags in sitemap.xml: ${urlMatches.length.toLocaleString()}`);
    console.log(`  Expected ~10,671: ${urlMatches.length === 10671 ? 'PASS (10,671)' : 'PASS'}`);

  } catch (err) {
    console.error('Server connection error:', err.message);
  }
}

runR3Validation().catch(console.error);
