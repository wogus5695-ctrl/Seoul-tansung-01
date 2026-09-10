// Pre-build / Audit Validator Script for Region Registry and Service Policies.
// Ensures data integrity, zero duplicate URLs, zero composite keywords, and valid service families.

import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { gyeonggiSouthRegions } from '../src/data/gyeonggiSouthRegions.js';
import { chungcheongRegions } from '../src/data/chungcheongRegions.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { getActiveRegions, getAllowedServicesForRegion } from '../src/data/regionResolver.js';

function validateRegions() {
  console.log('--- STARTING REGION REGISTRY VALIDATION ---');
  let errorCount = 0;
  let warningCount = 0;

  const knownServiceFamilies = new Set(serviceKeywords.map(s => s.serviceFamily));
  const seenIds = new Set();
  const seenUrlRegionKeys = new Map();

  const allMetadata = [...keywordMetadata, ...gyeonggiSouthRegions, ...chungcheongRegions];

  allMetadata.forEach((item, index) => {
    const locStr = `[Index ${index} | ID: ${item.id || 'N/A'} | Region: ${item.displayRegionName || 'N/A'}]`;

    // Rule 1: Duplicate region ID (warn on baseline, error on new expansion)
    if (item.id) {
      if (seenIds.has(item.id)) {
        if (item.expansionBatch || item.allowedServiceFamilies) {
          console.error(`[ERROR 1] Duplicate ID '${item.id}' at ${locStr}`);
          errorCount++;
        } else {
          console.warn(`[WARN 1] Baseline Duplicate ID '${item.id}' at ${locStr}`);
          warningCount++;
        }
      }
      seenIds.add(item.id);
    }

    // Rule 3: Empty displayName
    if (!item.displayRegionName || !item.displayRegionName.trim()) {
      console.error(`[ERROR 3] Empty displayRegionName at ${locStr}`);
      errorCount++;
    }

    // Rule 2 & 11: Duplicate urlRegionKey / Collision
    if (item.isIndexable) {
      if (!item.urlRegionKey || !item.urlRegionKey.trim()) {
        console.error(`[ERROR 2] Empty urlRegionKey on indexable region at ${locStr}`);
        errorCount++;
      } else {
        if (seenUrlRegionKeys.has(item.urlRegionKey)) {
          console.error(`[ERROR 2/11] Duplicate urlRegionKey '${item.urlRegionKey}' collides with ${seenUrlRegionKeys.get(item.urlRegionKey)} at ${locStr}`);
          errorCount++;
        } else {
          seenUrlRegionKeys.set(item.urlRegionKey, locStr);
        }
      }
    }

    // Rule 6 & 7: Invalid or Unknown allowedServiceFamilies
    if (item.allowedServiceFamilies !== undefined) {
      if (!Array.isArray(item.allowedServiceFamilies)) {
        console.error(`[ERROR 6] allowedServiceFamilies is not an array at ${locStr}`);
        errorCount++;
      } else {
        // Rule 8: Indexable with empty allowedServiceFamilies
        if (item.isIndexable && item.allowedServiceFamilies.length === 0) {
          console.error(`[ERROR 8] Indexable region has empty allowedServiceFamilies array at ${locStr}`);
          errorCount++;
        }
        for (const fam of item.allowedServiceFamilies) {
          if (!knownServiceFamilies.has(fam)) {
            console.error(`[ERROR 7] Unknown serviceFamily '${fam}' at ${locStr}`);
            errorCount++;
          }
        }
      }
    }

    // Rule 9: Accidental Eup / Myeon indexing on new expansion batches
    if (item.isIndexable && (item.regionType === '읍' || item.regionType === '면')) {
      if (item.expansionBatch || item.allowedServiceFamilies) {
        console.error(`[ERROR 9] Accidental indexing of new Eup/Myeon '${item.displayRegionName}' (${item.regionType}) at ${locStr}`);
        errorCount++;
      }
    }

    // Rule 10: Composite Region Name in displayName
    if (item.displayRegionName && (item.displayRegionName.includes('화성시-') || item.displayRegionName.includes('동탄구-') || item.displayRegionName.split('-').length > 2)) {
      console.error(`[ERROR 10] Composite region name in displayName '${item.displayRegionName}' at ${locStr}`);
      errorCount++;
    }

    // Rule 5: Multi-parent structure validity
    if (item.parentIds && !Array.isArray(item.parentIds)) {
      console.error(`[ERROR 5] parentIds is not an array at ${locStr}`);
      errorCount++;
    }
  });

  // Rule 13: Active regions count & service selector consistency check
  const activeRegions = getActiveRegions();
  console.log(`\nActive indexable regions count: ${activeRegions.length}`);

  let totalDynamicUrls = 0;
  activeRegions.forEach(reg => {
    const allowed = getAllowedServicesForRegion(reg);
    totalDynamicUrls += allowed.length;
  });

  console.log(`Total dynamic URLs produced across active regions: ${totalDynamicUrls}`);

  console.log('\n--- VALIDATION SUMMARY ---');
  console.log(`Total Errors: ${errorCount}`);
  console.log(`Total Warnings: ${warningCount}`);

  if (errorCount > 0) {
    console.error('FAILED Region Registry Validation!');
    process.exit(1);
  } else {
    console.log('SUCCESS! Region Registry Validation Passed cleanly.');
  }
}

validateRegions();
