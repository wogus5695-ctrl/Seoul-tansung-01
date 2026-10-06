/**
 * BARUMSPACE SEO INDEX POLICY MODULE (PHASE A)
 * 
 * Single Source of Truth for Dynamic Page Search Indexability.
 * 
 * Separates index policy ("Should search engines index this page?")
 * from servicePolicy ("What services can be performed in this region?").
 * 
 * Rules:
 * 1. Capital Metros (서울, 경기, 인천) + Elastic Coating -> index, follow
 * 2. Any Grout service -> noindex, follow
 * 3. Any Region outside Capital Metros (e.g. 충청권) -> noindex, follow
 * 4. Invalid or non-dynamic inputs return 'noindex, follow' fallback.
 */

export const CAPITAL_METROS = ['서울', '경기', '인천'];

/**
 * Evaluates robots meta directive for a validated dynamic region and service.
 * 
 * @param {Object} region - Resolved region object from regionResolver
 * @param {Object} service - Matched service keyword object from serviceKeywords
 * @returns {'index, follow' | 'noindex, follow'}
 */
export function getDynamicIndexPolicy(region, service) {
  if (!region || !service) {
    return 'noindex, follow';
  }

  // Rule 1: All grout services are excluded from search index
  if (service.serviceFamily === 'grout') {
    return 'noindex, follow';
  }

  // Rule 2: Regions outside capital area (e.g. Daejeon, Sejong, Chungbuk, Chungnam) are excluded
  if (!CAPITAL_METROS.includes(region.metro)) {
    return 'noindex, follow';
  }

  // Rule 3: Capital area + elastic coating services remain indexed
  if (service.serviceFamily === 'elasticCoating') {
    return 'index, follow';
  }

  // Fallback for safety
  return 'noindex, follow';
}

/**
 * Helper to check if a dynamic page is intended to be indexed.
 * 
 * @param {Object} region 
 * @param {Object} service 
 * @returns {boolean}
 */
export function isDynamicIndexable(region, service) {
  return getDynamicIndexPolicy(region, service) === 'index, follow';
}
