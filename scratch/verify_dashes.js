import { keywordMetadata } from '../src/data/keywordMetadata.js';

let koreanDashes = 0;
keywordMetadata.forEach(item => {
  if (item.routeKey.includes('-')) {
    const parts = item.routeKey.split('-');
    const isKorean = parts.every(p => /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/.test(p));
    if (isKorean) {
      koreanDashes++;
    }
  }
});
console.log(`Korean dash routeKeys count (regions): ${koreanDashes}`);
console.log(`Korean dash routeKeys URLs (regions * 12): ${koreanDashes * 12}`);

