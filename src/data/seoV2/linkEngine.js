import { OFFICIAL_SEARCH_INTENT_REGISTRY } from './intentRegistry.js';
import { generateDynamicUrl, generateAbsoluteDynamicUrl, getSameDistrictRegions, getParentDistrictRegion } from '../regionResolver.js';

/**
 * BARUMSPACE SEO ENGINE V2 - INTERNAL LINK ENGINE (STEP 4-C BALANCED & SEPARATED)
 * 
 * Rules:
 * - Stable Cyclic Peer Selection (NO random, NO hash, NO geographic "Nearby" claims).
 * - TYPE A: Same Region Tasks (5 tasks).
 * - TYPE B: Same District Peer Regions (Dong -> Dong peers only, max 4).
 * - TYPE P: Parent Dynamic Landing (Dong -> District/City parent, if valid).
 * - TYPE C: Existing sitemap-seoul Hub (1 link).
 * - Relevance > Link Count. Zero self-links, zero duplicate destination URLs, zero broken links.
 */

export function buildV2InternalLinks(regionObj, serviceObj, siteUrl = 'https://www.barumspace.co.kr') {
  if (!regionObj || !serviceObj) {
    return { sameRegionTasks: [], sameDistrictRegions: [], parentRegionLink: null, hubLink: null, totalLinkCount: 0 };
  }

  const regionName = regionObj.displayName || regionObj.name || '';
  const currentTask = serviceObj.keyword || '탄성코트';
  const urlRegion = regionObj.urlRegion || regionObj.name;
  const currentCanonical = generateAbsoluteDynamicUrl(siteUrl, urlRegion, currentTask);

  const seenUrls = new Set([currentCanonical, generateDynamicUrl(urlRegion, currentTask)]);

  // TIER A: Same Region Related Tasks (Elastic Coating 6 Tasks)
  const officialTasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
  const sameRegionTasks = [];

  officialTasks.forEach(task => {
    if (task === currentTask) return; // Exclude self-link
    const relativeHref = generateDynamicUrl(urlRegion, task);
    const absHref = generateAbsoluteDynamicUrl(siteUrl, urlRegion, task);

    if (seenUrls.has(relativeHref) || seenUrls.has(absHref)) return; // Guard duplicate
    seenUrls.add(relativeHref);
    seenUrls.add(absHref);

    sameRegionTasks.push({
      task,
      href: relativeHref,
      absoluteHref: absHref,
      label: `${regionName} ${task} 안내`
    });
  });

  // TIER B: Same District Peer Regions (Same Admin Level Peers Only)
  const sameDistrictRegions = [];
  const districtPeers = getSameDistrictRegions(regionObj, 4);

  districtPeers.forEach(reg => {
    const regName = reg.displayName || reg.name;
    const regUrlToken = reg.urlRegion || reg.name;
    const relativeHref = generateDynamicUrl(regUrlToken, currentTask);
    const absHref = generateAbsoluteDynamicUrl(siteUrl, regUrlToken, currentTask);

    if (seenUrls.has(relativeHref) || seenUrls.has(absHref)) return; // Guard duplicate & self-link
    seenUrls.add(relativeHref);
    seenUrls.add(absHref);

    sameDistrictRegions.push({
      regionName: regName,
      href: relativeHref,
      absoluteHref: absHref,
      label: `${regName} ${currentTask}`
    });
  });

  // TIER P: Parent Dynamic Landing (Dong -> District/City Parent)
  let parentRegionLink = null;
  const parentRegObj = getParentDistrictRegion(regionObj);
  if (parentRegObj) {
    const parentName = parentRegObj.displayName || parentRegObj.name;
    const parentUrlToken = parentRegObj.urlRegion || parentRegObj.name;
    const relativeHref = generateDynamicUrl(parentUrlToken, currentTask);
    const absHref = generateAbsoluteDynamicUrl(siteUrl, parentUrlToken, currentTask);

    if (!seenUrls.has(relativeHref) && !seenUrls.has(absHref)) {
      seenUrls.add(relativeHref);
      seenUrls.add(absHref);

      parentRegionLink = {
        regionName: parentName,
        href: relativeHref,
        absoluteHref: absHref,
        label: `${parentName} ${currentTask} 안내`
      };
    }
  }

  // TIER C: Existing Hub Link
  const hubLink = {
    href: '/sitemap-seoul',
    absoluteHref: `${siteUrl}/sitemap-seoul`,
    label: '수도권 지역별 탄성코트 시공 안내 허브'
  };

  const totalLinkCount = sameRegionTasks.length + sameDistrictRegions.length + (parentRegionLink ? 1 : 0) + (hubLink ? 1 : 0);

  return {
    isV2LinkEngine: true,
    regionName,
    currentTask,
    sameRegionTasks,
    sameDistrictTitle: '같은 행정구역의 다른 서비스 지역',
    sameDistrictRegions,
    parentRegionTitle: '상위 지역 탄성코트 안내',
    parentRegionLink,
    hubLink,
    totalLinkCount
  };
}
