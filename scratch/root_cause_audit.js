import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

// Load region dataset and service keywords to sample 200 URLs
import { parseAndValidateK, getActiveRegions, getAllowedServicesForRegion } from '../src/data/regionResolver.js';
import { thumbnailTestMap, testBKeywords } from '../src/data/thumbnailTestMap.js';

const testBUrls = [
  '남현동-탄성코트시공',
  '공릉동-탄성코트업체',
  '이문동-탄성코트업체'
];

const uas = {
  chromeDesktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  chromeMobile: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  naverYeti: 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)',
  defaultCurl: 'curl/7.68.0'
};

function fetchRaw(targetUrl, ua) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': ua }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
        length: Buffer.byteLength(data, 'utf8'),
        hash: crypto.createHash('sha256').update(data).digest('hex')
      }));
    }).on('error', reject);
  });
}

function stripTags(html) {
  return html
    .replace(/<script\b[^<]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^<]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function runAudit() {
  console.log('==================================================');
  console.log('1. USER-AGENT ACTUAL SERVER RESPONSE COMPARISON');
  console.log('==================================================\n');

  for (const k of testBUrls) {
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(k)}`;
    console.log(`URL: ?k=${k}`);

    for (const [name, uaStr] of Object.entries(uas)) {
      const res = await fetchRaw(url, uaStr);
      const bodyText = stripTags(res.body);
      const titleMatch = res.body.match(/<title>(.*?)<\/title>/i);
      const descMatch = res.body.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/i);
      const canonicalMatch = res.body.match(/<link\s+rel="canonical"\s+href="(.*?)"\s*\/?>/i);
      const h1Match = res.body.match(/<h1[^>]*?>(.*?)<\/h1>/i);
      const bodyImgs = res.body.match(/<img\s+[^>]*?>/gi) || [];
      const faqMatches = res.body.match(/<li[^>]*?>\s*<strong[^>]*?>Q:/gi) || [];
      const linkMatches = res.body.match(/<a\s+[^>]*?>/gi) || [];
      const scriptMatches = res.body.match(/<script\b[^<]*?>/gi) || [];

      console.log(`  [UA: ${name}]`);
      console.log(`    Status:         ${res.statusCode}`);
      console.log(`    Raw Byte Size:  ${res.length} bytes`);
      console.log(`    SHA256:         ${res.hash}`);
      console.log(`    Title:          ${titleMatch ? titleMatch[1] : 'NONE'}`);
      console.log(`    H1:             ${h1Match ? h1Match[1].replace(/<[^>]+>/g, '') : 'NONE'}`);
      console.log(`    Body Img Count: ${bodyImgs.length}`);
      console.log(`    FAQ Count:      ${faqMatches.length}`);
      console.log(`    Links Count:    ${linkMatches.length}`);
      console.log(`    Scripts Count:  ${scriptMatches.length}`);
      console.log(`    Text Length:    ${bodyText.length} chars`);
    }
    console.log('');
  }

  console.log('==================================================');
  console.log('4 & 5. DYNAMIC LANDING CONTENT SIMILARITY & UNIQUE RATIO (200 SAMPLES)');
  console.log('==================================================\n');

  // Collect 200 sample dynamic keywords
  const activeRegions = getActiveRegions();
  const sampleUrls = [];
  
  for (const reg of activeRegions) {
    const services = getAllowedServicesForRegion(reg);
    for (const s of services) {
      sampleUrls.push({ urlRegion: reg.urlRegion, keyword: s.keyword, regName: reg.name });
      if (sampleUrls.length >= 250) break;
    }
    if (sampleUrls.length >= 250) break;
  }

  const sampleCount = Math.min(200, sampleUrls.length);
  console.log(`Gathering SSR responses for ${sampleCount} dynamic landing pages...`);

  const pagesData = [];
  for (let i = 0; i < sampleCount; i++) {
    const item = sampleUrls[i];
    const kParam = `${item.urlRegion}-${item.keyword}`;
    const url = `https://www.barumspace.co.kr/?k=${encodeURIComponent(kParam)}`;
    try {
      const res = await fetchRaw(url, uas.naverYeti);
      const text = stripTags(res.body);
      
      // Normalize dynamic region and keyword tokens to calculate true template similarity
      const normalizedText = text
        .replace(new RegExp(item.regName, 'g'), '[REGION]')
        .replace(new RegExp(item.keyword, 'g'), '[SERVICE]')
        .replace(/바름공간/g, '[BRAND]');

      pagesData.push({
        kParam,
        rawLength: text.length,
        normalizedText,
        words: new Set(normalizedText.split(/\s+/).filter(Boolean))
      });
    } catch (err) {
      // ignore single error
    }
  }

  console.log(`Successfully fetched ${pagesData.length} sample pages.`);

  // Calculate pairwise Jaccard similarities
  const similarities = [];
  for (let i = 0; i < pagesData.length; i++) {
    for (let j = i + 1; j < Math.min(pagesData.length, i + 50); j++) {
      const setA = pagesData[i].words;
      const setB = pagesData[j].words;
      let intersection = 0;
      setA.forEach(w => { if (setB.has(w)) intersection++; });
      const union = setA.size + setB.size - intersection;
      const jaccard = union > 0 ? (intersection / union) : 0;
      similarities.push(jaccard);
    }
  }

  similarities.sort((a, b) => a - b);

  const avgSim = similarities.reduce((a, b) => a + b, 0) / similarities.length;
  const medianSim = similarities[Math.floor(similarities.length * 0.5)];
  const p90Sim = similarities[Math.floor(similarities.length * 0.9)];
  const p95Sim = similarities[Math.floor(similarities.length * 0.95)];
  const highSimCount = similarities.filter(s => s >= 0.85).length;
  const highSimRatio = (highSimCount / similarities.length) * 100;

  const avgRawLength = pagesData.reduce((a, b) => a + b.rawLength, 0) / pagesData.length;

  console.log(`Average Raw Visible Text Length: ${Math.round(avgRawLength)} chars`);
  console.log(`Jaccard Template Similarity Metrics (after Region/Service/Brand normalization):`);
  console.log(`  Average Similarity: ${(avgSim * 100).toFixed(2)}%`);
  console.log(`  Median Similarity:  ${(medianSim * 100).toFixed(2)}%`);
  console.log(`  90th Percentile:    ${(p90Sim * 100).toFixed(2)}%`);
  console.log(`  95th Percentile:    ${(p95Sim * 100).toFixed(2)}%`);
  console.log(`  Identical Template Ratio (Sim >= 85%): ${highSimRatio.toFixed(2)}%`);
  console.log(`  Unique Content Ratio per Page: ${((1 - avgSim) * 100).toFixed(2)}%`);
}

runAudit();
