import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

console.log('Testing redirect resolver logic...');

const sortedServices = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);

function getRedirectTarget(kParam) {
  let matchedService = null;
  let prefix = '';
  for (const s of sortedServices) {
    if (kParam.endsWith(`-${s.keyword}`)) {
      matchedService = s;
      prefix = kParam.substring(0, kParam.length - s.keyword.length - 1);
      break;
    }
  }

  if (!matchedService || !prefix) return null;

  // Normalize prefix: e.g. "부평구-산곡동", "안양-비산동", "동안구-호계동", "김포-고촌읍"
  // Let's find if there is a direct match in keywordMetadata routeKey
  const directMatch = keywordMetadata.find(km => km.routeKey === prefix);
  if (directMatch) {
    // If it's already a clean/valid routeKey, check if it's the expected canonical format
    return `/?k=${encodeURIComponent(directMatch.routeKey + '-' + matchedService.keyword)}`;
  }

  // If not direct match, let's extract the clean dong name from prefix.
  // The prefix is usually: "상위명-동명" (e.g. "부평구-산곡동", "안양-비산동")
  const parts = prefix.split('-');
  const dongName = parts[parts.length - 1]; // e.g. "산곡동", "비산동", "고촌읍"
  const parentPrefix = parts.slice(0, -1).join('-'); // e.g. "부평구", "안양", "동안구"

  // Search for regions matching dongName in metadata
  const candidates = keywordMetadata.filter(km => km.displayRegion === dongName && km.type === 'dong');

  if (candidates.length === 1) {
    // Unique match! No collision (e.g. 비산동, 고촌읍). Redirect to its clean routeKey!
    const target = candidates[0];
    return `/?k=${encodeURIComponent(target.routeKey + '-' + matchedService.keyword)}`;
  } else if (candidates.length > 1) {
    // Collision! (e.g. 산곡동, 갈현동). We must match the parentPrefix to the candidate's parentRegion.
    // Clean parent stems
    const cleanParentPrefix = parentPrefix.replace(/구$/, '').replace(/시$/, '');
    const matchedTarget = candidates.find(cand => {
      const parentClean = cand.parentRegion.replace(/구/g, '').replace(/시/g, '').replace(/권/g, '');
      return parentClean.includes(cleanParentPrefix);
    });

    if (matchedTarget) {
      // Redirect to the candidate's routeKey (which is the exception qualified URL e.g. "부평-산곡동")
      return `/?k=${encodeURIComponent(matchedTarget.routeKey + '-' + matchedService.keyword)}`;
    }
  }

  return null;
}

// Test cases
const testCases = [
  '부평구-산곡동-탄성코트',
  '안양-비산동-탄성코트',
  '동안구-호계동-탄성코트',
  '안양시-평촌동-줄눈시공',
  '부평-구산동-줄눈시공', // duplicate
  '과천시-갈현동-탄성코트' // duplicate
];

testCases.forEach(tc => {
  console.log(`Input: ${tc} -> Redirect Target: ${getRedirectTarget(tc)}`);
});

