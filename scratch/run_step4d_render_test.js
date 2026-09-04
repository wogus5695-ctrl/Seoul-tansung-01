import { parseAndValidateK } from '../src/data/regionResolver.js';
import { getSeoEngineVersion } from '../src/data/seoV2/featureFlag.js';
import { buildV2Content } from '../src/data/seoV2/contentBuilder.js';

console.log('=== TYPE A ACTUAL SSR RENDER TEST (12 SAMPLES) ===\n');

const sampleUrls = [
  '삼성동-탄성코트시공',
  '삼성동-베란다탄성코트',
  '삼성동-세탁실탄성코트',
  '삼성동-아파트탄성코트',
  '삼성동-탄성코트업체',
  '황계동-탄성코트시공',
  '황계동-베란다탄성코트',
  '황계동-세탁실탄성코트',
  '대치동-탄성코트시공',
  '역삼동-베란다탄성코트',
  '개봉동-세탁실탄성코트',
  '이문동-탄성코트업체'
];

sampleUrls.forEach((k, idx) => {
  const p = parseAndValidateK(k, true);
  if (!p.isValid) {
    console.error(`[Sample ${idx+1}] Invalid k: ${k}`);
    return;
  }

  const ver = getSeoEngineVersion(p.region.displayName, p.service.keyword);
  const v2Content = buildV2Content(p.region.displayName, p.service.keyword);

  console.log(`[Sample ${idx+1}] /?k=${k}`);
  console.log(`  - Engine Version: ${ver}`);
  console.log(`  - H1 Text: "${v2Content.h1Text}"`);
  console.log(`  - H2 Sections Count: ${v2Content.h2Sections.length}`);
  console.log(`  - FAQs Count: ${v2Content.faqs.length}`);
  console.log(`  - Render Verification: ${ver === 'V2' && v2Content.h2Sections.length === 3 ? 'ACTUAL V2 ✅' : 'ACTUAL V1 ❌'}`);
  console.log('-');
});
