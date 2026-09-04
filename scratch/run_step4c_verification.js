import { PILOT_V2_REGIONS, getSeoEngineVersion } from '../src/data/seoV2/featureFlag.js';
import { parseAndValidateK, getActiveRegions } from '../src/data/regionResolver.js';
import { buildV2InternalLinks } from '../src/data/seoV2/linkEngine.js';

console.log('=== STEP 4-C IMPLEMENTATION & GRAPH DISTRIBUTION VERIFICATION ===\n');

const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
const regions = Array.from(PILOT_V2_REGIONS);

const nodes = [];
const nodeMap = new Map();

regions.forEach(rName => {
  const activeRegs = getActiveRegions();
  const regionObj = activeRegs.find(r => r.displayName === rName || r.name === rName);
  
  if (regionObj) {
    tasks.forEach(tName => {
      const k = `${regionObj.urlRegion}-${tName}`;
      const url = `/?k=${k}`;
      const node = {
        url,
        k,
        regionName: regionObj.displayName || regionObj.name,
        districtName: regionObj.districtName || regionObj.parentRegionName || '',
        task: tName,
        regionObj,
        serviceObj: { keyword: tName },
        inboundTotal: 0,
        inboundTypeA: 0,
        inboundTypeB: 0,
        inboundTypeP: 0,
        inboundTypeC: 0,
        outboundTotal: 0,
        outboundTypeA: 0,
        outboundTypeB: 0,
        outboundTypeP: 0,
        outboundTypeC: 0
      };
      nodes.push(node);
      nodeMap.set(url, node);
    });
  }
});

const edges = [];
let v2ToV2Dynamic = 0;
let v2ToV1Dynamic = 0;
let v2ToHub = 0;

nodes.forEach(srcNode => {
  const links = buildV2InternalLinks(srcNode.regionObj, srcNode.serviceObj);
  
  // TIER A
  links.sameRegionTasks.forEach(l => {
    const destNode = nodeMap.get(l.href);
    edges.push({ source: srcNode.url, destination: l.href, edgeType: 'TYPE_A' });
    srcNode.outboundTotal++;
    srcNode.outboundTypeA++;
    if (destNode) {
      destNode.inboundTotal++;
      destNode.inboundTypeA++;
      v2ToV2Dynamic++;
    } else {
      v2ToV1Dynamic++;
    }
  });

  // TIER B (Same Admin Level Peers)
  links.sameDistrictRegions.forEach(l => {
    const destNode = nodeMap.get(l.href);
    edges.push({ source: srcNode.url, destination: l.href, edgeType: 'TYPE_B' });
    srcNode.outboundTotal++;
    srcNode.outboundTypeB++;
    if (destNode) {
      destNode.inboundTotal++;
      destNode.inboundTypeB++;
      v2ToV2Dynamic++;
    } else {
      v2ToV1Dynamic++;
    }
  });

  // TIER P (Parent Dynamic Landing)
  if (links.parentRegionLink) {
    const destNode = nodeMap.get(links.parentRegionLink.href);
    edges.push({ source: srcNode.url, destination: links.parentRegionLink.href, edgeType: 'TYPE_P' });
    srcNode.outboundTotal++;
    srcNode.outboundTypeP++;
    if (destNode) {
      destNode.inboundTotal++;
      destNode.inboundTypeP++;
      v2ToV2Dynamic++;
    } else {
      v2ToV1Dynamic++;
    }
  }

  // TIER C (Hub)
  if (links.hubLink) {
    edges.push({ source: srcNode.url, destination: links.hubLink.href, edgeType: 'TYPE_C' });
    srcNode.outboundTotal++;
    srcNode.outboundTypeC++;
    v2ToHub++;
  }
});

console.log(`Total V2 Nodes: ${nodes.length}`);
console.log(`Total Edges: ${edges.length}`);
console.log(`Edge Breakdown: TYPE A: ${edges.filter(e => e.edgeType==='TYPE_A').length}, TYPE B: ${edges.filter(e => e.edgeType==='TYPE_B').length}, TYPE P: ${edges.filter(e => e.edgeType==='TYPE_P').length}, TYPE C: ${edges.filter(e => e.edgeType==='TYPE_C').length}`);

// Leakage Metrics
const totalEdges = edges.length;
const totalDynamicEdges = v2ToV2Dynamic + v2ToV1Dynamic;
console.log('\n--- LEAKAGE & EXPERIMENT METRICS ---');
console.log(`Overall V2 -> V2 Edge Ratio: ${v2ToV2Dynamic} / ${totalEdges} (${(v2ToV2Dynamic/totalEdges*100).toFixed(1)}%)`);
console.log(`Overall V2 -> V1 Edge Ratio: ${v2ToV1Dynamic} / ${totalEdges} (${(v2ToV1Dynamic/totalEdges*100).toFixed(1)}%)`);
console.log(`Overall V2 -> Hub Edge Ratio: ${v2ToHub} / ${totalEdges} (${(v2ToHub/totalEdges*100).toFixed(1)}%)`);
console.log(`Dynamic-Only V2 -> V1 Leakage Ratio: ${v2ToV1Dynamic} / ${totalDynamicEdges} (${(v2ToV1Dynamic/totalDynamicEdges*100).toFixed(1)}%)`);

// Inbound Distribution Statistics for TYPE B (Same District Peers)
console.log('\n--- TYPE B INBOUND DISTRIBUTION (STABLE CYCLIC SELECTION) ---');
const typeBInbounds = {};
edges.filter(e => e.edgeType === 'TYPE_B').forEach(e => {
  typeBInbounds[e.destination] = (typeBInbounds[e.destination] || 0) + 1;
});

const sortedTypeB = Object.entries(typeBInbounds).sort((a, b) => b[1] - a[1]);
console.log(`Distinct Destination URLs in TYPE B: ${sortedTypeB.length}`);
console.log('Sample Type B Inbound Counts per Destination:');
sortedTypeB.slice(0, 10).forEach(([url, count]) => {
  console.log(`  - ${url} : ${count} inbounds`);
});

// Type B Reciprocity
let typeBReciprocated = 0;
const edgeSet = new Set(edges.map(e => `${e.source}->${e.destination}`));
edges.filter(e => e.edgeType === 'TYPE_B').forEach(e => {
  if (edgeSet.has(`${e.destination}->${e.source}`)) {
    typeBReciprocated++;
  }
});
const typeBReciprocityRatio = ((typeBReciprocated / edges.filter(e => e.edgeType === 'TYPE_B').length) * 100).toFixed(1) + '%';
console.log(`\nTYPE B Reciprocity Ratio: ${typeBReciprocityRatio}`);

// Cluster Pilot Simulation (Assuming Gangnam-gu Cluster as All V2)
console.log('\n--- CLUSTER PILOT SIMULATION (Gangnam-gu Cluster) ---');
const gangnamNodes = nodes.filter(n => n.districtName === '강남구');
let gangnamV2ToV2 = 0;
let gangnamTotalDynamic = 0;

gangnamNodes.forEach(n => {
  const links = buildV2InternalLinks(n.regionObj, n.serviceObj);
  [...links.sameRegionTasks, ...links.sameDistrictRegions].forEach(l => {
    gangnamTotalDynamic++;
    if (l.href.includes('삼성동') || l.href.includes('대치동') || l.href.includes('역삼동') || l.href.includes('개포동') || l.href.includes('논현동') || l.href.includes('강남구')) {
      gangnamV2ToV2++;
    }
  });
});
console.log(`Gangnam Cluster Simulation Dynamic V2->V2 Ratio: ${gangnamV2ToV2} / ${gangnamTotalDynamic} (${(gangnamV2ToV2/gangnamTotalDynamic*100).toFixed(1)}%)`);
