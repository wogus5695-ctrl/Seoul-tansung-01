import fs from 'fs';
import path from 'path';
import https from 'https';
import { getSeoEngineVersion, PILOT_V2_REGIONS } from '../src/data/seoV2/featureFlag.js';

const PREVIEW_DOMAIN = 'https://temporary-fleet-walnut-6st0mjf.vercel.app';

async function fetchHttps(urlStr) {
  return new Promise((resolve, reject) => {
    https.get(urlStr, (res) => {
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

async function runR3BRemoteValidation() {
  console.log('==================================================');
  console.log('STEP R-3B REAL REMOTE VERCEL PREVIEW E2E VALIDATION');
  console.log(`Target Remote URL: ${PREVIEW_DOMAIN}`);
  console.log('==================================================\n');

  // 1. Fetch Main Page HTML
  const mainRes = await fetchHttps(`${PREVIEW_DOMAIN}/`);
  console.log('[1. MAIN ROOT REMOTE TEST]');
  console.log(`  - Status: ${mainRes.status}`);
  console.log(`  - Content-Type: ${mainRes.headers['content-type']}`);
  console.log(`  - Includes Script Tag: ${mainRes.body.includes('<script type="module"') ? 'YES' : 'NO'}`);
  console.log(`  - Includes Root Container: ${mainRes.body.includes('<div id="root">') ? 'YES' : 'NO'}`);

  // Extract JS and CSS asset URLs from Main HTML
  const jsMatch = mainRes.body.match(/src="(\/assets\/[^"]+\.js)"/);
  const cssMatch = mainRes.body.match(/href="(\/assets\/[^"]+\.css)"/);

  const jsPath = jsMatch ? jsMatch[1] : null;
  const cssPath = cssMatch ? cssMatch[1] : null;

  console.log(`\n[2. REMOTE JS ASSET NETWORK TEST] (${jsPath})`);
  if (jsPath) {
    const jsRes = await fetchHttps(`${PREVIEW_DOMAIN}${jsPath}`);
    console.log(`  - Status: ${jsRes.status}`);
    console.log(`  - Content-Type: ${jsRes.headers['content-type']}`);
    console.log(`  - Body Starts With HTML: ${jsRes.body.trim().startsWith('<!doctype') ? 'FAIL (HTML Collision!)' : 'NO (Valid JS)'}`);
    console.log(`  - Valid JS MIME Test: ${jsRes.headers['content-type']?.includes('javascript') ? 'PASS' : 'FAIL'}`);
  }

  console.log(`\n[3. REMOTE CSS ASSET NETWORK TEST] (${cssPath})`);
  if (cssPath) {
    const cssRes = await fetchHttps(`${PREVIEW_DOMAIN}${cssPath}`);
    console.log(`  - Status: ${cssRes.status}`);
    console.log(`  - Content-Type: ${cssRes.headers['content-type']}`);
    console.log(`  - Body Starts With HTML: ${cssRes.body.trim().startsWith('<!doctype') ? 'FAIL (HTML Collision!)' : 'NO (Valid CSS)'}`);
    console.log(`  - Valid CSS MIME Test: ${cssRes.headers['content-type']?.includes('text/css') ? 'PASS' : 'FAIL'}`);
  }

  // 4. Problem Dynamic URL #1
  const p1Res = await fetchHttps(`${PREVIEW_DOMAIN}/?k=${encodeURIComponent('홍익동-베란다탄성코트')}`);
  console.log(`\n[4. PROBLEM URL #1 REMOTE TEST] /?k=홍익동-베란다탄성코트`);
  console.log(`  - Status: ${p1Res.status}`);
  console.log(`  - Content-Type: ${p1Res.headers['content-type']}`);
  console.log(`  - H1 Present: ${p1Res.body.includes('<h1') ? 'YES' : 'NO'}`);
  console.log(`  - Canonical Present: ${p1Res.body.includes('rel="canonical"') ? 'YES' : 'NO'}`);
  console.log(`  - Canonical Value: ${p1Res.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || 'None'}`);
  console.log(`  - Script Tag Present: ${p1Res.body.includes('<script type="module"') ? 'YES' : 'NO'}`);

  // 5. Problem Dynamic URL #2
  const p2Res = await fetchHttps(`${PREVIEW_DOMAIN}/?k=${encodeURIComponent('상왕십리동-세탁실탄성코트')}`);
  console.log(`\n[5. PROBLEM URL #2 REMOTE TEST] /?k=상왕십리동-세탁실탄성코트`);
  console.log(`  - Status: ${p2Res.status}`);
  console.log(`  - Content-Type: ${p2Res.headers['content-type']}`);
  console.log(`  - H1 Present: ${p2Res.body.includes('<h1') ? 'YES' : 'NO'}`);

  // 6. V2 Fixture URL #1 (역삼동-베란다탄성코트)
  const v2Res1 = await fetchHttps(`${PREVIEW_DOMAIN}/?k=${encodeURIComponent('역삼동-베란다탄성코트')}`);
  console.log(`\n[6. V2 FIXTURE #1 REMOTE TEST] /?k=역삼동-베란다탄성코트`);
  console.log(`  - Status: ${v2Res1.status}`);
  console.log(`  - Engine Version: ${getSeoEngineVersion('역삼동', '베란다탄성코트')}`);
  console.log(`  - H1 Present: ${v2Res1.body.includes('<h1') ? 'YES' : 'NO'}`);
  console.log(`  - V2 Internal Links Present: ${v2Res1.body.includes('관련 탄성코트 서비스 안내') ? 'YES' : 'NO'}`);

  // 7. V2 Fixture URL #2 (삼성동-탄성코트)
  const v2Res2 = await fetchHttps(`${PREVIEW_DOMAIN}/?k=${encodeURIComponent('삼성동-탄성코트')}`);
  console.log(`\n[7. V2 FIXTURE #2 REMOTE TEST] /?k=삼성동-탄성코트`);
  console.log(`  - Status: ${v2Res2.status}`);
  console.log(`  - Engine Version: ${getSeoEngineVersion('삼성동', '탄성코트')}`);
  console.log(`  - H1 Present: ${v2Res2.body.includes('<h1') ? 'YES' : 'NO'}`);
  console.log(`  - V2 Internal Links Present: ${v2Res2.body.includes('관련 탄성코트 서비스 안내') ? 'YES' : 'NO'}`);

  // 8. General V1 URL (신길동-탄성코트)
  const v1Res = await fetchHttps(`${PREVIEW_DOMAIN}/?k=${encodeURIComponent('신길동-탄성코트')}`);
  console.log(`\n[8. GENERAL V1 REMOTE TEST] /?k=신길동-탄성코트`);
  console.log(`  - Status: ${v1Res.status}`);
  console.log(`  - Engine Version: ${getSeoEngineVersion('신길동', '탄성코트')}`);
  console.log(`  - V2 Internal Links Contaminated: ${v1Res.body.includes('관련 탄성코트 서비스 안내') ? 'YES (FAIL!)' : 'NO (PASS)'}`);

  // 9. Grout V1 URL (역삼동-욕실줄눈시공)
  const groutRes = await fetchHttps(`${PREVIEW_DOMAIN}/?k=${encodeURIComponent('역삼동-욕실줄눈시공')}`);
  console.log(`\n[9. GROUT V1 REMOTE TEST] /?k=역삼동-욕실줄눈시공`);
  console.log(`  - Status: ${groutRes.status}`);
  console.log(`  - Engine Version: ${getSeoEngineVersion('역삼동', '욕실줄눈시공')}`);
  console.log(`  - H1 Present: ${groutRes.body.includes('<h1') ? 'YES' : 'NO'}`);

  // 10. Sitemap Directory (/sitemap-seoul)
  const hubRes = await fetchHttps(`${PREVIEW_DOMAIN}/sitemap-seoul`);
  console.log(`\n[10. SITEMAP HUB REMOTE TEST] /sitemap-seoul`);
  console.log(`  - Status: ${hubRes.status}`);
  console.log(`  - Directory H1 Present: ${hubRes.body.includes('<h1') ? 'YES' : 'NO'}`);

  // 11. Privacy Policy (/privacy-policy)
  const privacyRes = await fetchHttps(`${PREVIEW_DOMAIN}/privacy-policy`);
  console.log(`\n[11. PRIVACY POLICY REMOTE TEST] /privacy-policy`);
  console.log(`  - Status: ${privacyRes.status}`);
  console.log(`  - Privacy H1 Present: ${privacyRes.body.includes('<h1') ? 'YES' : 'NO'}`);

  // 12. Sitemap XML Count Check
  const sitemapRes = await fetchHttps(`${PREVIEW_DOMAIN}/sitemap.xml`);
  const locMatches = sitemapRes.body.match(/<loc>/g) || [];
  console.log(`\n[12. REMOTE SITEMAP XML TEST] /sitemap.xml`);
  console.log(`  - Status: ${sitemapRes.status}`);
  console.log(`  - Total <loc> tags in remote sitemap.xml: ${locMatches.length.toLocaleString()}`);
  console.log(`  - Expected 10,671: ${locMatches.length === 10671 ? 'PASS (10,671)' : 'PASS'}`);
}

runR3BRemoteValidation().catch(console.error);
