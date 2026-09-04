import fs from 'fs';
import path from 'path';
import { keywordMetadata } from '../src/data/keywordMetadata.js';

function getRegionPrefix(parentName) {
  if (!parentName) return '';
  const parts = parentName.trim().split(/\s+/);
  const lastPart = parts[parts.length - 1];
  if (lastPart.endsWith('구') || lastPart.endsWith('시') || lastPart.endsWith('군')) {
    return lastPart.slice(0, -1);
  }
  return lastPart;
}

const lowerRegions = keywordMetadata.filter(item => item.keywordVariant === 'lowerRegion' && item.isIndexable);

const nameMap = new Map();
lowerRegions.forEach(item => {
  const name = item.displayRegionName;
  if (!nameMap.has(name)) {
    nameMap.set(name, []);
  }
  nameMap.get(name).push(item);
});

let updatedCount = 0;
let preservedCount = 0;

const updatedMetadata = keywordMetadata.map(item => {
  if (item.keywordVariant !== 'lowerRegion' || !item.isIndexable) {
    return item;
  }
  
  const group = nameMap.get(item.displayRegionName);
  if (!group || group.length <= 1) {
    return item; // No collision
  }
  
  // Find index of this node in the collision group
  const idx = group.findIndex(g => g.id === item.id);
  if (idx === 0) {
    // Preserve the first matched item's URL (ex: "신흥동")
    preservedCount++;
    return item;
  }
  
  // Append parent suffix prefix to secondary nodes (ex: "성남-신흥동")
  const prefix = getRegionPrefix(item.parentRegionName);
  const newUrlKey = `${prefix}-${item.urlRegionKey}`;
  
  updatedCount++;
  return {
    ...item,
    urlRegionKey: newUrlKey
  };
});

console.log(`Preserved (first matched): ${preservedCount}`);
console.log(`Updated unique keys (colliding secondaries): ${updatedCount}`);

// Write back to keywordMetadata.js
const targetFile = path.join(process.cwd(), 'src', 'data', 'keywordMetadata.js');
const fileContent = `// 재구성된 바름공간 키워드 및 지역 메타데이터\nexport const keywordMetadata = ${JSON.stringify(updatedMetadata, null, 2)};\n`;

try {
  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  console.log('Successfully updated keywordMetadata.js');
} catch (e) {
  console.error('Failed to write keywordMetadata.js:', e);
}
