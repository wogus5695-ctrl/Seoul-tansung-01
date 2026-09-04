import { keywordMetadata } from '../src/data/keywordMetadata.js';

console.log('Verifying keywordMetadata.js for suffixes...');

const patterns = [/-dong/, /-gu/, /-si/, /-gun/, /-eup/, /-myeon/, /-ri/];
let errorCount = 0;
const matchedKeys = [];

keywordMetadata.forEach(item => {
  patterns.forEach(pat => {
    if (pat.test(item.routeKey)) {
      errorCount++;
      matchedKeys.push({ routeKey: item.routeKey, displayRegion: item.displayRegion });
    }
  });
});

console.log(`Total suffix-containing routeKeys in keywordMetadata.js: ${errorCount}`);
if (errorCount > 0) {
  console.log('Sample matched keys:', matchedKeys.slice(0, 10));
}

