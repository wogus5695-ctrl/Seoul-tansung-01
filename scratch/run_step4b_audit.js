import { PILOT_V2_REGIONS, getSeoEngineVersion } from '../src/data/seoV2/featureFlag.js';
import { parseAndValidateK, getActiveRegions } from '../src/data/regionResolver.js';
import { buildV2InternalLinks } from '../src/data/seoV2/linkEngine.js';

console.log('=== STEP 4-B READ-ONLY LINK GRAPH FORENSIC AUDIT ===\n');

const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
const regions = Array.from(PILOT_V2_REGIONS);

// 1. Build V2 Nodes (10 Regions x 6 Tasks = 60 Nodes)
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
        inboundTypeC: 0,
        outboundTotal: 0,
        outboundTypeA: 0,
        outboundTypeB: 0,
        outboundTypeC: 0,
        isV2Destination: true
      };
      nodes.push(node);
      nodeMap.set(url, node);
    });
  }
});

console.log(`Total V2 Nodes Created: ${nodes.length}`);

// 2. Build Edges
const edges = [];
let v2ToV2Count = 0;
let v2ToV1Count = 0;

nodes.forEach(srcNode => {
  const links = buildV2InternalLinks(srcNode.regionObj, srcNode.serviceObj);
  
  // TIER A Edges
  links.sameRegionTasks.forEach(l => {
    const destNode = nodeMap.get(l.href);
    const edge = {
      source: srcNode.url,
      destination: l.href,
      anchor: l.label,
      edgeType: 'TYPE_A', // Same Region / Different Task
      isV2Dest: !!destNode
    };
    edges.push(edge);
    srcNode.outboundTotal++;
    srcNode.outboundTypeA++;

    if (destNode) {
      destNode.inboundTotal++;
      destNode.inboundTypeA++;
      v2ToV2Count++;
    } else {
      v2ToV1Count++;
    }
  });

  // TIER B Edges
  links.sameDistrictRegions.forEach(l => {
    const destNode = nodeMap.get(l.href);
    const edge = {
      source: srcNode.url,
      destination: l.href,
      anchor: l.label,
      edgeType: 'TYPE_B', // Same District / Same Task
      isV2Dest: !!destNode
    };
    edges.push(edge);
    srcNode.outboundTotal++;
    srcNode.outboundTypeB++;

    if (destNode) {
      destNode.inboundTotal++;
      destNode.inboundTypeB++;
      v2ToV2Count++;
    } else {
      v2ToV1Count++;
    }
  });

  // TIER C Edge (Hub)
  if (links.hubLink) {
    const edge = {
      source: srcNode.url,
      destination: links.hubLink.href,
      anchor: links.hubLink.label,
      edgeType: 'TYPE_C', // Hub Link
      isV2Dest: false
    };
    edges.push(edge);
    srcNode.outboundTotal++;
    srcNode.outboundTypeC++;
    v2ToV1Count++;
  }
});

console.log(`Total Edges Created: ${edges.length}`);
console.log(`Edge Distribution: TYPE A: ${edges.filter(e => e.edgeType==='TYPE_A').length}, TYPE B: ${edges.filter(e => e.edgeType==='TYPE_B').length}, TYPE C: ${edges.filter(e => e.edgeType==='TYPE_C').length}`);
console.log(`V2 -> V2 Links: ${v2ToV2Count} (${(v2ToV2Count / edges.length * 100).toFixed(1)}%)`);
console.log(`V2 -> V1 Links: ${v2ToV1Count} (${(v2ToV1Count / edges.length * 100).toFixed(1)}%)`);

// 3. Degree Statistics
const inboundDegrees = nodes.map(n => n.inboundTotal);
inboundDegrees.sort((a, b) => a - b);
const minInbound = inboundDegrees[0];
const maxInbound = inboundDegrees[inboundDegrees.length - 1];
const avgInbound = (inboundDegrees.reduce((a, b) => a + b, 0) / inboundDegrees.length).toFixed(2);
const medianInbound = inboundDegrees[Math.floor(inboundDegrees.length / 2)];

console.log(`\nInbound Degree Stats: Min=${minInbound}, Max=${maxInbound}, Avg=${avgInbound}, Median=${medianInbound}`);

// Inbound Zero Nodes
const zeroInboundNodes = nodes.filter(n => n.inboundTotal === 0);
console.log(`Inbound Zero Nodes (within V2 peer graph): ${zeroInboundNodes.length}`);
if (zeroInboundNodes.length > 0) {
  zeroInboundNodes.forEach(n => console.log(`  - ${n.url}`));
}

// 4. Type A Reciprocity
let reciprocatedTypeA = 0;
const edgeSet = new Set(edges.map(e => `${e.source}->${e.destination}`));

edges.filter(e => e.edgeType === 'TYPE_A').forEach(e => {
  if (edgeSet.has(`${e.destination}->${e.source}`)) {
    reciprocatedTypeA++;
  }
});
const typeAReciprocity = ((reciprocatedTypeA / edges.filter(e => e.edgeType === 'TYPE_A').length) * 100).toFixed(1) + '%';
console.log(`Type A Reciprocity: ${typeAReciprocity}`);

// 5. Type B Same District Concentration & First 4 Bias Check
console.log('\n--- TYPE B SAME DISTRICT DESTINATION CONCENTRATION ---');
const typeBDestFreq = {};
edges.filter(e => e.edgeType === 'TYPE_B').forEach(e => {
  typeBDestFreq[e.destination] = (typeBDestFreq[e.destination] || 0) + 1;
});

const sortedTypeBDest = Object.entries(typeBDestFreq).sort((a, b) => b[1] - a[1]);
console.log('Top 5 Type B Destination URLs:');
sortedTypeBDest.slice(0, 5).forEach(([url, count]) => {
  console.log(`  - ${url} : ${count} inbounds`);
});

// Anchor Text Analysis
console.log('\n--- ANCHOR TEXT ANALYSIS ---');
const anchorFreq = {};
edges.forEach(e => {
  anchorFreq[e.anchor] = (anchorFreq[e.anchor] || 0) + 1;
});
console.log(`Unique Anchors Count: ${Object.keys(anchorFreq).length}`);
console.log('Top 5 Most Frequent Anchors:');
Object.entries(anchorFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([anc, count]) => {
  console.log(`  - "${anc}" : ${count} times`);
});
