import { gyeonggiRegions } from '../src/data/gyeonggiRegions.js';
import { incheonRegions } from '../src/data/incheonRegions.js';
import { seoulRegions } from '../src/data/seoulRegions.js';

console.log('Checking typos...');

// Check for double spaces in names
const allRaw = [
  ...seoulRegions.map(r => ({ ...r, source: 'seoul' })),
  ...incheonRegions.map(r => ({ ...r, source: 'incheon' })),
  ...gyeonggiRegions.map(r => ({ ...r, source: 'gyeonggi' }))
];

allRaw.forEach(r => {
  if (r.displayName && r.displayName.includes('  ')) {
    console.log(`Double space found in ${r.source}: '${r.displayName}' (slugKey: ${r.slugKey})`);
  }
  if (r.slugKey && r.slugKey.includes('pyeoeng')) {
    console.log(`Typo slug found in ${r.source}: '${r.displayName}' (slugKey: ${r.slugKey})`);
  }
});

