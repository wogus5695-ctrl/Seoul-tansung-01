import { buildV2Content } from '../src/data/seoV2/contentBuilder.js';
import { PILOT_V2_REGIONS } from '../src/data/seoV2/featureFlag.js';

console.log('=== STEP 3-B READ-ONLY SSR CONTENT FORENSIC AUDIT ===\n');

const tasks = ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '아파트탄성코트', '탄성코트업체'];
const regions = Array.from(PILOT_V2_REGIONS);

// Helper: Extract Main Information Content Text (excluding Header/Footer/Nav/CTA)
function getMainContentText(region, task) {
  const v2 = buildV2Content(region, task);
  let text = v2.heroIntro + ' ' + v2.metaContextText + ' ';
  v2.h2Sections.forEach(sec => {
    text += sec.title + ' ' + sec.paragraphs.join(' ') + ' ';
  });
  v2.faqs.forEach(f => {
    text += f.q + ' ' + f.a + ' ';
  });
  return text.trim();
}

// Helper: Tokenize into words
function getTokens(str) {
  return str.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').split(/\s+/).filter(Boolean);
}

// Helper: Tokenize into sentences
function getSentences(str) {
  return str.split(/[.!?]\s+/).map(s => s.trim()).filter(Boolean);
}

// Jaccard Similarity
function calcJaccard(str1, str2) {
  const set1 = new Set(getTokens(str1));
  const set2 = new Set(getTokens(str2));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Cosine Similarity (Word frequency based)
function calcCosine(str1, str2) {
  const tokens1 = getTokens(str1);
  const tokens2 = getTokens(str2);
  const freq1 = {}, freq2 = {};
  tokens1.forEach(t => freq1[t] = (freq1[t] || 0) + 1);
  tokens2.forEach(t => freq2[t] = (freq2[t] || 0) + 1);

  const allTokens = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  let dotProduct = 0, mag1 = 0, mag2 = 0;

  allTokens.forEach(t => {
    const v1 = freq1[t] || 0;
    const v2 = freq2[t] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

// 1. SAME REGION / CROSS TASK SIMILARITY MATRIX (삼성동)
console.log('--- 1. SAME REGION / CROSS TASK TEXT SIMILARITY MATRIX (삼성동) ---');
const sampleRegion = '삼성동';
const taskTexts = {};
tasks.forEach(t => {
  taskTexts[t] = getMainContentText(sampleRegion, t);
});

const matrixJaccard = {};
const matrixCosine = {};

tasks.forEach(t1 => {
  matrixJaccard[t1] = {};
  matrixCosine[t1] = {};
  tasks.forEach(t2 => {
    matrixJaccard[t1][t2] = (calcJaccard(taskTexts[t1], taskTexts[t2]) * 100).toFixed(1) + '%';
    matrixCosine[t1][t2] = (calcCosine(taskTexts[t1], taskTexts[t2]) * 100).toFixed(1) + '%';
  });
});

console.log('\n[Jaccard Similarity Matrix]');
console.table(matrixJaccard);

console.log('\n[Cosine Similarity Matrix]');
console.table(matrixCosine);


// 2. CROSS REGION / SAME TASK NORMALIZED SIMILARITY ('탄성코트' across 10 regions)
console.log('\n--- 2. CROSS REGION / SAME TASK SIMILARITY (10 Regions - 탄성코트) ---');
const targetTask = '탄성코트';
const rawTexts = {};
const normalizedTexts = {};

regions.forEach(r => {
  const raw = getMainContentText(r, targetTask);
  rawTexts[r] = raw;
  normalizedTexts[r] = raw.replace(new RegExp(r, 'g'), '{REGION}').replace(/탄성코트/g, '{TASK}');
});

let sumRawJaccard = 0, sumNormJaccard = 0, countPairs = 0;
let minNorm = 1, maxNorm = 0;

for (let i = 0; i < regions.length; i++) {
  for (let j = i + 1; j < regions.length; j++) {
    const r1 = regions[i];
    const r2 = regions[j];
    const rawJac = calcJaccard(rawTexts[r1], rawTexts[r2]);
    const normJac = calcJaccard(normalizedTexts[r1], normalizedTexts[r2]);

    sumRawJaccard += rawJac;
    sumNormJaccard += normJac;
    countPairs++;

    if (normJac < minNorm) minNorm = normJac;
    if (normJac > maxNorm) maxNorm = normJac;
  }
}

console.log(`Region Count: ${regions.length}`);
console.log(`Pairwise Comparisons: ${countPairs}`);
console.log(`Raw Jaccard Average: ${(sumRawJaccard / countPairs * 100).toFixed(1)}%`);
console.log(`Normalized Jaccard Average (with {REGION} Token): ${(sumNormJaccard / countPairs * 100).toFixed(1)}%`);
console.log(`Normalized Jaccard Min: ${(minNorm * 100).toFixed(1)}%`);
console.log(`Normalized Jaccard Max: ${(maxNorm * 100).toFixed(1)}%`);

// Sentence Overlap Analysis
console.log('\n--- 3. EXACT SENTENCE DUPLICATION & PSEUDO LOCALIZATION AUDIT ---');
const sampleSentences = getSentences(normalizedTexts['삼성동']);
console.log(`Total Sentences in '삼성동 탄성코트': ${sampleSentences.length}`);

let totalSameSentencesAcrossTasks = 0;
const sentenceFreq = {};
tasks.forEach(t => {
  const sents = getSentences(getMainContentText('삼성동', t));
  sents.forEach(s => {
    sentenceFreq[s] = (sentenceFreq[s] || 0) + 1;
  });
});

console.log('\nShared Sentences across 3+ Intents:');
Object.entries(sentenceFreq).filter(([s, count]) => count >= 3).forEach(([s, count]) => {
  console.log(`  - [Used in ${count} Intents] ${s.substring(0, 50)}...`);
});
