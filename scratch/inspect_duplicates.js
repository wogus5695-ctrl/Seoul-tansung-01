import { keywordMetadata } from '../src/data/keywordMetadata.js';

const lowerRegions = keywordMetadata.filter(item => item.keywordVariant === 'lowerRegion' && item.isIndexable);

const nameMap = new Map();

lowerRegions.forEach(item => {
  const name = item.displayRegionName;
  if (!nameMap.has(name)) {
    nameMap.set(name, []);
  }
  nameMap.get(name).push(item);
});

const duplicates = [];
let totalDuplicateNodes = 0;

for (const [name, items] of nameMap.entries()) {
  if (items.length > 1) {
    duplicates.push({ name, count: items.length, items });
    totalDuplicateNodes += items.length;
  }
}

// Sort by duplicate count descending
duplicates.sort((a, b) => b.count - a.count);

console.log('Total indexable lowerRegions:', lowerRegions.length);
console.log('Unique indexable lowerRegion names:', nameMap.size);
console.log('Duplicate name groups count:', duplicates.length);
console.log('Total nodes involved in duplicates:', totalDuplicateNodes);

const activeRepresented = duplicates.length; // 각 그룹당 1개만 매핑되므로
const lostNodes = totalDuplicateNodes - activeRepresented; // 이 개수만큼 누락됨
const lostPages = lostNodes * 12;

console.log(`Lost Region Nodes: ${lostNodes}`);
console.log(`Lost Pages (Nodes * 12 keywords): ${lostPages}`);

if (duplicates.length > 0) {
  console.log('\n--- Top 15 Duplicate Names Sample ---');
  duplicates.slice(0, 15).forEach(d => {
    console.log(`Name: ${d.name} (${d.count} times)`);
    d.items.forEach(item => {
      console.log(`  - Parent: ${item.parentRegionName} | ID: ${item.id}`);
    });
  });
}
