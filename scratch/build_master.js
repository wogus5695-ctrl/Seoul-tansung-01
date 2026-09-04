import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

import { seoulRegions } from '../src/data/seoulRegions.js';
import { incheonRegions } from '../src/data/incheonRegions.js';
import { gyeonggiRegions } from '../src/data/gyeonggiRegions.js';

console.log('Building Region Master with fixes...');

const master = {
  provinces: [
    { id: 'seoul', name: '서울권', displayName: '서울권', level: 'province', parentId: null, enabled: true },
    { id: 'gyeonggi', name: '경기권', displayName: '경기권', level: 'province', parentId: null, enabled: true },
    { id: 'incheon', name: '인천권', displayName: '인천권', level: 'province', parentId: null, enabled: true }
  ],
  cities: [], // Level 2: Seoul districts, Incheon districts, Gyeonggi cities
  districts: [], // Level 3: Gyeonggi general districts (구) for cities that have them
  dongs: [] // Level 4/3: Dongs, eups, myeons
};

// Map to track IDs
const idSet = new Set();
function getUniqueId(base) {
  let id = base;
  let counter = 1;
  while (idSet.has(id)) {
    id = `${base}-${counter}`;
    counter++;
  }
  idSet.add(id);
  return id;
}

// Helper to normalize dong name (e.g. 비산1동 -> 비산동)
function normalizeDongName(name) {
  if (!name) return '';
  return name.replace(/\d+동$/, '동').replace(/\d+가$/, '가');
}

// 1. Process Seoul
// Seoul has 25 districts.
const seoulDistrictNames = new Set(seoulRegions.map(r => r.districtName));
seoulDistrictNames.forEach(distName => {
  const cityId = `seoul-${distName.replace(/구$/, '')}`;
  master.cities.push({
    id: cityId,
    name: distName,
    displayName: distName,
    level: 'city',
    parentId: 'seoul',
    provinceId: 'seoul',
    aliases: distName === '강남구' ? ['강남'] : [],
    enabled: true,
    generatePage: true,
    sortOrder: 1
  });
});

// Process Seoul Dongs
const processedSeoulDongs = new Set();
seoulRegions.forEach(r => {
  if (r.regionType === 'dong') {
    const normName = normalizeDongName(r.displayName);
    const parentId = `seoul-${r.districtName.replace(/구$/, '')}`;
    
    // De-duplicate within the same district
    const key = `${parentId}-${normName}`;
    if (processedSeoulDongs.has(key)) return;
    processedSeoulDongs.add(key);

    let baseId = `seoul-${r.districtName.replace(/구$/, '')}-${normName.replace(/동$/, '')}`;
    
    let cleanSlug = normName; // 순수 완성형 한글명 사용
    let legacySlug = normName.replace(/동$/, '-dong');
    let originalSlug = r.slugKey; // 원본 영어 슬러그 (e.g. yeoksam-dong)

    master.dongs.push({
      id: baseId,
      name: normName,
      displayName: normName,
      level: 'dong',
      parentId: parentId,
      provinceId: 'seoul',
      cityId: parentId,
      districtId: null,
      aliases: r.aliases || [],
      sourceNames: [r.displayName],
      status: 'active',
      enabled: true,
      generatePage: true,
      slugKey: cleanSlug,
      legacySlug: legacySlug,
      originalSlug: originalSlug,
      sortOrder: 1
    });
  }
});

// 2. Process Incheon
const incheonDistrictNames = new Set(incheonRegions.map(r => r.groupName));
incheonDistrictNames.forEach(distName => {
  if (!distName) return;
  const cityId = `incheon-${distName.replace(/구$/, '')}`;
  master.cities.push({
    id: cityId,
    name: distName,
    displayName: distName,
    level: 'city',
    parentId: 'incheon',
    provinceId: 'incheon',
    aliases: [],
    enabled: true,
    generatePage: true,
    sortOrder: 1
  });
});

const processedIncheonDongs = new Set();
incheonRegions.forEach(r => {
  if (r.regionType === 'dong') {
    const rawName = r.officialName;
    const normName = normalizeDongName(rawName);
    const parentId = `incheon-${r.groupName.replace(/구$/, '')}`;

    const key = `${parentId}-${normName}`;
    if (processedIncheonDongs.has(key)) return;
    processedIncheonDongs.add(key);

    const baseId = `incheon-${r.groupName.replace(/구$/, '')}-${normName.replace(/동$/, '')}`;

    // Clean displayName (remove parent prefix e.g. "계양 작전동" -> "작전동", also remove "인천 " prefix)
    let cleanDisplayName = r.displayName;
    if (cleanDisplayName.startsWith('인천 ')) {
      cleanDisplayName = cleanDisplayName.substring(3).trim();
    }
    const parentStem = r.groupName.replace(/구$/, '');
    if (cleanDisplayName.startsWith(parentStem)) {
      cleanDisplayName = cleanDisplayName.substring(parentStem.length).trim();
    }

    let cleanSlug = normName; // 순수 완성형 한글명 사용
    let legacySlug = r.slugKey; // 기존 슬러그를 legacy로 지정
    let originalSlug = r.slugKey;

    master.dongs.push({
      id: baseId,
      name: normName,
      displayName: cleanDisplayName,
      level: 'dong',
      parentId: parentId,
      provinceId: 'incheon',
      cityId: parentId,
      districtId: null,
      aliases: r.aliases || [],
      sourceNames: [r.displayName, r.officialName],
      status: r.active ? 'active' : 'inactive',
      enabled: true,
      generatePage: true,
      slugKey: cleanSlug,
      legacySlug: legacySlug,
      originalSlug: originalSlug,
      sortOrder: 1,
      collisionResolved: r.collisionResolved,
      requiresCollisionReview: r.requiresCollisionReview
    });
  }
});

// 3. Process Gyeonggi
const gyeonggiCities = new Set(gyeonggiRegions.map(r => r.city).filter(Boolean));
gyeonggiCities.forEach(city => {
  master.cities.push({
    id: `gyeonggi-${city.replace(/시$/, '')}`,
    name: city,
    displayName: city,
    level: 'city',
    parentId: 'gyeonggi',
    provinceId: 'gyeonggi',
    aliases: [],
    enabled: true,
    generatePage: true,
    sortOrder: 1
  });
});

const gyeonggiDistrictsList = gyeonggiRegions.filter(r => r.regionType === 'district' && r.displayName.endsWith('구'));
gyeonggiDistrictsList.forEach(dist => {
  const cityId = `gyeonggi-${dist.city.replace(/시$/, '')}`;
  master.districts.push({
    id: `gyeonggi-${dist.city.replace(/시$/, '')}-${dist.displayName.replace(/구$/, '')}`,
    name: dist.displayName,
    displayName: dist.displayName,
    level: 'district',
    parentId: cityId,
    provinceId: 'gyeonggi',
    cityId: cityId,
    aliases: [],
    enabled: true,
    generatePage: true,
    sortOrder: 1
  });
});

// Gyeonggi Dongs
const processedGyeonggiDongs = new Set();

const addGyeonggiDong = (r) => {
  const normName = normalizeDongName(r.officialName);
  const cityStem = r.city.replace(/시$/, '');
  
  const isDistrict = r.groupName && r.groupName.endsWith('구') && r.groupName !== r.city;
  const groupStem = isDistrict ? r.groupName.replace(/구$/, '') : null;

  const cityId = `gyeonggi-${cityStem}`;
  let districtId = null;
  let parentId = cityId;

  if (groupStem) {
    districtId = `gyeonggi-${cityStem}-${groupStem}`;
    parentId = districtId;
  }

  const key = `${parentId}-${normName}`;
  if (processedGyeonggiDongs.has(key)) return;
  processedGyeonggiDongs.add(key);

  const baseId = `gyeonggi-${cityStem}-${groupStem ? groupStem + '-' : ''}${normName.replace(/동$/, '').replace(/읍$/, '').replace(/면$/, '')}`;

  // Clean displayName (remove parent prefix e.g. "고양 화정동" -> "화정동")
  let cleanDisplayName = r.displayName;
  const parentStems = [cityStem, groupStem].filter(Boolean);
  parentStems.forEach(stem => {
    if (cleanDisplayName.startsWith(stem) && cleanDisplayName !== stem) {
      cleanDisplayName = cleanDisplayName.substring(stem.length).trim();
    }
  });

  // Calculate legacy slug
  let legacySlug = r.slugKey;
  parentStems.forEach(stem => {
    if (legacySlug.startsWith(`${stem}-`)) {
      legacySlug = legacySlug.substring(stem.length + 1);
    }
  });
  legacySlug = legacySlug.replace(/^-+|-+$/g, '').replace(/-+/g, '-');

  let cleanSlug = normName; // 순수 완성형 한글명 사용
  let originalSlug = r.slugKey;

  master.dongs.push({
    id: baseId,
    name: normName,
    displayName: cleanDisplayName,
    level: 'dong',
    parentId: parentId,
    provinceId: 'gyeonggi',
    cityId: cityId,
    districtId: districtId,
    aliases: r.aliases || [],
    sourceNames: [r.displayName, r.officialName],
    status: r.active ? 'active' : 'inactive',
    enabled: true,
    generatePage: true,
    slugKey: cleanSlug,
    legacySlug: legacySlug,
    originalSlug: originalSlug,
    sortOrder: 1,
    collisionResolved: r.collisionResolved,
    requiresCollisionReview: r.requiresCollisionReview
  });
};

gyeonggiRegions.forEach(r => {
  if (r.regionType !== 'district') {
    addGyeonggiDong(r);
  }
});

// Add the missing Anyang Dongan-gu dongs
const missingDonganDongs = ['부흥동', '달안동', '평안동', '범계동', '신촌동', '갈산동'];
missingDonganDongs.forEach(ed => {
  addGyeonggiDong({
    metro: '경기',
    city: '안양시',
    groupName: '동안구',
    officialName: ed,
    displayName: ed,
    regionType: 'dong',
    slugKey: `${ed.replace(/동$/, '-dong')}`,
    aliases: [],
    active: false,
    collisionResolved: true,
    requiresCollisionReview: false
  });
});

// Add missing Anyang Manan-gu dongs as well!
const missingMananDongs = ['명학동', '병목안동', '충훈동', '호현동'];
missingMananDongs.forEach(ed => {
  addGyeonggiDong({
    metro: '경기',
    city: '안양시',
    groupName: '만안구',
    officialName: ed,
    displayName: ed,
    regionType: 'dong',
    slugKey: `${ed.replace(/동$/, '-dong')}`,
    aliases: [],
    active: false,
    collisionResolved: true,
    requiresCollisionReview: false
  });
});

// Add missing Anyang Dongan-gu dongs that were also missing from Expected Anyang list:
const missingDonganExtra = ['인덕원동', '부림동', '귀인동'];
missingDonganExtra.forEach(ed => {
  addGyeonggiDong({
    metro: '경기',
    city: '안양시',
    groupName: '동안구',
    officialName: ed,
    displayName: ed,
    regionType: 'dong',
    slugKey: `${ed.replace(/동$/, '-dong')}`,
    aliases: [],
    active: false,
    collisionResolved: true,
    requiresCollisionReview: false
  });
});

console.log('Verification statistics:');
console.log(`Provinces: ${master.provinces.length}`);
console.log(`Cities: ${master.cities.length}`);
console.log(`Districts (general): ${master.districts.length}`);
console.log(`Dongs: ${master.dongs.length}`);

// Write the master region file
const codeContent = `// 바름공간 계층형 지역 마스터 구조 데이터 (Region Master)
// 최신 행정구역에 부합하도록 구조화되었으며, 중복 명칭 분리 및 긴 키워드 정규화가 완료되었습니다.

export const regionMaster = ${JSON.stringify(master, null, 2)};
`;

fs.writeFileSync(path.join(workspaceRoot, 'src/data/regionMaster.js'), codeContent, 'utf-8');
console.log('Successfully wrote src/data/regionMaster.js');

