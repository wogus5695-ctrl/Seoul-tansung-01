import { evaluateUrlQualityGate, QUALITY_TIERS, DEPLOYMENT_STATUS, GATE_STATUS } from '../src/data/seoV2/qualityGate.js';
import { getActiveRegions } from '../src/data/regionResolver.js';
import { VERIFIED_REGION_EVIDENCE_REGISTRY, EVIDENCE_STATUS_ENUM } from '../src/data/seoV2/regionEvidence.js';
import { PILOT_V2_REGIONS } from '../src/data/seoV2/featureFlag.js';

console.log('=== STEP 5-D FINAL QUALITY POLICY FORENSIC AUDIT (READ ONLY) ===\n');

const sampleRegion = getActiveRegions().find(r => r.displayName === '삼성동');

// 1. Tier A Full Positive Synthetic Test
console.log('--- 1. TIER A FULL POSITIVE SYNTHETIC TEST ---');
VERIFIED_REGION_EVIDENCE_REGISTRY['삼성동'] = {
  exactCases: [{ id: 'EXACT_001', title: '삼성동' }] // '삼성동' matches totalBodyText
};

const tierAReport = evaluateUrlQualityGate(sampleRegion, { keyword: '탄성코트' });
console.log(`Tier A Candidate Quality Tier   : ${tierAReport.qualityTier}`);
console.log(`Tier A Candidate Rollout Status : ${tierAReport.rolloutStatus}`);
console.log(`Tier A Evidence Rendered Status : ${tierAReport.evidenceRendered}`);
console.log(`Tier A Post Duplicate Risk Status: ${tierAReport.postEvidenceDuplicateRisk}`);

delete VERIFIED_REGION_EVIDENCE_REGISTRY['삼성동'];

// 2. Tier A Wrong-Scope Synthetic Test
console.log('\n--- 2. TIER A WRONG-SCOPE SYNTHETIC TEST ---');
VERIFIED_REGION_EVIDENCE_REGISTRY['삼성동'] = {
  exactCases: [{ id: 'UNRENDERED_001', title: '강남구' }] // Title matches parent, not exact dong in text check
};

const wrongScopeReport = evaluateUrlQualityGate(sampleRegion, { keyword: '탄성코트' });
console.log(`Wrong Scope Evidence Rendered   : ${wrongScopeReport.evidenceRendered}`);
console.log(`Wrong Scope Quality Tier        : ${wrongScopeReport.qualityTier}`);
console.log(`Wrong Scope Rollout Status      : ${wrongScopeReport.rolloutStatus}`);

delete VERIFIED_REGION_EVIDENCE_REGISTRY['삼성동'];

// 3. Current 60 V2 Fixtures Regression Test
console.log('\n--- 3. CURRENT 60 V2 FIXTURES REGRESSION TEST ---');
const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
const regions = Array.from(PILOT_V2_REGIONS);

const reports = [];
regions.forEach(rName => {
  const regObj = getActiveRegions().find(r => r.displayName === rName || r.name === rName);
  if (regObj) {
    tasks.forEach(tName => {
      reports.push(evaluateUrlQualityGate(regObj, { keyword: tName }));
    });
  }
});

const tierC_Count = reports.filter(r => r.qualityTier === QUALITY_TIERS.TIER_C).length;
const pilotEligibleCount = reports.filter(r => r.deploymentStatus === DEPLOYMENT_STATUS.PILOT_ELIGIBLE).length;
const holdForEvidenceCount = reports.filter(r => r.rolloutStatus === DEPLOYMENT_STATUS.HOLD_FOR_EVIDENCE).length;
const fullRolloutCount = reports.filter(r => r.rolloutStatus === DEPLOYMENT_STATUS.FULL_ROLLOUT_ELIGIBLE).length;

console.log(`Total V2 Fixtures Evaluated     : ${reports.length}`);
console.log(`Tier C Count                    : ${tierC_Count} / 60`);
console.log(`Pilot Eligible Count            : ${pilotEligibleCount} / 60`);
console.log(`Hold For Evidence Count         : ${holdForEvidenceCount} / 60`);
console.log(`Full Rollout Count              : ${fullRolloutCount} / 60`);

if (tierC_Count === 60 && pilotEligibleCount === 60 && holdForEvidenceCount === 60 && fullRolloutCount === 0) {
  console.log('60 V2 Fixtures Regression Test: PASS ✅ (100% Tier C & Hold For Evidence preserved)');
} else {
  console.error('60 V2 Fixtures Regression Test: FAIL ❌');
}
