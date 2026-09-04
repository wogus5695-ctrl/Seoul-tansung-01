import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { regionMaster } from '../src/data/regionMaster.js';
import { getActiveRegions as oldGetActiveRegions } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

console.log('Testing new region index construction...');

const oldActive = oldGetActiveRegions();
const oldActiveIds = new Set(oldActive.map(o => o.id));

// Let's count stats
let newRegionsCount = 0;
let addedCityKeywords = 0;
let addedDistrictKeywords = 0;
let addedDongKeywords = 0;
let duplicateExcludedCount = 0;
let exceptionUrlCount = 0;

const newActiveRegions = [];

keywordMetadata.forEach(item => {
  // Check if it's new
  let isNew = false;
  // Try to find if this item was active in oldActive
  const wasActive = oldActive.some(oa => {
    let searchMetro = '';
    if (item.regionId.startsWith('seoul')) searchMetro = '서울';
    else if (item.regionId.startsWith('incheon')) searchMetro = '인천';
    else if (item.regionId.startsWith('gyeonggi')) searchMetro = '경기';

    const metroMatch = oa.metro === searchMetro;
    const nameMatch = oa.displayName === item.displayRegion || oa.name === item.displayRegion || oa.officialName === item.displayRegion;
    return metroMatch && nameMatch;
  });

  if (!wasActive) {
    isNew = true;
    newRegionsCount++;
  }

  // Count keywords added
  const keywordsCount = serviceKeywords.length;
  if (item.type === 'city' || item.type === 'alias') {
    addedCityKeywords += keywordsCount;
  } else if (item.type === 'district') {
    addedDistrictKeywords += keywordsCount;
  } else if (item.type === 'dong') {
    addedDongKeywords += keywordsCount;
  }

  // Check exception routeKey
  if (item.routeKey.includes('-')) {
    // Check if it is a dash collision routeKey in Korean (e.g. "과천시-갈현동")
    const isKoreanCollision = /^[ㄱ-ㅎㅏ-ㅣ가-힣]+-[ㄱ-ㅎㅏ-ㅣ가-힣]+$/.test(item.routeKey);
    if (isKoreanCollision) {
      exceptionUrlCount++;
    }
  }
});

console.log('--- STATS ---');
console.log(`Newly added regions: ${newRegionsCount}`);
console.log(`Added City Keywords: ${addedCityKeywords}`);
console.log(`Added District Keywords: ${addedDistrictKeywords}`);
console.log(`Added Dong Keywords: ${addedDongKeywords}`);
console.log(`Exception URL Count (Dong collisions with Korean parent prefix): ${exceptionUrlCount}`);

// Let's write the refactored regionResolver.js file!
const resolverCode = `import { regionMaster } from './regionMaster.js';
import { keywordMetadata } from './keywordMetadata.js';
import { serviceKeywords } from './serviceKeywords.js';

export const ENABLE_CAPITAL_REGION_EXPANSION = true;

// 1. URL 파라미터 정규화 및 안전 디코딩
export function normalizeKeywordParam(k) {
  if (!k) return '';
  try {
    if (k.includes('%25')) return ''; // 이중 인코딩 차단
    const decoded = decodeURIComponent(k);
    
    return decoded
      .normalize('NFC')
      .trim()
      .replace(/[–—−]/g, '-') // 특수 문자 대시 변환
      .replace(/-+/g, '-')    // 연속 하이픈 축약
      .replace(/^[-]/, '')    // 시작 하이픈 제거
      .replace(/[-]$/, '');   // 끝 하이픈 제거
  } catch (e) {
    return '';
  }
}

const sortedServices = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);

export function matchServiceSuffix(normalizedK) {
  if (!normalizedK) return null;
  for (const service of sortedServices) {
    if (normalizedK.endsWith(\`-\${service.keyword}\`)) {
      return service;
    }
  }
  return null;
}

const activeRegionIndex = new Map();
const previewRegionIndex = new Map();

function buildIndexes() {
  keywordMetadata.forEach(item => {
    // Map metadata item and corresponding regionMaster details into the old expected format
    const displaySlug = normalizeKeywordParam(item.displayRegion);
    const slug = normalizeKeywordParam(item.routeKey);

    // Find master entity
    let masterEntity = null;
    let metro = '';
    let city = '';
    let groupName = '';
    let officialName = item.displayRegion;
    let type = item.type;

    if (item.regionId.startsWith('seoul')) {
      metro = '서울';
      city = '서울시';
      masterEntity = regionMaster.cities.find(c => c.id === item.regionId) || 
                     regionMaster.dongs.find(d => d.id === item.regionId);
      if (masterEntity) {
        groupName = masterEntity.name.endsWith('구') ? masterEntity.name : (masterEntity.districtName || masterEntity.parentId?.split('-')[1] || '');
      }
    } else if (item.regionId.startsWith('incheon')) {
      metro = '인천';
      city = '인천시';
      masterEntity = regionMaster.cities.find(c => c.id === item.regionId) || 
                     regionMaster.dongs.find(d => d.id === item.regionId);
      if (masterEntity) {
        groupName = masterEntity.name.endsWith('구') ? masterEntity.name : (masterEntity.groupName || masterEntity.parentId?.split('-')[1] || '');
      }
    } else if (item.regionId.startsWith('gyeonggi')) {
      metro = '경기';
      masterEntity = regionMaster.cities.find(c => c.id === item.regionId) || 
                     regionMaster.districts.find(d => d.id === item.regionId) || 
                     regionMaster.dongs.find(d => d.id === item.regionId);
      if (masterEntity) {
        if (masterEntity.level === 'city') {
          city = masterEntity.name;
          groupName = masterEntity.name;
        } else if (masterEntity.level === 'district') {
          const pCity = regionMaster.cities.find(c => c.id === masterEntity.parentId);
          city = pCity ? pCity.name : '';
          groupName = masterEntity.name;
        } else {
          const pCity = regionMaster.cities.find(c => c.id === masterEntity.cityId);
          city = pCity ? pCity.name : '';
          const pDist = masterEntity.districtId ? regionMaster.districts.find(di => di.id === masterEntity.districtId) : null;
          groupName = pDist ? pDist.name : city;
        }
      }
    }

    if (type === 'alias') {
      type = masterEntity?.level || 'city';
    }

    const entry = {
      id: item.type === 'alias' ? \`\${item.regionId}-alias\` : item.regionId,
      name: item.displayRegion,
      type: type,
      parentId: masterEntity?.parentId || metro,
      generateKeyword: true,
      metro: metro,
      city: city,
      groupName: groupName,
      officialName: officialName,
      displayName: item.displayRegion,
      urlRegion: item.routeKey,
      aliases: [],
      collisionResolved: true,
      requiresCollisionReview: false,
      active: true
    };

    if (displaySlug) {
      activeRegionIndex.set(displaySlug, entry);
      previewRegionIndex.set(displaySlug, entry);
    }
    if (slug && slug !== displaySlug) {
      activeRegionIndex.set(slug, entry);
      previewRegionIndex.set(slug, entry);
    }
  });
}

buildIndexes();

export function findRegionByUrlToken(urlRegion, usePreview = false) {
  const normToken = normalizeKeywordParam(urlRegion);
  if (!normToken) return null;
  return activeRegionIndex.get(normToken) || null;
}

export function parseAndValidateK(kParam, usePreview = false) {
  const normK = normalizeKeywordParam(kParam);
  if (!normK) return { region: null, service: null, isValid: false };

  if (kParam.includes('--')) {
    return { region: null, service: null, isValid: false };
  }

  const service = matchServiceSuffix(normK);
  if (!service) return { region: null, service: null, isValid: false };

  const urlRegionToken = normK.substring(0, normK.length - service.keyword.length - 1);
  if (!urlRegionToken) return { region: null, service: null, isValid: false };

  const region = findRegionByUrlToken(urlRegionToken, usePreview);
  if (!region) return { region: null, service: null, isValid: false };

  return {
    region,
    service,
    isValid: true
  };
}

export function getActiveRegions() {
  const list = [];
  const seen = new Set();
  
  for (const region of activeRegionIndex.values()) {
    if (seen.has(region.id)) continue;
    seen.add(region.id);
    list.push(region);
  }
  return list;
}
`;

fs.writeFileSync(path.join(workspaceRoot, 'src/data/regionResolver.js'), resolverCode, 'utf-8');
console.log('Successfully wrote src/data/regionResolver.js');

