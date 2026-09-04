import { getActiveRegions } from '../src/data/regionResolver.js';

const active = getActiveRegions();
console.log(`Verified active regions in resolver: ${active.length}`);

