import { OFFICIAL_SEARCH_INTENT_REGISTRY } from './intentRegistry.js';
import { CONTENT_MODULE_REGISTRY } from './contentModules.js';
import { CORE_FAQ_LIST, TASK_SPECIFIC_FAQ_REGISTRY, getFaqV2ListForTask } from './faqRegistry.js';

export function validateSeoV2Registry() {
  const errors = [];
  const warnings = [];
  const officialTasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];

  // A. Check Official 6 Tasks in Intent Registry
  officialTasks.forEach(task => {
    if (!OFFICIAL_SEARCH_INTENT_REGISTRY[task]) {
      errors.push(`Missing intent registry for task: ${task}`);
    }
  });

  // B. Check duplicate intentId
  const intentIds = new Set();
  Object.values(OFFICIAL_SEARCH_INTENT_REGISTRY).forEach(intent => {
    if (intentIds.has(intent.intentId)) {
      errors.push(`Duplicate intentId found: ${intent.intentId}`);
    }
    intentIds.add(intent.intentId);

    // C. Check required fields
    if (!intent.primaryIntent) errors.push(`Missing primaryIntent in ${intent.intentId}`);
    if (!intent.mainTopics || intent.mainTopics.length === 0) errors.push(`Missing mainTopics in ${intent.intentId}`);
    if (!intent.h2Blueprints || intent.h2Blueprints.length < 3) errors.push(`h2Blueprints must be at least 3 in ${intent.intentId}`);
    if (!intent.faqCategory) errors.push(`Missing faqCategory in ${intent.intentId}`);
  });

  // D. Check Content Module duplicates and properties
  const moduleIds = new Set();
  let genericModuleCount = 0;
  const validOwners = ['concept_diagnosis', 'process_execution', 'space_balcony', 'space_laundry', 'building_apartment', 'agency_selection', 'shared'];
  const validTypes = ['CORE_SHARED', 'INTENT_SPECIFIC', 'CONDITIONAL_SHARED'];

  CONTENT_MODULE_REGISTRY.forEach(mod => {
    if (moduleIds.has(mod.id)) {
      errors.push(`Duplicate Content Module ID: ${mod.id}`);
    }
    moduleIds.add(mod.id);

    if (!validOwners.includes(mod.primaryIntentOwner)) {
      errors.push(`Invalid primaryIntentOwner '${mod.primaryIntentOwner}' in module ${mod.id}`);
    }

    if (!validTypes.includes(mod.moduleType)) {
      errors.push(`Invalid moduleType '${mod.moduleType}' in module ${mod.id}`);
    }

    // E. Applicable tasks validity
    mod.applicableTasks.forEach(t => {
      if (t !== '전체' && !officialTasks.includes(t)) {
        errors.push(`Unknown task '${t}' in module ${mod.id}`);
      }
    });

    // F. regionDependency enum check
    const validDeps = ['NONE', 'PARENT_CONTEXT', 'REAL_CASE_ONLY'];
    if (!validDeps.includes(mod.regionDependency)) {
      errors.push(`Invalid regionDependency '${mod.regionDependency}' in module ${mod.id}`);
    }

    // G. Case data consistency
    if (mod.requiresCaseData && mod.regionDependency !== 'REAL_CASE_ONLY') {
      errors.push(`Module ${mod.id} requiresCaseData is true but regionDependency is not REAL_CASE_ONLY`);
    }

    // Generic marketing copy check
    if (mod.heading.includes('바름공간') || mod.bodyTemplate.includes('최선을 다합니다') || mod.bodyTemplate.includes('최고의 서비스')) {
      genericModuleCount++;
    }
  });

  // H. FAQ Coverage check
  officialTasks.forEach(task => {
    const list = getFaqV2ListForTask(task);
    if (list.length !== 5) {
      errors.push(`FAQ count for task ${task} is ${list.length}, expected 5`);
    }
  });

  // Generic content ratio calculation
  const genericRatio = (genericModuleCount / CONTENT_MODULE_REGISTRY.length) * 100;
  if (genericRatio > 15) {
    warnings.push(`Generic module ratio is ${genericRatio.toFixed(1)}% (Target: <= 15%)`);
  }

  // Base '탄성코트' Over-coverage check
  const baseTaskModules = CONTENT_MODULE_REGISTRY.filter(m => m.applicableTasks.includes('탄성코트'));
  const baseTaskRatio = (baseTaskModules.length / CONTENT_MODULE_REGISTRY.length) * 100;
  if (baseTaskRatio > 40) {
    warnings.push(`Base '탄성코트' applies to ${baseTaskRatio.toFixed(1)}% of total modules (Target: <= 40%)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    moduleCount: CONTENT_MODULE_REGISTRY.length,
    intentCount: Object.keys(OFFICIAL_SEARCH_INTENT_REGISTRY).length,
    genericRatio: genericRatio.toFixed(1) + '%',
    baseTaskModuleCount: baseTaskModules.length,
    baseTaskRatio: baseTaskRatio.toFixed(1) + '%'
  };
}

/**
 * Calculates Task Coverage & Intent Isolation Metrics
 */
export function calculateTaskCoverageMetrics() {
  const officialTasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
  const metrics = {};

  officialTasks.forEach(task => {
    const applicable = CONTENT_MODULE_REGISTRY.filter(m => m.applicableTasks.includes(task));
    const coreShared = applicable.filter(m => m.moduleType === 'CORE_SHARED');
    const intentSpecific = applicable.filter(m => m.moduleType === 'INTENT_SPECIFIC');
    const conditionalShared = applicable.filter(m => m.moduleType === 'CONDITIONAL_SHARED');

    metrics[task] = {
      totalModules: applicable.length,
      coreSharedCount: coreShared.length,
      intentSpecificCount: intentSpecific.length,
      conditionalSharedCount: conditionalShared.length,
      specificRatio: applicable.length > 0 ? ((intentSpecific.length / applicable.length) * 100).toFixed(1) + '%' : '0%'
    };
  });

  return metrics;
}

/**
 * Calculates Intent Pair Overlap Matrix
 */
export function calculateIntentPairOverlap() {
  const officialTasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
  const pairs = [
    ['탄성코트', '탄성코트시공'],
    ['탄성코트', '베란다탄성코트'],
    ['탄성코트', '세탁실탄성코트'],
    ['탄성코트', '아파트탄성코트'],
    ['탄성코트', '탄성코트업체'],
    ['베란다탄성코트', '세탁실탄성코트']
  ];

  const results = [];
  pairs.forEach(([t1, t2]) => {
    const mods1 = CONTENT_MODULE_REGISTRY.filter(m => m.applicableTasks.includes(t1));
    const mods2 = CONTENT_MODULE_REGISTRY.filter(m => m.applicableTasks.includes(t2));
    const shared = mods1.filter(m => m.applicableTasks.includes(t2));
    const unionCount = new Set([...mods1.map(m => m.id), ...mods2.map(m => m.id)]).size;
    const jaccardOverlap = ((shared.length / unionCount) * 100).toFixed(1) + '%';

    results.push({
      pair: `${t1} vs ${t2}`,
      task1Count: mods1.length,
      task2Count: mods2.length,
      sharedCount: shared.length,
      overlapRatio: jaccardOverlap
    });
  });

  return results;
}

/**
 * Builds Content Module Coverage Matrix (6 Tasks x Modules)
 */
export function buildCoverageMatrix() {
  const officialTasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
  const matrix = [];

  CONTENT_MODULE_REGISTRY.forEach(mod => {
    const row = {
      id: mod.id,
      primaryOwner: mod.primaryIntentOwner,
      moduleType: mod.moduleType,
      heading: mod.heading,
      category: mod.category,
      tasks: {}
    };
    officialTasks.forEach(task => {
      row.tasks[task] = mod.applicableTasks.includes(task) ? 'YES' : 'NO';
    });
    matrix.push(row);
  });

  return matrix;
}
