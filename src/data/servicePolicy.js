// Shared Service Policy module for Region-specific Service Family filtering.
// Provides backward-compatible resolution for allowed services per region.

import { serviceKeywords } from './serviceKeywords.js';

/**
 * Returns allowed service keywords for a given region object based on region.allowedServiceFamilies.
 * 
 * Semantics:
 * - CASE A: region.isIndexable === false -> []
 * - CASE B: region.allowedServiceFamilies === undefined -> ALL 12 serviceKeywords (Backward compatibility for existing 804 regions)
 * - CASE C: allowedServiceFamilies = ['elasticCoating'] -> 6 elasticCoating keywords
 * - CASE D: allowedServiceFamilies = ['grout'] -> 6 grout keywords
 * - CASE E: allowedServiceFamilies = ['elasticCoating', 'grout'] -> 12 keywords
 * - CASE F: allowedServiceFamilies = [] on indexable region -> [] (Warning logged)
 * - CASE G: unknown family -> [] (Warning logged)
 * 
 * @param {Object} region 
 * @returns {Array} List of allowed service keyword objects
 */
export function getAllowedServicesForRegion(region) {
  // CASE 0: If region is null or undefined, no services are allowed.
  if (!region) return [];

  // CASE 2: Non-indexable region -> []
  if (region.isIndexable === false) return [];

  // CASE 1: Backward compatibility: If allowedServiceFamilies is undefined/null on a valid region, default to all serviceKeywords (12)
  if (!region.allowedServiceFamilies || !Array.isArray(region.allowedServiceFamilies)) {
    return serviceKeywords;
  }

  const knownFamilies = new Set(serviceKeywords.map(s => s.serviceFamily));
  
  // Validate unknown family
  for (const fam of region.allowedServiceFamilies) {
    if (!knownFamilies.has(fam)) {
      console.warn(`[servicePolicy] Unknown service family '${fam}' for region '${region.id || region.urlRegionKey || 'unknown'}'`);
      return [];
    }
  }

  // Validate empty list for indexable region
  if (region.isIndexable !== false && region.allowedServiceFamilies.length === 0) {
    console.warn(`[servicePolicy] Empty allowedServiceFamilies list for indexable region '${region.id || region.urlRegionKey || 'unknown'}'`);
    return [];
  }

  // Filter serviceKeywords matching allowed families
  return serviceKeywords.filter(s => region.allowedServiceFamilies.includes(s.serviceFamily));
}
