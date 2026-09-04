import { getActiveRegions } from '../src/data/regionResolver.js';
import { PILOT_V2_REGIONS } from '../src/data/seoV2/featureFlag.js';
import { testBKeywords } from '../src/data/thumbnailTestMap.js';
import { buildV2InternalLinks } from '../src/data/seoV2/linkEngine.js';

console.log('=== STEP 6-A PRODUCTION PILOT CLUSTER SELECTION AUDIT (READ ONLY) ===\n');

const activeRegions = getActiveRegions();
console.log(`Total Active Regions in Registry: ${activeRegions.length}`);

// Group by Parent Administrative District/City
const districtClustersMap = new Map();

activeRegions.forEach(reg => {
  const districtName = reg.districtName || reg.parentRegionName || reg.displayName;
  if (!districtClustersMap.has(districtName)) {
    districtClustersMap.set(districtName, {
      districtName,
      parentObj: null,
      childDongs: []
    });
  }
  const cluster = districtClustersMap.get(districtName);
  
  if (reg.displayName === districtName || reg.name === districtName || reg.urlRegion === districtName) {
    cluster.parentObj = reg;
  } else {
    cluster.childDongs.push(reg);
  }
});

console.log(`Total Administrative District Clusters Identified: ${districtClustersMap.size}\n`);

// Analyze Candidates with 5 to 15 Child Dongs (Targeting ~30 to 90 V2 Candidate URLs)
const candidateClusters = [];

districtClustersMap.forEach(cluster => {
  const totalRegionsCount = (cluster.parentObj ? 1 : 0) + cluster.childDongs.length;
  const totalDynamicUrls = totalRegionsCount * 6; // 6 elastic coating tasks

  // Calculate Thumbnail Overlap
  let thumbnailOverlapCount = 0;
  const clusterRegions = [...(cluster.parentObj ? [cluster.parentObj] : []), ...cluster.childDongs];
  
  clusterRegions.forEach(reg => {
    const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
    tasks.forEach(t => {
      const k = `${reg.urlRegion}-${t}`;
      if (testBKeywords.has(k)) thumbnailOverlapCount++;
    });
  });

  // Calculate Technical Fixture Overlap
  let fixtureOverlapCount = 0;
  clusterRegions.forEach(reg => {
    if (PILOT_V2_REGIONS.has(reg.displayName) || PILOT_V2_REGIONS.has(reg.name)) {
      fixtureOverlapCount++;
    }
  });

  // Link Graph Isolation Simulation (If this entire cluster is V2)
  const clusterUrlSet = new Set();
  clusterRegions.forEach(reg => {
    const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
    tasks.forEach(t => clusterUrlSet.add(`/?k=${reg.urlRegion}-${t}`));
  });

  let totalOutboundDynamic = 0;
  let inClusterOutboundDynamic = 0;

  clusterRegions.forEach(reg => {
    const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
    tasks.forEach(t => {
      const links = buildV2InternalLinks(reg, { keyword: t });
      [...links.sameRegionTasks, ...links.sameDistrictRegions, ...(links.parentRegionLink ? [links.parentRegionLink] : [])].forEach(l => {
        totalOutboundDynamic++;
        if (clusterUrlSet.has(l.href)) inClusterOutboundDynamic++;
      });
    });
  });

  const isolationRatio = totalOutboundDynamic > 0 ? (inClusterOutboundDynamic / totalOutboundDynamic * 100).toFixed(1) : '100.0';

  if (totalRegionsCount >= 4 && totalRegionsCount <= 16) {
    candidateClusters.push({
      districtName: cluster.districtName,
      hasParentObj: !!cluster.parentObj,
      childCount: cluster.childDongs.length,
      totalRegionsCount,
      totalDynamicUrls,
      thumbnailOverlapCount,
      fixtureOverlapCount,
      isolationRatio: parseFloat(isolationRatio),
      cluster
    });
  }
});

console.log(`Found ${candidateClusters.length} Suitable Parent+Child Cluster Candidates (Scale: 24 to 96 URLs):\n`);

candidateClusters.forEach((c, idx) => {
  console.log(`Candidate ${idx+1}: [${c.districtName}]`);
  console.log(`  - Parent Dynamic Landing Present: ${c.hasParentObj ? 'YES ✅' : 'NO (Child Dongs Only)'}`);
  console.log(`  - Child Dongs Count              : ${c.childCount}`);
  console.log(`  - Total Region Count             : ${c.totalRegionsCount} (${c.totalDynamicUrls} V2 Candidate URLs)`);
  console.log(`  - Technical Fixture Overlap      : ${c.fixtureOverlapCount} regions`);
  console.log(`  - Thumbnail Experiment Overlap   : ${c.thumbnailOverlapCount} URLs`);
  console.log(`  - Graph Isolation V2->V2 Ratio  : ${c.isolationRatio}%`);
  console.log('-');
});

// Scoring Candidates for TOP 3 Selection
candidateClusters.forEach(c => {
  let score = 100;
  if (!c.hasParentObj) score -= 15;
  if (c.thumbnailOverlapCount > 0) score -= (c.thumbnailOverlapCount * 5);
  if (c.fixtureOverlapCount > 0) score -= (c.fixtureOverlapCount * 5);
  if (c.isolationRatio < 80) score -= 15;
  if (c.totalDynamicUrls < 36 || c.totalDynamicUrls > 84) score -= 10;
  c.score = Math.max(0, score);
});

candidateClusters.sort((a, b) => b.score - a.score);

console.log('\n=============================================================');
console.log('TOP 3 PILOT CLUSTER CANDIDATE RECOMMENDATIONS');
console.log('=============================================================');

candidateClusters.slice(0, 3).forEach((c, idx) => {
  console.log(`\nRANK ${idx+1}: [${c.districtName}] (Selection Score: ${c.score} / 100)`);
  console.log(`  - Scale                   : ${c.totalRegionsCount} Regions (${c.totalDynamicUrls} URLs)`);
  console.log(`  - Parent Landing Included : ${c.hasParentObj ? 'YES ✅' : 'NO'}`);
  console.log(`  - Graph Isolation Ratio   : ${c.isolationRatio}% V2->V2`);
  console.log(`  - Thumbnail Conflict Risk : ${c.thumbnailOverlapCount === 0 ? 'NONE ✅' : `LOW (${c.thumbnailOverlapCount} URLs)`}`);
  console.log(`  - Fixture Overlap Risk    : ${c.fixtureOverlapCount === 0 ? 'NONE ✅' : `${c.fixtureOverlapCount} regions`}`);
});
