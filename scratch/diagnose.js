import { seoulRegions } from '../src/data/seoulRegions.js';
import { incheonRegions } from '../src/data/incheonRegions.js';
import { gyeonggiRegions } from '../src/data/gyeonggiRegions.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { getActiveRegions } from '../src/data/regionResolver.js';

const activeRegions = getActiveRegions();
const activeIds = new Set(activeRegions.map(ar => ar.id));

console.log('=== DETAILED FLAGS STUDY ===');

// 1. Analyze Seoul
let activeSeoulCount = 0;
let filteredSeoulCount = 0;
seoulRegions.forEach(r => {
  const id = `seoul-${r.displayName}`;
  if (activeIds.has(id)) {
    activeSeoulCount++;
  } else {
    filteredSeoulCount++;
  }
});
console.log(`Seoul: Total raw = ${seoulRegions.length}, Active = ${activeSeoulCount}, Filtered = ${filteredSeoulCount}`);

// 2. Analyze Incheon
let activeIncheonCount = 0;
let filteredIncheonCount = 0;
const filteredIncheonList = [];
incheonRegions.forEach(r => {
  const id = r.regionType === 'district' ? `incheon-${r.groupName}` : `incheon-${r.groupName}-${r.officialName}`;
  if (activeIds.has(id)) {
    activeIncheonCount++;
  } else {
    filteredIncheonCount++;
    filteredIncheonList.push(r);
  }
});
console.log(`Incheon: Total raw = ${incheonRegions.length}, Active = ${activeIncheonCount}, Filtered = ${filteredIncheonCount}`);
console.log(`  - collisionResolved === false: ${filteredIncheonList.filter(r => r.collisionResolved === false).length}`);
console.log(`  - requiresCollisionReview === true: ${filteredIncheonList.filter(r => r.requiresCollisionReview === true).length}`);
console.log(`  - requiresOfficialReview === true: ${filteredIncheonList.filter(r => r.requiresOfficialReview === true).length}`);

// 3. Analyze Gyeonggi
let activeGyeonggiCount = 0;
let filteredGyeonggiCount = 0;
const filteredGyeonggiList = [];
gyeonggiRegions.forEach(r => {
  const id = r.regionType === 'district' 
    ? `gyeonggi-${r.officialName}` 
    : `gyeonggi-${r.city}-${r.groupName || ''}-${r.officialName}`;
  if (activeIds.has(id)) {
    activeGyeonggiCount++;
  } else {
    filteredGyeonggiCount++;
    filteredGyeonggiList.push(r);
  }
});
console.log(`Gyeonggi: Total raw = ${gyeonggiRegions.length}, Active = ${activeGyeonggiCount}, Filtered = ${filteredGyeonggiCount}`);
console.log(`  - collisionResolved === false: ${filteredGyeonggiList.filter(r => r.collisionResolved === false).length}`);
console.log(`  - requiresCollisionReview === true: ${filteredGyeonggiList.filter(r => r.requiresCollisionReview === true).length}`);
console.log(`  - requiresOfficialReview === true: ${filteredGyeonggiList.filter(r => r.requiresOfficialReview === true).length}`);

// Let's print Gyeonggi cities and active dongs count per city
console.log('\n--- Active Dongs Count per City in Gyeonggi ---');
const gyeonggiCities = Array.from(new Set(gyeonggiRegions.map(r => r.city))).filter(Boolean);
gyeonggiCities.forEach(city => {
  const allDongs = gyeonggiRegions.filter(r => r.city === city && r.regionType !== 'district');
  const activeDongs = activeRegions.filter(r => r.metro === '경기' && r.city === city && r.regionType !== 'district');
  console.log(`${city}: Raw Dongs = ${allDongs.length}, Active Dongs = ${activeDongs.length}`);
});

console.log('\n--- Active Districts in Incheon ---');
const activeIncheonDistricts = activeRegions.filter(r => r.metro === '인천' && r.regionType === 'district');
console.log(activeIncheonDistricts.map(d => d.displayName));

console.log('\n--- Active Dongs in Incheon ---');
const activeIncheonDongs = activeRegions.filter(r => r.metro === '인천' && r.regionType !== 'district');
console.log(`Total active Incheon dongs: ${activeIncheonDongs.length}`);

// Duplicate checks
const activeIncheonNames = activeRegions.filter(r => r.metro === '인천').map(r => r.displayName);
const activeGyeonggiNames = activeRegions.filter(r => r.metro === '경기').map(r => r.displayName);

const countOccurrences = arr => {
  const counts = {};
  arr.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
  return Object.keys(counts).filter(k => counts[k] > 1).map(k => `${k} (${counts[k]} times)`);
};

console.log('\n--- Duplicate Names in Active Incheon ---');
console.log(countOccurrences(activeIncheonNames));

console.log('\n--- Duplicate Names in Active Gyeonggi ---');
console.log(countOccurrences(activeGyeonggiNames));

