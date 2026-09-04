/**
 * BARUMSPACE SEO ENGINE V2 - VERIFIED REGION EVIDENCE ARCHITECTURE
 * 
 * Rules:
 * - NO fake case data generation.
 * - Exact regional evidence statuses: EXACT_CASE, PARENT_CASE, ADMIN_ONLY, NONE.
 * - Parent region cases MUST NOT claim to be exact dong cases (e.g. "강남구 실제 사례" vs "삼성동 실제 사례").
 */

export const EVIDENCE_STATUS_ENUM = {
  EXACT_CASE: 'EXACT_CASE',
  PARENT_CASE: 'PARENT_CASE',
  ADMIN_ONLY: 'ADMIN_ONLY',
  NONE: 'NONE'
};

// Verified Region Evidence Data Map (State for actual site case records)
export const VERIFIED_REGION_EVIDENCE_REGISTRY = {};

/**
 * Resolves verified evidence for a given region
 */
export function getRegionEvidence(regionName, districtName) {
  const exactRecord = VERIFIED_REGION_EVIDENCE_REGISTRY[regionName];
  if (exactRecord && exactRecord.exactCases && exactRecord.exactCases.length > 0) {
    return {
      status: EVIDENCE_STATUS_ENUM.EXACT_CASE,
      displayLabel: `${regionName} 현장 실제 시공 사례`,
      cases: exactRecord.exactCases
    };
  }

  const parentRecord = VERIFIED_REGION_EVIDENCE_REGISTRY[districtName];
  if (parentRecord && parentRecord.parentCases && parentRecord.parentCases.length > 0) {
    return {
      status: EVIDENCE_STATUS_ENUM.PARENT_CASE,
      displayLabel: `${districtName} 지역 실제 시공 사례`,
      cases: parentRecord.parentCases
    };
  }

  if (districtName) {
    return {
      status: EVIDENCE_STATUS_ENUM.ADMIN_ONLY,
      displayLabel: `${districtName} ${regionName} 행정구역 안내`,
      cases: []
    };
  }

  return {
    status: EVIDENCE_STATUS_ENUM.NONE,
    displayLabel: null,
    cases: []
  };
}
