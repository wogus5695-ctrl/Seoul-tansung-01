/**
 * BARUMSPACE SEO ENGINE V2 - FEATURE FLAG CONTROLLER
 * 
 * Controls Wave 1 Pilot deployment (10 Pilot Regions for Elastic Coating keywords)
 * Fallbacks to V1 Engine for all other regions and Grout keywords.
 */

export const PILOT_V2_REGIONS = new Set([
  '삼성동', '황계동', '대치동', '역삼동', '개봉동',
  '방교동', '반정동', '신남동', '공릉동', '이문동'
]);

export function getSeoEngineVersion(regionName, taskKeyword, forceV2 = false) {
  if (forceV2) return 'V2';
  
  // Only Elastic Coating keywords in Pilot regions trigger V2
  if (taskKeyword && taskKeyword.includes('탄성코트') && PILOT_V2_REGIONS.has(regionName)) {
    return 'V2';
  }
  
  return 'V1';
}
