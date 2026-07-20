import { seoulRegions } from './seoulRegions.js';
import { incheonRegions } from './incheonRegions.js';
import { gyeonggiRegions } from './gyeonggiRegions.js';
import { serviceKeywords } from './serviceKeywords.js';

// Feature Flag: 활성화 여부에 따라 운영 인덱스에 인천·경기 데이터를 노출할지 결정
// true로 설정하여 운영 환경(sitemap-seoul 및 일반 접속)에 검증 완료된 인천·경기를 공식 활성화합니다.
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

// 2. 길이가 긴 작업명 순서로 정렬된 서비스 키워드
const sortedServices = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);

// 3. 작업명 Suffix 판별 함수
export function matchServiceSuffix(normalizedK) {
  if (!normalizedK) return null;
  for (const service of sortedServices) {
    if (normalizedK.endsWith(`-${service.keyword}`)) {
      return service;
    }
  }
  return null;
}

// 4. 통합 지역 인덱스 캐시
const activeRegionIndex = new Map();
const previewRegionIndex = new Map();

function buildIndexes() {
  // 서울
  seoulRegions.forEach(r => {
    const displaySlug = normalizeKeywordParam(r.displayName);
    const normSlug = normalizeKeywordParam(r.normalizedName);
    
    const seoulEntry = {
      ...r,
      metro: '서울',
      city: '서울시',
      groupName: r.districtName,
      officialName: r.normalizedName,
      displayName: r.displayName,
      urlRegion: r.slugKey || r.displayName,
      aliases: r.displayName === r.normalizedName ? [] : [r.displayName],
      collisionResolved: true,
      requiresCollisionReview: false,
      active: true
    };

    if (displaySlug) {
      activeRegionIndex.set(displaySlug, seoulEntry);
      previewRegionIndex.set(displaySlug, seoulEntry);
    }
    if (normSlug && normSlug !== displaySlug) {
      activeRegionIndex.set(normSlug, seoulEntry);
      previewRegionIndex.set(normSlug, seoulEntry);
    }
    if (seoulEntry.slugKey) {
      const slugNormalized = normalizeKeywordParam(seoulEntry.slugKey);
      if (slugNormalized && slugNormalized !== displaySlug && slugNormalized !== normSlug) {
        activeRegionIndex.set(slugNormalized, seoulEntry);
        previewRegionIndex.set(slugNormalized, seoulEntry);
      }
    }
  });

  // 인천
  incheonRegions.forEach(r => {
    // 운영 활성화 대상 검증 필터링
    if (!r.officialName || !r.displayName || !r.slugKey) return;
    if (r.requiresCollisionReview || r.collisionResolved === false) return; // 충돌 검토 및 해소 여부 확인
    if (r.requiresOfficialReview) return;
    
    // URL 적합성 검사
    const slug = normalizeKeywordParam(r.slugKey);
    if (!slug || slug.includes('--') || slug.startsWith('-') || slug.endsWith('-')) return;

    // Determine parentId based on type. 광역시 -> 구 -> 동
    const type = r.regionType === 'district' ? 'district' : 'dong';
    const parentId = r.regionType === 'district' ? 'incheon' : `incheon-${r.groupName}`;
    const uniqueId = r.regionType === 'district' ? `incheon-${r.groupName}` : `incheon-${r.groupName}-${r.officialName}`;

    const entry = {
      ...r,
      id: uniqueId,
      name: r.displayName, // name field mapping
      type: type,
      parentId: parentId,
      generateKeyword: true,
      city: '인천시',
      urlRegion: r.slugKey
    };

    previewRegionIndex.set(slug, entry);
    // 원래 active: false 로 비활성 상태로 들어간 인천구 데이터 중 collisionResolved가 완료된 항목은 운영에 포함
    if (r.active || ENABLE_CAPITAL_REGION_EXPANSION) {
      activeRegionIndex.set(slug, entry);
    }
  });

  // 경기
  gyeonggiRegions.forEach(r => {
    // 운영 활성화 대상 검증 필터링
    if (!r.officialName || !r.displayName || !r.slugKey) return;
    if (r.requiresCollisionReview || r.collisionResolved === false) return; // 충돌 검토 및 해소 여부 확인
    if (r.requiresOfficialReview) return;

    // URL 적합성 검사
    const slug = normalizeKeywordParam(r.slugKey);
    if (!slug || slug.includes('--') || slug.startsWith('-') || slug.endsWith('-')) return;

    // Determine type and parent hierarchy:
    // 경기 -> 시 -> (일반구 있을 시 구) -> 동
    let type = 'dong';
    let parentId = 'gyeonggi';
    if (r.regionType === 'district') {
      type = r.officialName.endsWith('구') ? 'district' : 'city';
      parentId = r.officialName.endsWith('구') ? `gyeonggi-${r.city}` : 'gyeonggi';
    } else {
      // For dongs, parent is the city or district
      parentId = r.groupName ? `gyeonggi-${r.groupName}` : `gyeonggi-${r.city}`;
    }

    const uniqueId = r.regionType === 'district' 
      ? `gyeonggi-${r.officialName}` 
      : `gyeonggi-${r.city}-${r.groupName || ''}-${r.officialName}`;

    const entry = {
      ...r,
      id: uniqueId,
      name: r.displayName,
      type: type,
      parentId: parentId,
      generateKeyword: true,
      urlRegion: r.slugKey
    };

    previewRegionIndex.set(slug, entry);
    if (r.active || ENABLE_CAPITAL_REGION_EXPANSION) {
      activeRegionIndex.set(slug, entry);
    }
  });
}

buildIndexes();

// 5. urlRegion 기반 지역 조회 함수
export function findRegionByUrlToken(urlRegion, usePreview = false) {
  const normToken = normalizeKeywordParam(urlRegion);
  if (!normToken) return null;
  const index = (usePreview || ENABLE_CAPITAL_REGION_EXPANSION) ? previewRegionIndex : activeRegionIndex;
  return index.get(normToken) || null;
}

// 6. 전체 파서 검증 및 파싱 함수
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

// 7. 현재 활성화된 운영 지역 목록 반환 유틸리티 (통합 sitemap-seoul 및 sitemap.xml용)
export function getActiveRegions() {
  const list = [];
  const seen = new Set();
  
  // Map values 순회
  for (const region of activeRegionIndex.values()) {
    if (seen.has(region.urlRegion)) continue;
    seen.add(region.urlRegion);
    list.push(region);
  }
  return list;
}
