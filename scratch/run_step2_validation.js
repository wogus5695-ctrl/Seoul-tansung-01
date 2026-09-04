import { validateSeoV2Registry, calculateTaskCoverageMetrics, calculateIntentPairOverlap, buildCoverageMatrix } from '../src/data/seoV2/dataValidation.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

console.log('=== STEP 2-B CONTENT MODULE COVERAGE VALIDATION ===\n');

// 1. Data Registry Integrity Check
const valResult = validateSeoV2Registry();
console.log('Validation Status:', valResult.isValid ? 'PASS ✅' : 'FAIL ❌');
console.log('Total Module Count:', valResult.moduleCount);
console.log('Intent Count:', valResult.intentCount);
console.log('Generic Module Ratio:', valResult.genericRatio);
console.log('Base 탄성코트 Module Count:', valResult.baseTaskModuleCount, `(${valResult.baseTaskRatio} of total)`);

if (valResult.errors.length > 0) {
  console.error('\nErrors Found:');
  valResult.errors.forEach(err => console.error('  - ' + err));
}

if (valResult.warnings.length > 0) {
  console.warn('\nWarnings:');
  valResult.warnings.forEach(w => console.warn('  - ' + w));
}

// 2. Task Coverage Breakdown
console.log('\n=== TASK COVERAGE BREAKDOWN ===');
const taskMetrics = calculateTaskCoverageMetrics();
console.table(taskMetrics);

// 3. Intent Pair Overlap Analysis
console.log('\n=== INTENT PAIR OVERLAP ANALYSIS ===');
const pairOverlap = calculateIntentPairOverlap();
console.table(pairOverlap);

// 4. Content Module Coverage Matrix Output
console.log('\n=== CONTENT MODULE COVERAGE MATRIX ===');
const matrix = buildCoverageMatrix();
// console.table(matrix.map(...));

// 5. Existing V1 serviceKeywords Regression Check
console.log('\n=== V1 REGRESSION CHECK ===');
console.log('V1 serviceKeywords Count:', serviceKeywords.length);
console.log('Elastic Group Count:', serviceKeywords.filter(s => s.serviceGroup === 'elastic').length);
console.log('Grout Group Count:', serviceKeywords.filter(s => s.serviceGroup === 'grout').length);
