import { getActiveRegions } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

const activeRegions = getActiveRegions();
const samples = [];

// Let's pick 20 interesting ones
let count = 0;
activeRegions.forEach((reg, rIdx) => {
  serviceKeywords.forEach((tk, tIdx) => {
    count++;
    if (samples.length < 20 && (rIdx % 40 === 0 && tIdx === 0)) {
      samples.push(`/?k=${reg.urlRegion}-${tk.keyword}`);
    }
  });
});

console.log('Selected 20 samples from Hub page:');
samples.forEach((s, idx) => {
  console.log(`${idx + 1}. ${s}`);
});

