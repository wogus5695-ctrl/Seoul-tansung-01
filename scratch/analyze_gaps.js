import { regionMaster } from '../src/data/regionMaster.js';
import { getActiveRegions } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { keywordMetadata } from '../src/data/keywordMetadata.js';

console.log('Running Gap Analysis...');

const currentActive = getActiveRegions();
const activeIds = new Set(currentActive.map(r => r.id));
const activeUrlRegions = new Set(currentActive.map(r => r.urlRegion));

// 1. Analyze Gaps
const missingInHub = [];
const missingInSitemap = [];
const missingInBoth = [];
const dataButNotScreen = [];

// For Anyang-si specifically:
const anyangExpected = {
  manan: ['안양동', '명학동', '병목안동', '석수동', '충훈동', '박달동', '호현동'],
  dongan: ['비산동', '부흥동', '달안동', '관양동', '인덕원동', '부림동', '평촌동', '평안동', '귀인동', '호계동', '범계동', '신촌동', '갈산동']
};

const anyangActual = {
  manan: regionMaster.dongs.filter(d => d.parentId === 'gyeonggi-안양-만안').map(d => d.name),
  dongan: regionMaster.dongs.filter(d => d.parentId === 'gyeonggi-안양-동안').map(d => d.name)
};

console.log('Anyang Manan (Expected):', anyangExpected.manan);
console.log('Anyang Manan (Actual in Master):', anyangActual.manan);
console.log('Anyang Dongan (Expected):', anyangExpected.dongan);
console.log('Anyang Dongan (Actual in Master):', anyangActual.dongan);

// Find missing ones from expected Anyang list
const missingManan = anyangExpected.manan.filter(e => !anyangActual.manan.includes(e));
const missingDongan = anyangExpected.dongan.filter(e => !anyangActual.dongan.includes(e));
console.log('Missing from Master (Manan):', missingManan);
console.log('Missing from Master (Dongan):', missingDongan);

// Check master regions against active list
// In the current resolver:
// 서울: 277 active
// 인천: 29 active
// 경기: 88 active
// Let's check which region nodes in master are missing in currentActive resolver:
const inactiveCities = regionMaster.cities.filter(c => {
  // Map city id to active ID
  let activeId = '';
  if (c.parentId === 'seoul') activeId = `seoul-${c.name}`;
  else if (c.parentId === 'incheon') activeId = `incheon-${c.name}`;
  else activeId = `gyeonggi-${c.name}`;
  return !activeIds.has(activeId);
});

const inactiveDistricts = regionMaster.districts.filter(d => {
  const activeId = `gyeonggi-${d.name}`;
  return !activeIds.has(activeId);
});

const inactiveDongs = regionMaster.dongs.filter(d => {
  let activeId = '';
  if (d.provinceId === 'seoul') {
    activeId = `seoul-${d.name}`;
  } else if (d.provinceId === 'incheon') {
    // In raw incheonRegions, the groupName is 계양구. But ID is incheon-계양구-작전동
    const parentCity = regionMaster.cities.find(c => c.id === d.parentId);
    activeId = `incheon-${parentCity ? parentCity.name : ''}-${d.sourceNames[0] || d.name}`;
  } else {
    const parentCity = regionMaster.cities.find(c => c.id === d.cityId);
    const parentDist = d.districtId ? regionMaster.districts.find(di => di.id === d.districtId) : null;
    activeId = `gyeonggi-${parentCity ? parentCity.name : ''}-${parentDist ? parentDist.name : ''}-${d.sourceNames[0] || d.name}`;
  }
  return !activeIds.has(activeId);
});

console.log(`Inactive Cities: ${inactiveCities.length}`);
console.log(`Inactive Districts: ${inactiveDistricts.length}`);
console.log(`Inactive Dongs: ${inactiveDongs.length}`);

// 8. Same name, different city/district
const duplicateNames = {};
regionMaster.dongs.forEach(d => {
  if (!duplicateNames[d.name]) duplicateNames[d.name] = [];
  duplicateNames[d.name].push(d);
});
const duplicateDongsList = Object.keys(duplicateNames).filter(name => duplicateNames[name].length > 1);

console.log('\n--- Same name, different region examples ---');
duplicateDongsList.slice(0, 10).forEach(name => {
  console.log(`Dong: ${name} is in:`, duplicateNames[name].map(d => `${d.provinceId} > ${d.parentId}`));
});

// Calculate expected URL counts per region (each has 12 service keywords)
const activeRegionCount = getActiveRegions().length;
console.log(`Current Active Regions: ${activeRegionCount}`);
console.log(`Current Active URLs: ${activeRegionCount * 12}`);

const masterRegionCount = regionMaster.cities.length + regionMaster.districts.length + regionMaster.dongs.length;
console.log(`Master Regions (including alias metadata): ${keywordMetadata.length}`);
console.log(`Expected Master URLs (Regions * 12): ${keywordMetadata.length * 12}`);

