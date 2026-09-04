import { getActiveRegions } from '../src/data/regionResolver.js';
import { PILOT_V2_REGIONS } from '../src/data/seoV2/featureFlag.js';
import { testBKeywords } from '../src/data/thumbnailTestMap.js';

console.log('=== STEP 6-A2 FULL ADMIN CLUSTER CENSUS & NAVER BASELINE PACK GENERATION ===\n');

const activeRegions = getActiveRegions();
const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];

// 1. FULL CLUSTER CENSUS
const districtClustersMap = new Map();

activeRegions.forEach(reg => {
  const districtName = reg.districtName || reg.parentRegionName || reg.displayName;
  if (!districtClustersMap.has(districtName)) {
    districtClustersMap.set(districtName, {
      districtName,
      metro: reg.metro || '수도권',
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

console.log(`Total Parent Administrative Clusters Identified: ${districtClustersMap.size}`);

const censusList = [];

districtClustersMap.forEach(cluster => {
  const totalRegionsCount = (cluster.parentObj ? 1 : 0) + cluster.childDongs.length;
  const totalDynamicUrls = totalRegionsCount * tasks.length;

  let thumbnailOverlapCount = 0;
  const clusterRegions = [...(cluster.parentObj ? [cluster.parentObj] : []), ...cluster.childDongs];
  
  clusterRegions.forEach(reg => {
    tasks.forEach(t => {
      if (testBKeywords.has(`${reg.urlRegion}-${t}`)) thumbnailOverlapCount++;
    });
  });

  let fixtureOverlapCount = 0;
  clusterRegions.forEach(reg => {
    if (PILOT_V2_REGIONS.has(reg.displayName) || PILOT_V2_REGIONS.has(reg.name)) {
      fixtureOverlapCount++;
    }
  });

  // Calculate Structural Pilot Score (BARUMSPACE INTERNAL STRUCTURAL PILOT SCORE)
  let score = 100;
  if (!cluster.parentObj) score -= 25;
  if (thumbnailOverlapCount > 0) score -= (thumbnailOverlapCount * 5);
  if (fixtureOverlapCount > 0) score -= (fixtureOverlapCount * 5);
  if (totalDynamicUrls < 36 || totalDynamicUrls > 90) score -= 15;

  censusList.push({
    districtName: cluster.districtName,
    metro: cluster.metro,
    hasParentObj: !!cluster.parentObj,
    childCount: cluster.childDongs.length,
    totalRegionsCount,
    totalDynamicUrls,
    thumbnailOverlapCount,
    fixtureOverlapCount,
    score: Math.max(0, score),
    cluster
  });
});

censusList.sort((a, b) => b.score - a.score || b.totalDynamicUrls - a.totalDynamicUrls);

console.log(`\nValid Candidate Clusters Census Completed (${censusList.length} clusters).\n`);

// 2. STRUCTURAL TOP 8
console.log('=============================================================');
console.log('STRUCTURAL TOP 8 PILOT CLUSTER CANDIDATES');
console.log('=============================================================');

const top8 = censusList.slice(0, 8);
top8.forEach((c, idx) => {
  console.log(`Rank ${idx+1}: [${c.districtName}] (Score: ${c.score}/100) | Scale: ${c.totalRegionsCount} Regions (${c.totalDynamicUrls} URLs) | Parent Landing: ${c.hasParentObj ? 'YES ✅' : 'NO'}`);
});

// 3. BASELINE TEST & PROVISIONAL CONTROL PAIRS (3 TEST + 3 CONTROL)
const testClusters = [
  censusList.find(c => c.districtName === '강동구'),
  censusList.find(c => c.districtName === '광진구'),
  censusList.find(c => c.districtName === '구로구')
];

const controlClusters = [
  censusList.find(c => c.districtName === '송파구'),
  censusList.find(c => c.districtName === '성동구'),
  censusList.find(c => c.districtName === '동작구')
];

// Helper to select 4 stratified regions (1 Parent + 3 Child)
function getStratifiedRegions(clusterObj) {
  const result = [];
  if (clusterObj.parentObj) {
    result.push({ role: 'PARENT', reg: clusterObj.parentObj });
  }
  const dongs = clusterObj.childDongs;
  if (dongs.length >= 3) {
    const step = Math.floor(dongs.length / 3);
    result.push({ role: 'CHILD_1', reg: dongs[0] });
    result.push({ role: 'CHILD_2', reg: dongs[step] });
    result.push({ role: 'CHILD_3', reg: dongs[dongs.length - 1] });
  } else {
    dongs.forEach((d, i) => result.push({ role: `CHILD_${i+1}`, reg: d }));
  }
  return result;
}

// Generate Baseline Pack (144 Rows)
const baselinePack = [];

function generateClusterPack(clusterSummary, groupType, candidateRole) {
  const stratified = getStratifiedRegions(clusterSummary.cluster);
  stratified.forEach(item => {
    const reg = item.reg;
    tasks.forEach(t => {
      const dynamicKeyword = `${reg.displayName} ${t}`;
      const searchQuery = dynamicKeyword; // Real Naver query policy
      const productionUrl = `https://www.barumspace.co.kr/?k=${reg.urlRegion}-${t}`;
      
      baselinePack.push({
        candidateCluster: clusterSummary.districtName,
        groupType, // 'TEST' or 'PROVISIONAL_CONTROL'
        candidateRole,
        sampleRole: item.role,
        region: reg.displayName,
        task: t,
        dynamicKeyword,
        searchQuery,
        productionUrl,
        naverExposure: 'PENDING_EXTERNAL_CHECK',
        naverExactRank: 'PENDING_EXTERNAL_CHECK',
        rankBucket: 'PENDING_EXTERNAL_CHECK',
        indexStatus: 'PENDING_EXTERNAL_CHECK',
        resultTitle: 'PENDING_EXTERNAL_CHECK',
        resultSnippet: 'PENDING_EXTERNAL_CHECK',
        thumbnailVisible: 'PENDING_EXTERNAL_CHECK',
        checkedDate: 'PENDING_EXTERNAL_CHECK'
      });
    });
  });
}

testClusters.forEach((c, i) => generateClusterPack(c, 'TEST', `TEST_CANDIDATE_${i+1}`));
controlClusters.forEach((c, i) => generateClusterPack(c, 'PROVISIONAL_CONTROL', `CONTROL_CANDIDATE_${i+1}`));

console.log(`\n=============================================================`);
console.log(`TOTAL NAVER BASELINE WORKLOAD PACK SUMMARY`);
console.log(`=============================================================`);
console.log(`Total Clusters Sampled      : 6 (3 Test + 3 Provisional Control)`);
console.log(`Samples per Cluster         : 4 Regions (1 Parent + 3 Child Dongs)`);
console.log(`Tasks per Sample Region     : 6 Elastic Coating Tasks`);
console.log(`Total Baseline Keyword Rows : ${baselinePack.length} Rows (Expected: 144 Rows) ✅`);

// Display Sample Row Preview
console.log('\nSample Baseline Row Preview (First 3 Rows):');
console.log(JSON.stringify(baselinePack.slice(0, 3), null, 2));
