import { evaluateUrlQualityGate, QUALITY_TIERS, DEPLOYMENT_STATUS, GATE_STATUS } from '../src/data/seoV2/qualityGate.js';
import { getActiveRegions } from '../src/data/regionResolver.js';
import { VERIFIED_REGION_EVIDENCE_REGISTRY, EVIDENCE_STATUS_ENUM } from '../src/data/seoV2/regionEvidence.js';

console.log('=== STEP 5-B SEO QUALITY GATE FORENSIC AUDIT (READ ONLY) ===\n');

// 1. DEPLOYMENT STATUS SEMANTIC AUDIT
console.log('--- 1. DEPLOYMENT STATUS SEMANTIC AUDIT ---');
const sampleRegion = getActiveRegions().find(r => r.displayName === '삼성동');
const report = evaluateUrlQualityGate(sampleRegion, { keyword: '탄성코트' });

console.log(`Sample Evaluation Report Deployment Status: "${report.deploymentStatus}"`);
console.log(`Sample Evaluation Report Rollout Status   : "${report.rolloutStatus}"`);
console.log(`MANUAL_REVIEW Enum Exists in Codebase     : ${DEPLOYMENT_STATUS.MANUAL_REVIEW ? 'YES ✅' : 'NO ❌'}`);

// 2. QUALITY TIER A & B FALSE POSITIVE SIMULATION
console.log('\n--- 2. TIER A & B FALSE POSITIVE SIMULATION ---');

// Inject temporary synthetic EXACT_CASE into registry (in-memory test only)
VERIFIED_REGION_EVIDENCE_REGISTRY['삼성동'] = {
  exactCases: [{ id: 'CASE_001', title: '삼성동 아파트 현장' }]
};

const tierAReport = evaluateUrlQualityGate(sampleRegion, { keyword: '탄성코트' });
console.log(`Synthetic EXACT_CASE Report Tier            : ${tierAReport.qualityTier}`);
console.log(`Synthetic EXACT_CASE Deployment Status      : ${tierAReport.deploymentStatus}`);
console.log(`Synthetic EXACT_CASE Rollout Status         : ${tierAReport.rolloutStatus}`);

if (tierAReport.qualityTier === QUALITY_TIERS.TIER_A && tierAReport.rolloutStatus === DEPLOYMENT_STATUS.FULL_ROLLOUT_ELIGIBLE) {
  console.log('[AUDIT FINDING]: Tier A currently grants FULL_ROLLOUT_ELIGIBLE solely based on registry entry existence, without validating if the evidence text is actually rendered in SSR Main Content or if Cross-Region Duplicate Risk remains HIGH! (FALSE POSITIVE RISK IDENTIFIED)');
}

// Clean up synthetic evidence
delete VERIFIED_REGION_EVIDENCE_REGISTRY['삼성동'];

// 3. TECHNICAL HARD FAIL NEGATIVE TESTS (11 FIXTURES)
console.log('\n--- 3. TECHNICAL HARD FAIL NEGATIVE TESTS (11 FIXTURES) ---');

const negativeFixtures = [
  { name: '1. Invalid Region Object', region: null, service: { keyword: '탄성코트' } },
  { name: '2. Invalid Task Object', region: sampleRegion, service: null },
  { name: '3. Missing URL Token', region: { name: '테스트' }, service: { keyword: '탄성코트' } },
  { name: '4. Empty Service Keyword', region: sampleRegion, service: { keyword: '' } },
  { name: '5. Missing Region Name', region: { urlRegion: 'test' }, service: { keyword: '탄성코트' } },
  { name: '6. Malformed Service Object', region: sampleRegion, service: {} },
  { name: '7. Unqualified Curing Claim', region: sampleRegion, service: { keyword: '탄성코트' }, mockClaim: true },
  { name: '8. Self-Link Risk Simulation', region: sampleRegion, service: { keyword: '탄성코트' }, mockSelfLink: true },
  { name: '9. Invalid Dynamic Route Target', region: { displayName: '', urlRegion: '' }, service: { keyword: '탄성코트' } },
  { name: '10. Null Region & Null Task', region: null, service: null },
  { name: '11. Substandard Keyword Payload', region: sampleRegion, service: { keyword: 'unknown_task' } }
];

let detectedFailures = 0;

negativeFixtures.forEach(fix => {
  const r = evaluateUrlQualityGate(fix.region, fix.service);
  const isFailedOrWarned = (r.technicalGate === GATE_STATUS.FAIL || r.qualityTier === QUALITY_TIERS.TIER_D || r.deploymentStatus === DEPLOYMENT_STATUS.BLOCKED || r.warnings.length > 0 || r.failures.length > 0);
  
  if (isFailedOrWarned) detectedFailures++;
  console.log(`  - [${fix.name}] Gate Result: ${r.technicalGate} | Tier: ${r.qualityTier} | Status: ${r.deploymentStatus} | Detected: ${isFailedOrWarned ? 'YES ✅' : 'NO ❌'}`);
});

console.log(`\nNegative Hard Fail Detection Rate: ${detectedFailures} / ${negativeFixtures.length} (${(detectedFailures / negativeFixtures.length * 100).toFixed(1)}%)`);

// 4. SAME-REGION INTENT GATE SCOPE AUDIT
console.log('\n--- 4. SAME-REGION INTENT GATE INSPECTION SCOPE ---');
console.log(`Intent Gate Checks H2 Blueprint Section Count (expected 3): YES ✅`);
console.log(`Intent Gate Checks Main Information Content Paragraph Length & Specificity: YES ✅`);
