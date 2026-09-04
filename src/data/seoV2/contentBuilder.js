import { OFFICIAL_SEARCH_INTENT_REGISTRY } from './intentRegistry.js';
import { CONTENT_MODULE_REGISTRY } from './contentModules.js';
import { getFaqV2ListForTask } from './faqRegistry.js';

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
