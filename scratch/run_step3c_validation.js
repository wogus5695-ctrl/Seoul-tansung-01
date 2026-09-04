import { buildV2Content } from '../src/data/seoV2/contentBuilder.js';
import { getRegionEvidence, EVIDENCE_STATUS_ENUM } from '../src/data/seoV2/regionEvidence.js';
import { CONTENT_MODULE_REGISTRY } from '../src/data/seoV2/contentModules.js';

console.log('=== STEP 3-C QUALIFICATION & EVIDENCE ARCHITECTURE VERIFICATION ===\n');

// 1. Technical Claim Qualification Check
console.log('--- 1. TECHNICAL CLAIM QUALIFICATION AUDIT ---');
let hasFixed24h = false;
let hasAmbiguousSilicone = false;

CONTENT_MODULE_REGISTRY.forEach(mod => {
  if (mod.bodyTemplate.includes('약 24시간이 소요되며')) {
    hasFixed24h = true;
    console.error(`[FAIL] Fixed 24h curing claim found in ${mod.id}`);
  }
  if (mod.bodyTemplate.includes('실리콘 코킹 시공을 진행하여')) {
    hasAmbiguousSilicone = true;
    console.error(`[FAIL] Ambiguous caulking service claim found in ${mod.id}`);
  }
});

if (!hasFixed24h && !hasAmbiguousSilicone) {
  console.log('Technical Claims Qualification Audit: PASS ✅');
} else {
  console.error('Technical Claims Qualification Audit: FAIL ❌');
}

// 2. Region Evidence Architecture Check
console.log('\n--- 2. VERIFIED REGION EVIDENCE ARCHITECTURE CHECK ---');
const sampleExact = getRegionEvidence('삼성동', '강남구');
console.log(`Samsung-dong Evidence Status (No case data): ${sampleExact.status} (Expected: ADMIN_ONLY or NONE)`);

if (sampleExact.status === EVIDENCE_STATUS_ENUM.ADMIN_ONLY || sampleExact.status === EVIDENCE_STATUS_ENUM.NONE) {
  console.log('Fake Case Data Prevention Check: PASS ✅ (No fake cases generated)');
} else {
  console.error('Fake Case Data Prevention Check: FAIL ❌');
}

// 3. Sample V2 Output Inspection (삼성동 베란다탄성코트 & 탄성코트업체)
console.log('\n--- 3. SAMPLE V2 TEXT INSPECTION ---');
const balconyV2 = buildV2Content('삼성동', '베란다탄성코트');
const agencyV2 = buildV2Content('삼성동', '탄성코트업체');

console.log('\n[베란다탄성코트 H2 Section 2]');
console.log('Title:', balconyV2.h2Sections[1]?.title);
console.log('Body:', balconyV2.h2Sections[1]?.paragraphs.join(' '));

console.log('\n[탄성코트업체 H2 Section 3]');
console.log('Title:', agencyV2.h2Sections[2]?.title);
console.log('Body:', agencyV2.h2Sections[2]?.paragraphs.join(' '));
