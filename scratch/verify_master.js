import { regionMaster } from '../src/data/regionMaster.js';
import { seoulRegions } from '../src/data/seoulRegions.js';
import { incheonRegions } from '../src/data/incheonRegions.js';
import { gyeonggiRegions } from '../src/data/gyeonggiRegions.js';

console.log('--- MASTER DATA VERIFICATION ---');

// Check duplicate names with split IDs
const dongNames = {};
regionMaster.dongs.forEach(d => {
  if (!dongNames[d.name]) dongNames[d.name] = [];
  dongNames[d.name].push(d);
});

const duplicates = Object.keys(dongNames).filter(k => dongNames[k].length > 1);
console.log(`Duplicate dong names across different parent cities/districts: ${duplicates.length}`);
duplicates.forEach(dup => {
  console.log(`- ${dup} exists in:`, dongNames[dup].map(d => `${d.provinceId} -> ${d.parentId} (ID: ${d.id})`));
});

// Count parent-child linkage corrections
// In Gyeonggi regions, dongs that belonged to general districts (like 분당구, 동안구) originally had flat groupNames in App.jsx.
// Now they are linked properly to:
// parentId: districtId (e.g. gyeonggi-안양-동안)
// cityId: cityId (e.g. gyeonggi-안양)
// provinceId: gyeonggi
const parentCorrections = regionMaster.dongs.filter(d => d.provinceId === 'gyeonggi' && d.districtId !== null);
console.log(`Number of Gyeonggi dongs correctly mapped to general districts: ${parentCorrections.length}`);

// Normalization check: find any dongs that have numbers in raw data but normalized in master
const rawSeoulNumbers = seoulRegions.filter(r => r.regionType === 'dong' && /\d/.test(r.displayName));
const rawIncheonNumbers = incheonRegions.filter(r => r.regionType === 'dong' && /\d/.test(r.displayName));
const rawGyeonggiNumbers = gyeonggiRegions.filter(r => r.regionType === 'dong' && /\d/.test(r.displayName));

console.log(`Raw numbered dongs in files: Seoul=${rawSeoulNumbers.length}, Incheon=${rawIncheonNumbers.length}, Gyeonggi=${rawGyeonggiNumbers.length}`);

