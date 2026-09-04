import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

const kParam = '안양-비산동-탄성코트';

const sortedKeywords = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);
let matchedService = null;
let prefix = '';

for (const s of sortedKeywords) {
  if (kParam.endsWith(`-${s.keyword}`)) {
    matchedService = s;
    prefix = kParam.substring(0, kParam.length - s.keyword.length - 1);
    break;
  }
}

console.log('matchedService:', matchedService?.keyword);
console.log('prefix:', prefix);

if (matchedService && prefix) {
  const directMatch = keywordMetadata.find(km => km.routeKey === prefix);
  console.log('directMatch:', directMatch);
  let targetRouteKey = null;

  if (directMatch) {
    // Already clean
  } else {
    const parts = prefix.split('-');
    const dongName = parts[parts.length - 1];
    const parentPrefix = parts.slice(0, -1).join('-');
    console.log('dongName:', dongName, 'parentPrefix:', parentPrefix);

    const candidates = keywordMetadata.filter(km => km.displayRegion === dongName && km.type === 'dong');
    console.log('candidates count:', candidates.length);
    if (candidates.length === 1) {
      targetRouteKey = candidates[0].routeKey;
    } else if (candidates.length > 1 && parentPrefix) {
      const cleanParentPrefix = parentPrefix.replace(/구$/, '').replace(/시$/, '');
      const matchedTarget = candidates.find(cand => {
        const parentClean = cand.parentRegion.replace(/구/g, '').replace(/시/g, '').replace(/권/g, '');
        return parentClean.includes(cleanParentPrefix);
      });
      if (matchedTarget) {
        targetRouteKey = matchedTarget.routeKey;
      }
    }
  }

  console.log('targetRouteKey:', targetRouteKey);
}

