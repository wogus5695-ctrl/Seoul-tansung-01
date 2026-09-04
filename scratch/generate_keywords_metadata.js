import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

import { regionMaster } from '../src/data/regionMaster.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

console.log('Generating Keyword Metadata...');

const keywordMetadata = [];
const abbreviationCollisions = [];
const activeNamesAndAliases = new Set();

// Collect all official names, displayNames, and slugKeys to detect collisions
regionMaster.cities.forEach(c => {
  activeNamesAndAliases.add(c.name);
});
regionMaster.districts.forEach(d => {
  activeNamesAndAliases.add(d.name);
});
regionMaster.dongs.forEach(d => {
  activeNamesAndAliases.add(d.name);
  activeNamesAndAliases.add(d.displayName);
});

// Helper to determine regionType in Korean
function getKoreanRegionType(name, type) {
  if (type === 'city' || type === 'district') {
    return name.endsWith('시') ? '시' : (name.endsWith('구') ? '구' : '시/구');
  }
  if (name.endsWith('동')) return '동';
  if (name.endsWith('읍')) return '읍';
  if (name.endsWith('면')) return '면';
  if (name.endsWith('리')) return '리';
  return '동';
}

// 1. Process Cities and Districts (and their abbreviation aliases)
let totalFullRegions = 0;
let totalAbbreviations = 0;

const processCityOrDistrict = (r, metro) => {
  totalFullRegions++;
  const fullName = r.name;
  const parentName = metro;

  const defaultRouteKey = r.slugKey || r.id.split('-').slice(1).join('-');
  const regType = getKoreanRegionType(fullName, r.level);

  // Add full name entry
  keywordMetadata.push({
    displayRegion: fullName,
    keywordName: fullName,
    regionType: regType,
    legacySlug: defaultRouteKey,
    originalSlug: defaultRouteKey,
    parentRegion: parentName,
    routeKey: defaultRouteKey,
    regionId: r.id,
    type: r.level
  });

  // Determine abbreviation (e.g. "안양시" -> "안양", "노원구" -> "노원")
  const abbrev = fullName.replace(/시$/, '').replace(/구$/, '');
  if (abbrev && abbrev !== fullName) {
    const matches = regionMaster.dongs.filter(d => d.name === abbrev || d.displayName === abbrev || d.name === `${abbrev}동`);
    let collision = matches.length > 0;
    
    if (collision) {
      abbreviationCollisions.push({
        fullName,
        abbreviation: abbrev,
        reason: `동명 '${matches[0].name}'과 지명 충돌 가능성`
      });
    } else {
      totalAbbreviations++;
      const aliasRouteKey = defaultRouteKey.replace(/-si$/, '').replace(/-gu$/, '');
      keywordMetadata.push({
        displayRegion: abbrev,
        keywordName: abbrev,
        regionType: regType, // Keep same type for classification
        legacySlug: aliasRouteKey,
        originalSlug: aliasRouteKey,
        parentRegion: parentName,
        routeKey: aliasRouteKey,
        regionId: r.id,
        type: 'alias'
      });
    }
  }
};

regionMaster.cities.forEach(c => {
  const metro = c.parentId === 'seoul' ? '서울시' : (c.parentId === 'incheon' ? '인천시' : '경기도');
  processCityOrDistrict(c, metro);
});

regionMaster.districts.forEach(d => {
  const parentCity = regionMaster.cities.find(c => c.id === d.parentId);
  const metro = `경기도 ${parentCity ? parentCity.name : ''}`;
  processCityOrDistrict(d, metro);
});

// 2. Process Dongs
regionMaster.dongs.forEach(d => {
  totalFullRegions++;
  
  const parentProvince = regionMaster.provinces.find(p => p.id === d.provinceId);
  const parentCity = regionMaster.cities.find(c => c.id === d.cityId);
  const parentDistrict = d.districtId ? regionMaster.districts.find(di => di.id === d.districtId) : null;

  const parentPath = [
    parentProvince ? parentProvince.name : '',
    parentCity ? parentCity.name : '',
    parentDistrict ? parentDistrict.name : ''
  ].filter(Boolean).join(' > ');

  const regType = getKoreanRegionType(d.displayName, 'dong');

  keywordMetadata.push({
    displayRegion: d.displayName, // e.g. "구산동"
    keywordName: d.displayName,   // 완성형 한글 지역명
    regionType: regType,         // 시·구·동·읍·면 분류
    legacySlug: d.legacySlug,     // 기존 legacy URL 연결용
    originalSlug: d.originalSlug, // 원본 영어 슬러그
    parentRegion: parentPath,     // e.g. "인천권 > 부평구"
    routeKey: d.slugKey,          // 완성형 한글 슬러그
    regionId: d.id,
    type: 'dong'
  });
});

console.log(`Abbreviation collisions count: ${abbreviationCollisions.length}`);

const codeContent = `// 바름공간 키워드 생성용 지역 매핑 메타데이터 (Keyword Metadata)
// 상위 행정구역 경로와 실제 검색 노출용 표시 지역명(displayRegion)을 완전 분리했습니다.

export const keywordMetadata = ${JSON.stringify(keywordMetadata, null, 2)};
export const abbreviationCollisions = ${JSON.stringify(abbreviationCollisions, null, 2)};
`;

fs.writeFileSync(path.join(workspaceRoot, 'src/data/keywordMetadata.js'), codeContent, 'utf-8');
console.log('Successfully wrote src/data/keywordMetadata.js');

