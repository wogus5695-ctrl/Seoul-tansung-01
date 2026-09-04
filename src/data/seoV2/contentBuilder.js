import { OFFICIAL_SEARCH_INTENT_REGISTRY } from './intentRegistry.js';
import { CONTENT_MODULE_REGISTRY } from './contentModules.js';
import { getFaqV2ListForTask } from './faqRegistry.js';
import { getRegionEvidence } from './regionEvidence.js';

/**
 * BARUMSPACE SEO ENGINE V2 - CONTENT BUILDER
 * Assembles rich informational content (1,200~2,000 chars) for SSR HTML and CSR DOM.
 * Guarantees zero disappearance and 100% semantic parity between SSR and CSR.
 */
export function buildV2Content(regionObj, serviceObj) {
  const regionName = typeof regionObj === 'string' ? regionObj : (regionObj?.displayName || regionObj?.name || '해당 지역');
  const taskName = typeof serviceObj === 'string' ? serviceObj : (serviceObj?.keyword || '탄성코트');
  
  const intentConfig = OFFICIAL_SEARCH_INTENT_REGISTRY[taskName] || OFFICIAL_SEARCH_INTENT_REGISTRY['탄성코트'];
  
  // 1. Filter applicable content modules
  const applicableModules = CONTENT_MODULE_REGISTRY.filter(mod => 
    mod.applicableTasks.includes(taskName) || mod.applicableTasks.includes('전체')
  );

  // Group modules into 3 H2 sections based on blueprints
  const h2Sections = intentConfig.h2Blueprints.map((h2Blueprint, idx) => {
    // Select 1-2 modules for each H2 blueprint
    let assignedModules = [];
    if (idx === 0) {
      assignedModules = applicableModules.filter(m => m.category === 'diagnosis' || m.category === 'space');
    } else if (idx === 1) {
      assignedModules = applicableModules.filter(m => m.category === 'process' || m.category === 'problem');
    } else {
      assignedModules = applicableModules.filter(m => m.category === 'company' || m.category === 'maintenance' || m.category === 'space');
    }

    if (assignedModules.length === 0) {
      assignedModules = applicableModules.slice(idx * 2, idx * 2 + 2);
    }

    const titleText = h2Blueprint.title.replace(/{region}/g, regionName);
    const paragraphs = assignedModules.map(mod => 
      mod.bodyTemplate.replace(/{region}/g, regionName)
    );

    return {
      h2Id: h2Blueprint.id,
      title: titleText,
      paragraphs,
      modules: assignedModules
    };
  });

  // 2. Fetch Task-Specific FAQ 5 Q&As
  const faqs = getFaqV2ListForTask(taskName);

  // 3. Assemble Hero Notice & Meta Context
  const heroIntro = serviceObj?.heroDescriptionTemplate 
    ? serviceObj.heroDescriptionTemplate.replace(/{region}/g, regionName)
    : `${regionName} 베란다와 세탁실 벽면 상태를 진단하고 세라믹 탄성코트 전문 마감을 안내합니다.`;

  const metaContextText = serviceObj?.sectionDescriptionTemplate
    ? serviceObj.sectionDescriptionTemplate.replace(/{region}/g, regionName)
    : `${regionName} 지역 탄성코트 시공은 베란다와 다용도실 수축 팽창 벽면의 기존 페인트 박리를 보수하고 세라믹 코팅제를 균일하게 도포하여 쾌적한 마감을 안착시킵니다.`;

  // Calculate total visible text character count
  let totalCharCount = regionName.length + taskName.length + heroIntro.length + metaContextText.length;
  h2Sections.forEach(sec => {
    totalCharCount += sec.title.length;
    sec.paragraphs.forEach(p => { totalCharCount += p.length; });
  });
  faqs.forEach(f => { totalCharCount += f.q.length + f.a.length; });

  return {
    isV2: true,
    regionName,
    taskName,
    h1Text: `${regionName} ${taskName}`,
    heroIntro,
    metaContextText,
    h2Sections,
    faqs,
    totalCharCount
  };
}

/**
 * BARUMSPACE SEO ENGINE V3 - PILOT CONTENT BUILDER (7-Layer Architecture)
 * Eliminates unsupported localized claims and builds high information-gain structured landing pages.
 */
export function buildV3Content(regionObj, serviceObj) {
  const regionName = typeof regionObj === 'string' ? regionObj : (regionObj?.displayName || regionObj?.name || '해당 지역');
  const taskName = typeof serviceObj === 'string' ? serviceObj : (serviceObj?.keyword || '탄성코트');
  const districtName = typeof regionObj === 'object' ? (regionObj?.districtName || regionObj?.groupName || '') : '';
  
  const intentConfig = OFFICIAL_SEARCH_INTENT_REGISTRY[taskName] || OFFICIAL_SEARCH_INTENT_REGISTRY['탄성코트'];

  // 1. Meta Description (V3 Deterministic Engine)
  const metaDescription = generateV3Description(regionName, taskName);

  // 2. 7-Layer Architecture Content Sections
  const applicableModules = CONTENT_MODULE_REGISTRY.filter(mod => 
    mod.applicableTasks.includes(taskName) || mod.applicableTasks.includes('전체')
  );

  const h2Sections = intentConfig.h2Blueprints.map((h2Blueprint, idx) => {
    let assignedModules = [];
    if (idx === 0) {
      assignedModules = applicableModules.filter(m => m.category === 'diagnosis' || m.category === 'space');
    } else if (idx === 1) {
      assignedModules = applicableModules.filter(m => m.category === 'process' || m.category === 'problem');
    } else {
      assignedModules = applicableModules.filter(m => m.category === 'company' || m.category === 'maintenance' || m.category === 'space');
    }

    if (assignedModules.length === 0) {
      assignedModules = applicableModules.slice(idx * 2, idx * 2 + 2);
    }

    const titleText = sanitizeV3Title(h2Blueprint.title, regionName);
    const paragraphs = assignedModules.map(mod => 
      sanitizeV3Body(mod.bodyTemplate, regionName)
    );

    return {
      h2Id: h2Blueprint.id,
      title: titleText,
      paragraphs,
      modules: assignedModules
    };
  });

  // 3. Layer 5: Verified Region Evidence
  const evidenceData = getRegionEvidence(regionName, districtName);

  // 4. Layer 6: Consumer Pre-check Checklist
  const checklist = [
    { title: '바탕면 상태 정리', desc: '손상된 수성페인트 박리 부위를 수크래퍼로 긁어내어 살을 정리하는지 확인' },
    { title: '균열 및 틈새 보강', desc: '콘크리트 미세 크랙 및 창틀 벌어짐을 퍼티 및 아크릴계 보수재로 정돈하는지 점검' },
    { title: '정밀 비닐 마스킹', desc: '샷시 창틀, 보일러, 수도꼭지, 콘센트 라인을 커버링 테이프로 오염 차단 조치하는지 검토' },
    { title: '도막 균일 토출', desc: '엠보싱 입자 질감과 일정 분사 압력(2회 중첩 뿜칠) 마감이 유지되는지 확인' },
    { title: '건조 및 양생 수칙', desc: '현장 온도·습도 조건에 맞춘 초기 자연 환기와 건조 시간을 이행하는지 점검' }
  ];

  // 5. Fetch Task-Specific FAQ Q&As
  const faqs = getFaqV2ListForTask(taskName);

  // 6. Hero Intro & Meta Context
  const heroIntro = serviceObj?.heroDescriptionTemplate 
    ? sanitizeV3Body(serviceObj.heroDescriptionTemplate, regionName)
    : `${regionName} 베란다와 세탁실 벽면 상태를 진단하고 세라믹 탄성코트 전문 마감을 안내합니다.`;

  const metaContextText = serviceObj?.sectionDescriptionTemplate
    ? sanitizeV3Body(serviceObj.sectionDescriptionTemplate, regionName)
    : `${regionName} 지역 탄성코트 시공은 베란다와 다용도실 수축 팽창 벽면의 기존 페인트 박리를 보수하고 세라믹 코팅제를 균일하게 도포하여 쾌적한 마감을 안착시킵니다.`;

  // Calculate total visible char count
  let totalCharCount = regionName.length + taskName.length + heroIntro.length + metaContextText.length;
  h2Sections.forEach(sec => {
    totalCharCount += sec.title.length;
    sec.paragraphs.forEach(p => { totalCharCount += p.length; });
  });
  checklist.forEach(item => { totalCharCount += item.title.length + item.desc.length; });
  faqs.forEach(f => { totalCharCount += f.q.length + f.a.length; });

  return {
    isV3: true,
    engineVersion: 'V3',
    regionName,
    taskName,
    h1Text: `${regionName} ${taskName}`,
    heroIntro,
    metaContextText,
    metaDescription,
    h2Sections,
    evidenceData,
    checklist,
    faqs,
    totalCharCount
  };
}

export function generateV3Description(regionName, taskName) {
  const descMap = {
    '탄성코트': `${regionName} 베란다·세탁실 수성페인트 들뜸 및 곰팡이 상태 진단 가이드입니다. 세라믹 탄성 도막 시공 적합성 판단과 크랙 보수 공정을 확인하세요.`,
    '탄성코트시공': `${regionName} 탄성코트 시공 전 보양 작업, 들뜬 페인트 전면 긁어내기, 크랙 퍼티 메우기 및 뿜칠 양생 단계별 진행 공정을 안내합니다.`,
    '베란다탄성코트': `${regionName} 베란다 외벽 접점의 겨울철 수증기 결로와 창틀 주변 습기를 예방하는 세라믹 도막 흡방습 마감 가이드입니다.`,
    '세탁실탄성코트': `${regionName} 세탁실·다용도실 배수관 및 수도꼭지 주변 고습도 환경에 특화된 방균 세라믹 탄성코트 벽면 관리 기준입니다.`,
    '아파트탄성코트': `${regionName} 신축 아파트 입주 전 베란다 마감 점검과 구축 아파트 노후 페인트 박리 전면 제거 후 재시공 절차 안내입니다.`,
    '탄성코트업체': `${regionName} 탄성코트 전문 업체 비교 시 필수 점검사항인 수크래퍼 밑작업, 크랙 퍼티 보수 포함 여부 및 견적 산정 가이드입니다.`
  };
  return descMap[taskName] || `${regionName} ${taskName} 전문 시공 안내 및 벽면 진단 가이드입니다.`;
}

function sanitizeV3Title(titleTemplate, regionName) {
  return titleTemplate
    .replace(/{region}\s*현장에서/g, `${regionName} 지역`)
    .replace(/{region}\s*베란다는/g, `${regionName} 베란다`)
    .replace(/{region}\s*세탁실은/g, `${regionName} 세탁실`)
    .replace(/{region}/g, regionName);
}

function sanitizeV3Body(bodyTemplate, regionName) {
  return bodyTemplate
    .replace(/{region}\s*현장에서/g, `${regionName} 지역 시공 현장에서`)
    .replace(/{region}\s*베란다는/g, `${regionName} 베란다 공간은`)
    .replace(/{region}\s*세탁실은/g, `${regionName} 세탁실 공간은`)
    .replace(/{region}/g, regionName);
}

