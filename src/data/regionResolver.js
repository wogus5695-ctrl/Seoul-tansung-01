import { regionMaster } from './regionMaster.js';
import { keywordMetadata } from './keywordMetadata.js';
import { serviceKeywords } from './serviceKeywords.js';

export const ENABLE_CAPITAL_REGION_EXPANSION = true;

// 1. URL 파라미터 정규화 및 안전 디코딩 (일원화된 정규화 공통 함수)
export function normalizeKeywordParam(k) {
  if (!k) return '';
  try {
    const raw = k.includes('%25') ? '' : decodeURIComponent(k);
    return raw
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')   // 연속 공백을 단일 공백으로 치환
      .replace(/[–—−]/g, '-') // 특수 대시 기호 단일화
      .replace(/-+/g, '-')    // 연속 하이픈 치환
      .replace(/^[-]/, '')    // 앞자리 하이픈 제거
      .replace(/[-]$/, '')    // 뒷자리 하이픈 제거
      .trim();
  } catch (e) {
    return '';
  }
}

const sortedServices = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);

export function matchServiceSuffix(normalizedK) {
  if (!normalizedK) return null;
  for (const service of sortedServices) {
    if (normalizedK.endsWith(`-${service.keyword}`)) {
      return service;
    }
  }
  return null;
}

const activeRegionIndex = new Map();
const previewRegionIndex = new Map();

function buildIndexes() {
  keywordMetadata.forEach(item => {
    if (!item.isIndexable) return;

    const displaySlug = normalizeKeywordParam(item.displayRegionName);
    const slug = normalizeKeywordParam(item.urlRegionKey);

    let masterEntity = null;
    let metro = '';
    let city = '';
    let groupName = '';
    let officialName = item.officialRegionName;
    let type = item.keywordVariant === 'lowerRegion' ? 'dong' : (item.regionType === '구' ? 'district' : 'city');

    const lookupId = item.regionId;

    if (lookupId.startsWith('seoul')) {
      metro = '서울';
      city = '서울시';
      masterEntity = regionMaster.cities.find(c => c.id === lookupId) || 
                     regionMaster.dongs.find(d => d.id === lookupId);
      if (masterEntity) {
        if (masterEntity.level === 'dong') {
          const parentCity = regionMaster.cities.find(c => c.id === masterEntity.parentId);
          groupName = parentCity ? parentCity.name : '';
        } else {
          const cityEntity = regionMaster.cities.find(c => c.id === lookupId) || masterEntity;
          groupName = cityEntity ? cityEntity.name : '';
        }
      }
    } else if (lookupId.startsWith('incheon')) {
      metro = '인천';
      city = '인천시';
      masterEntity = regionMaster.cities.find(c => c.id === lookupId) || 
                     regionMaster.dongs.find(d => d.id === lookupId);
      if (masterEntity) {
        if (masterEntity.level === 'dong') {
          const parentCity = regionMaster.cities.find(c => c.id === masterEntity.parentId);
          groupName = parentCity ? parentCity.name : '';
        } else {
          const cityEntity = regionMaster.cities.find(c => c.id === lookupId) || masterEntity;
          groupName = cityEntity ? cityEntity.name : '';
        }
      }
    } else if (lookupId.startsWith('gyeonggi')) {
      metro = '경기';
      masterEntity = regionMaster.cities.find(c => c.id === lookupId) || 
                     regionMaster.districts.find(d => d.id === lookupId) || 
                     regionMaster.dongs.find(d => d.id === lookupId);
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

    const entry = {
      id: item.id,
      name: item.officialRegionName,
      type: type,
      parentId: masterEntity?.parentId || metro,
      generateKeyword: true,
      metro: metro,
      city: city,
      groupName: groupName,
      officialName: officialName,
      displayName: item.displayRegionName,
      urlRegion: item.urlRegionKey,
      aliases: [],
      collisionResolved: true,
      requiresCollisionReview: false,
      active: item.isIndexable
    };

    const addIndex = (key, val) => {
      const existing = activeRegionIndex.get(key);
      if (existing) {
        if (Array.isArray(existing)) {
          existing.push(val);
        } else {
          activeRegionIndex.set(key, [existing, val]);
        }
      } else {
        activeRegionIndex.set(key, val);
      }
    };

    if (displaySlug) {
      addIndex(displaySlug, entry);
    }
    if (slug && slug !== displaySlug) {
      addIndex(slug, entry);
    }
  });
}

buildIndexes();

export function findRegionByUrlToken(urlRegion, usePreview = false) {
  const normToken = normalizeKeywordParam(urlRegion);
  if (!normToken) return null;
  const match = activeRegionIndex.get(normToken);
  if (!match) return null;
  if (Array.isArray(match)) {
    // If it's duplicate, default to first item, or resolve using query logic if extended.
    // For general URL matching fallback, returning the first matched region object is standard.
    return match[0];
  }
  return match;
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
    const item = Array.isArray(region) ? region[0] : region;
    if (seen.has(item.urlRegion)) continue;
    seen.add(item.urlRegion);
    list.push(item);
  }
  return list;
}

export function generateDynamicUrl(routeKey, keyword) {
  const params = new URLSearchParams();
  params.set('k', `${routeKey}-${keyword}`);
  return `/?${params.toString()}`;
}

export function generateAbsoluteDynamicUrl(siteUrl, routeKey, keyword) {
  const params = new URLSearchParams();
  params.set('k', `${routeKey}-${keyword}`);
  const base = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  return `${base}/?${params.toString()}`;
}
