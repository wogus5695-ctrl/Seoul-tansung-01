import fs from 'fs';
import path from 'path';
import http from 'http';
import seoHandler from '../api/seo.js';

// Simulation of Vercel Routing Engine
async function simulateVercelRequest(reqPath, searchParams = {}) {
  // Read vercel.json rewrites
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf-8'));
  const rewrites = vercelConfig.rewrites || [];
  
  let targetHandler = 'static';
  let targetFile = null;

  const urlObj = new URL(reqPath, 'https://www.barumspace.co.kr');
  Object.keys(searchParams).forEach(k => urlObj.searchParams.set(k, searchParams[k]));

  const queryK = urlObj.searchParams.get('k');

  // Check rewrites matching rules
  for (const r of rewrites) {
    if (r.source === '/') {
      if (r.has) {
        const hasKey = r.has[0]?.key;
        const hasValueRegex = r.has[0]?.value;
        if (hasKey === 'k' && queryK) {
          if (!hasValueRegex || new RegExp(hasValueRegex).test(queryK)) {
            if (r.destination === '/api/seo') {
              targetHandler = 'function';
            } else {
              targetHandler = 'static';
              targetFile = r.destination;
            }
            break;
          }
        }
      }
    } else if (r.source === urlObj.pathname) {
      if (r.destination === '/api/seo') {
        targetHandler = 'function';
      } else {
        targetHandler = 'static';
        targetFile = r.destination;
      }
      break;
    }
  }

  if (targetHandler === 'function') {
    // Mock Vercel res object
    let responseStatus = 200;
    let responseHeaders = {};
    let responseBody = '';

    const mockReq = {
      url: urlObj.pathname + urlObj.search,
      headers: { host: 'www.barumspace.co.kr' },
      query: Object.fromEntries(urlObj.searchParams.entries())
    };

    const mockRes = {
      status(code) {
        responseStatus = code;
        return this;
      },
      setHeader(name, val) {
        responseHeaders[name.toLowerCase()] = val;
        return this;
      },
      send(body) {
        responseBody = body;
        return this;
      },
      end() {
        return this;
      }
    };

    await seoHandler(mockReq, mockRes);

    return {
      type: 'SERVERLESS_FUNCTION',
      status: responseStatus,
      contentType: responseHeaders['content-type'] || '',
      body: responseBody
    };
  } else {
    // Static file serving from dist/
    let filePath = targetFile ? path.join(process.cwd(), 'dist', targetFile.replace(/^\//, '')) : path.join(process.cwd(), 'dist', urlObj.pathname.replace(/^\//, ''));
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      let mime = 'text/html';
      if (ext === '.js') mime = 'application/javascript';
      else if (ext === '.css') mime = 'text/css';
      else if (ext === '.json') mime = 'application/json';
      else if (ext === '.png') mime = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';

      return {
        type: 'STATIC_FILE',
        status: 200,
        contentType: `${mime}; charset=utf-8`,
        body: fs.readFileSync(filePath, 'utf-8')
      };
    } else {
      // SPA Fallback to dist/index.html
      const fallbackPath = path.join(process.cwd(), 'dist', 'index.html');
      return {
        type: 'SPA_FALLBACK',
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: fs.readFileSync(fallbackPath, 'utf-8')
      };
    }
  }
}

async function runAudit() {
  console.log('==================================================');
  console.log('STEP R-2 RECOVERY SIMULATION & AUDIT TEST RUNNER');
  console.log('==================================================\n');

  const testCases = [
    { name: '1. Main Root (GET /)', path: '/', query: {} },
    { name: '2. Sitemap Directory (GET /sitemap-seoul)', path: '/sitemap-seoul', query: {} },
    { name: '3. Problem Dynamic #1 (GET /?k=홍익동-베란다탄성코트)', path: '/', query: { k: '홍익동-베란다탄성코트' } },
    { name: '4. Problem Dynamic #2 (GET /?k=상왕십리동-세탁실탄성코트)', path: '/', query: { k: '상왕십리동-세탁실탄성코트' } },
    { name: '5. V1 Elastic (GET /?k=역삼동-탄성코트)', path: '/', query: { k: '역삼동-탄성코트' } },
    { name: '6. V1 Grout (GET /?k=역삼동-욕실줄눈시공)', path: '/', query: { k: '역삼동-욕실줄눈시공' } },
    { name: '7. Clean Static 1 (GET /?k=배양동-탄성코트)', path: '/', query: { k: '배양동-탄성코트' } },
    { name: '8. Privacy Policy (GET /privacy-policy)', path: '/privacy-policy', query: {} }
  ];

  for (const tc of testCases) {
    const res = await simulateVercelRequest(tc.path, tc.query);
    const hasScript = res.body.includes('<script type="module"');
    const hasCss = res.body.includes('<link rel="stylesheet"');
    const hasRootDiv = res.body.includes('<div id="root">');
    const hasH1 = res.body.includes('<h1');
    const hasCanonical = res.body.includes('rel="canonical"');

    console.log(`[TEST] ${tc.name}`);
    console.log(`  - Type: ${res.type}`);
    console.log(`  - Status: ${res.status}`);
    console.log(`  - Content-Type: ${res.contentType}`);
    console.log(`  - Script Tag Present: ${hasScript ? 'YES' : 'NO'}`);
    console.log(`  - CSS Tag Present: ${hasCss ? 'YES' : 'NO'}`);
    console.log(`  - Root Container Present: ${hasRootDiv ? 'YES' : 'NO'}`);
    console.log(`  - H1 Tag Present: ${hasH1 ? 'YES' : 'NO'}`);
    console.log(`  - Canonical Tag Present: ${hasCanonical ? 'YES' : 'NO'}`);
    console.log('--------------------------------------------------');
  }

  // Test Asset Fetching Directly
  console.log('\n[ASSET DIRECT FETCH TESTS]');
  const distAssets = fs.readdirSync(path.join(process.cwd(), 'dist', 'assets'));
  const jsFile = distAssets.find(f => f.endsWith('.js'));
  const cssFile = distAssets.find(f => f.endsWith('.css'));

  if (jsFile) {
    const jsRes = await simulateVercelRequest(`/assets/${jsFile}`);
    console.log(`- JS Asset (/assets/${jsFile}):`);
    console.log(`  Status: ${jsRes.status}, Content-Type: ${jsRes.contentType}, Type: ${jsRes.type}`);
    console.log(`  Valid JS MIME: ${jsRes.contentType.includes('javascript') ? 'PASS' : 'FAIL (HTML Collision!)'}`);
  }

  if (cssFile) {
    const cssRes = await simulateVercelRequest(`/assets/${cssFile}`);
    console.log(`- CSS Asset (/assets/${cssFile}):`);
    console.log(`  Status: ${cssRes.status}, Content-Type: ${cssRes.contentType}, Type: ${cssRes.type}`);
    console.log(`  Valid CSS MIME: ${cssRes.contentType.includes('css') ? 'PASS' : 'FAIL (HTML Collision!)'}`);
  }
}

runAudit().catch(console.error);
