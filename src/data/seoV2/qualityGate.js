/**
 * BARUMSPACE SEO ENGINE V2 - QUALITY GATE & QUALITY TIER ENGINE (STEP 5-C SAFE BINDING)
 * 
 * BARUMSPACE INTERNAL SEO QA POLICY:
 * Internal Quality Control Policy (NOT Naver's official ranking algorithm).
 * Evaluates SSR Content, Search Intent, Internal Links, Evidence Binding & Rollout Safety.
 * 
 * Safety Guards:
 * - Tier A/B Full Rollout requires evidenceRendered = true AND postEvidenceDuplicateRisk != 'HIGH'.
 * - Unrendered evidence or HIGH duplicate risk defaults to HOLD_FOR_EVIDENCE or MANUAL_REVIEW.
 * - Runtime rendering, robots directives, and sitemaps are 100% UNCHANGED.
 */

import { buildV2Content } from './contentBuilder.js';
import { buildV2InternalLinks } from './linkEngine.js';
import { getRegionEvidence, EVIDENCE_STATUS_ENUM } from './regionEvidence.js';

export const GATE_STATUS = {
  PASS: 'PASS',
  WARN: 'WARN',
  FAIL: 'FAIL'
};

export const QUALITY_TIERS = {
  TIER_A: 'TIER_A', // Exact Region Evidence + Rendered + Unique Contribution + Low/Warn Duplicate
  TIER_B: 'TIER_B', // Parent Region Evidence + Rendered + Scope Correct + Low/Warn Duplicate
  TIER_C: 'TIER_C', // Admin Only Context + V2 Intent Content + High Cross-Region Duplicate Risk
  TIER_D: 'TIER_D'  // Substandard / Technical Hard Fail / Thin Content
};

export const DEPLOYMENT_STATUS = {
  BLOCKED: 'BLOCKED',
  PILOT_ELIGIBLE: 'PILOT_ELIGIBLE',
  FULL_ROLLOUT_ELIGIBLE: 'FULL_ROLLOUT_ELIGIBLE',
  HOLD_FOR_EVIDENCE: 'HOLD_FOR_EVIDENCE',
  MANUAL_REVIEW: 'MANUAL_REVIEW'
};

/**
 * Evaluates a single Dynamic Keyword URL against Barumspace Internal QA Gates
 */
export function evaluateUrlQualityGate(regionObj, serviceObj, siteUrl = 'https://www.barumspace.co.kr') {
  const warnings = [];
  const failures = [];

  if (!regionObj || !serviceObj) {
    return createQualityGateReport({
      url: '/?k=invalid',
      qualityTier: QUALITY_TIERS.TIER_D,
      deploymentStatus: DEPLOYMENT_STATUS.BLOCKED,
      rolloutStatus: DEPLOYMENT_STATUS.BLOCKED,
      technicalGate: GATE_STATUS.FAIL,
      failures: ['Invalid Region or Service Object']
    });
  }

  const regionName = regionObj.displayName || regionObj.name;
  const taskKeyword = serviceObj.keyword;
  const url = `/?k=${regionObj.urlRegion}-${taskKeyword}`;

  // 1. TECHNICAL HARD FAIL GATE
  let technicalGate = GATE_STATUS.PASS;
  if (!regionObj.urlRegion || !taskKeyword) {
    technicalGate = GATE_STATUS.FAIL;
    failures.push('Missing URL tokens or region identifiers');
  }

  // Build V2 Content & Links
  const v2Content = buildV2Content(regionObj, serviceObj);
  const v2Links = buildV2InternalLinks(regionObj, serviceObj, siteUrl);

  if (!v2Content || !v2Content.h1Text) {
    technicalGate = GATE_STATUS.FAIL;
    failures.push('Failed to render V2 SSR Content structure');
  }

  if (v2Links.sameRegionTasks.some(l => l.href === url)) {
    technicalGate = GATE_STATUS.FAIL;
    failures.push('Self-link detected in Internal Link Graph');
  }

  // 2. SEARCH INTENT GATE
  let intentGate = GATE_STATUS.PASS;
  if (!v2Content.h2Sections || v2Content.h2Sections.length !== 3) {
    intentGate = GATE_STATUS.WARN;
    warnings.push('H2 Blueprint section count deviates from standard (expected 3)');
  }

  // 3. INFORMATION GAIN & GENERIC COPY GATE
  let contentGate = GATE_STATUS.PASS;
  const totalBodyText = v2Content.h2Sections.flatMap(s => s.paragraphs).join(' ');
  const textLength = totalBodyText.length;

  if (textLength < 1000) {
    contentGate = GATE_STATUS.WARN;
    warnings.push(`Content length (${textLength} chars) is below recommended 1,000 chars threshold`);
  }

  // Generic marketing phrase ratio check
  const genericKeywords = ['최선을 다합니다', '최고의 시공', '꼼꼼하게 시공', '친절 상담'];
  let genericMatchCount = 0;
  genericKeywords.forEach(phrase => {
    if (totalBodyText.includes(phrase)) genericMatchCount++;
  });
  if (genericMatchCount > 2) {
    contentGate = GATE_STATUS.WARN;
    warnings.push('Generic marketing phrase ratio elevated');
  }

  // 4. TECHNICAL CLAIM GATE (Safety Check)
  let claimGate = GATE_STATUS.PASS;
  if (totalBodyText.includes('약 24시간이 소요되며') || totalBodyText.includes('무조건 무상 보수')) {
    claimGate = GATE_STATUS.WARN;
    warnings.push('Unqualified curing or AS claim detected');
  }

  // 5. REGION EVIDENCE LIFECYCLE & BINDING CHECK
  const evidenceObj = getRegionEvidence(regionName, regionObj.districtName || regionObj.parentRegionName);
  const evidenceStatus = evidenceObj.status;

  const evidenceAvailable = (evidenceStatus === EVIDENCE_STATUS_ENUM.EXACT_CASE || evidenceStatus === EVIDENCE_STATUS_ENUM.PARENT_CASE);
  
  // evidenceRendered check: Validate if actual case title/text is present in totalBodyText
  let evidenceRendered = false;
  if (evidenceAvailable && evidenceObj.cases && evidenceObj.cases.length > 0) {
    evidenceRendered = evidenceObj.cases.some(c => totalBodyText.includes(c.title || c.id));
  }

  const evidenceScopeCorrect = evidenceStatus === EVIDENCE_STATUS_ENUM.EXACT_CASE || evidenceStatus === EVIDENCE_STATUS_ENUM.PARENT_CASE;
  const evidenceUniqueContribution = (evidenceAvailable && evidenceRendered) ? 15 : 0;

  // 6. POST-EVIDENCE DUPLICATE RISK EVALUATION
  // If evidence is rendered, duplicate risk drops. Without rendered evidence, duplicate risk remains HIGH.
  let postEvidenceDuplicateRisk = 'HIGH';
  if (evidenceRendered && evidenceUniqueContribution > 10) {
    postEvidenceDuplicateRisk = 'PASS';
  } else if (evidenceRendered) {
    postEvidenceDuplicateRisk = 'WARN';
  }

  if (postEvidenceDuplicateRisk === 'HIGH') {
    warnings.push('Cross-Region Same-Task Main Content Duplicate Risk is HIGH (HOLD_FOR_EVIDENCE)');
  }

  // 7. COMPUTE INTERNAL QA SCORE (0-100)
  let qualityScore = 100;
  if (technicalGate === GATE_STATUS.FAIL) qualityScore -= 50;
  if (intentGate === GATE_STATUS.WARN) qualityScore -= 10;
  if (contentGate === GATE_STATUS.WARN) qualityScore -= 10;
  if (claimGate === GATE_STATUS.WARN) qualityScore -= 10;
  if (postEvidenceDuplicateRisk === 'HIGH') qualityScore -= 15;
  if (evidenceAvailable && evidenceRendered) qualityScore += 15;

  qualityScore = Math.max(0, Math.min(100, qualityScore));

  // 8. TIER & ROLLOUT DECISION (STRICT SAFETY GAARDS)
  let qualityTier = QUALITY_TIERS.TIER_C;
  let deploymentStatus = DEPLOYMENT_STATUS.PILOT_ELIGIBLE;
  let rolloutStatus = DEPLOYMENT_STATUS.HOLD_FOR_EVIDENCE;

  if (technicalGate === GATE_STATUS.FAIL) {
    qualityTier = QUALITY_TIERS.TIER_D;
    deploymentStatus = DEPLOYMENT_STATUS.BLOCKED;
    rolloutStatus = DEPLOYMENT_STATUS.BLOCKED;
  } else if (evidenceStatus === EVIDENCE_STATUS_ENUM.EXACT_CASE) {
    if (evidenceRendered && evidenceUniqueContribution > 0 && postEvidenceDuplicateRisk !== 'HIGH') {
      qualityTier = QUALITY_TIERS.TIER_A;
      deploymentStatus = DEPLOYMENT_STATUS.PILOT_ELIGIBLE;
      rolloutStatus = DEPLOYMENT_STATUS.FULL_ROLLOUT_ELIGIBLE;
    } else {
      // EXACT_CASE exists but NOT rendered or Duplicate Risk is HIGH -> Guard to MANUAL_REVIEW / HOLD
      qualityTier = QUALITY_TIERS.TIER_C;
      deploymentStatus = DEPLOYMENT_STATUS.PILOT_ELIGIBLE;
      rolloutStatus = DEPLOYMENT_STATUS.MANUAL_REVIEW;
      warnings.push('Exact evidence exists in registry but is NOT rendered in SSR Content or Duplicate Risk is HIGH. Rollout guarded to MANUAL_REVIEW.');
    }
  } else if (evidenceStatus === EVIDENCE_STATUS_ENUM.PARENT_CASE) {
    if (evidenceRendered && evidenceScopeCorrect && postEvidenceDuplicateRisk !== 'HIGH') {
      qualityTier = QUALITY_TIERS.TIER_B;
      deploymentStatus = DEPLOYMENT_STATUS.PILOT_ELIGIBLE;
      rolloutStatus = DEPLOYMENT_STATUS.FULL_ROLLOUT_ELIGIBLE;
    } else {
      // PARENT_CASE exists but NOT rendered or Duplicate Risk is HIGH -> Guard to HOLD_FOR_EVIDENCE
      qualityTier = QUALITY_TIERS.TIER_C;
      deploymentStatus = DEPLOYMENT_STATUS.PILOT_ELIGIBLE;
      rolloutStatus = DEPLOYMENT_STATUS.HOLD_FOR_EVIDENCE;
      warnings.push('Parent evidence exists but is NOT rendered in SSR Content. Rollout guarded to HOLD_FOR_EVIDENCE.');
    }
  } else {
    // Current V2 Technical Fixture Status: TIER C (Admin Only)
    qualityTier = QUALITY_TIERS.TIER_C;
    deploymentStatus = DEPLOYMENT_STATUS.PILOT_ELIGIBLE;
    rolloutStatus = DEPLOYMENT_STATUS.HOLD_FOR_EVIDENCE;
  }

  return {
    url,
    regionName,
    taskKeyword,
    engineVersion: 'V2',
    technicalGate,
    intentGate,
    contentGate,
    claimGate,
    linkGate: GATE_STATUS.PASS,
    evidenceStatus,
    evidenceAvailable,
    evidenceRendered,
    evidenceScopeCorrect,
    evidenceUniqueContribution,
    postEvidenceDuplicateRisk,
    qualityScore,
    qualityTier,
    deploymentStatus,
    rolloutStatus,
    warnings,
    failures
  };
}

function createQualityGateReport(override) {
  return {
    url: override.url || '',
    qualityTier: override.qualityTier || QUALITY_TIERS.TIER_D,
    deploymentStatus: override.deploymentStatus || DEPLOYMENT_STATUS.BLOCKED,
    rolloutStatus: DEPLOYMENT_STATUS.BLOCKED,
    technicalGate: override.technicalGate || GATE_STATUS.FAIL,
    qualityScore: 0,
    evidenceAvailable: false,
    evidenceRendered: false,
    postEvidenceDuplicateRisk: 'HIGH',
    warnings: override.warnings || [],
    failures: override.failures || []
  };
}
