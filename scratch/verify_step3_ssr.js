import { buildV2Content } from '../src/data/seoV2/contentBuilder.js';
import { getSeoEngineVersion } from '../src/data/seoV2/featureFlag.js';
import { OFFICIAL_SEARCH_INTENT_REGISTRY } from '../src/data/seoV2/intentRegistry.js';

console.log('=== STEP 3 SSR CONTENT ENGINE V2 VERIFICATION ===\n');

const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
const testRegion = '삼성동';

console.log(`Test Region: ${testRegion}\n`);

const results = [];

tasks.forEach(task => {
  const version = getSeoEngineVersion(testRegion, task);
  const v2Data = buildV2Content(testRegion, task);

  const h1Count = 1;
  const h2Titles = [...v2Data.h2Sections.map(s => s.title), '시공 관련 자주 묻는 질문(FAQ)'];
  const faqCount = v2Data.faqs.length;
  
  // Calculate text length
  const totalLength = v2Data.totalCharCount;

  results.push({
    task,
    version,
    h1Text: v2Data.h1Text,
    h2Count: h2Titles.length,
    h2TitlesSummary: h2Titles.slice(0, 2).join(' / ') + '...',
    faqCount,
    totalTextLength: totalLength,
    isLengthValid: totalLength >= 1000 && totalLength <= 3000 ? 'YES ✅' : 'NO ❌'
  });
});

console.table(results);

// V1 Regression Check
console.log('\n=== V1 REGRESSION & GROUT CHECK ===');
const groutVersion = getSeoEngineVersion(testRegion, '줄눈시공');
const nonPilotVersion = getSeoEngineVersion('제주동', '탄성코트');
console.log(`Grout '줄눈시공' Engine Version: ${groutVersion} (Expected: V1)`);
console.log(`Non-Pilot '제주동 탄성코트' Engine Version: ${nonPilotVersion} (Expected: V1)`);

if (groutVersion === 'V1' && nonPilotVersion === 'V1') {
  console.log('V1 Engine Regression Check: PASS ✅');
} else {
  console.error('V1 Engine Regression Check: FAIL ❌');
}
