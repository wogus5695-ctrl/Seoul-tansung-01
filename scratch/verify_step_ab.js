import { thumbnailTestMap, testBKeywords } from '../src/data/thumbnailTestMap.js';

const controlGroup = [
  '천호동-탄성코트',
  '천호동-세탁실탄성코트',
  '대치동-탄성코트'
];

const testAGroup = [
  { k: '개봉동-탄성코트', img: 'bareumgonggan-field-01.jpg' },
  { k: '삼성동-탄성코트', img: 'bareumgonggan-field-02.jpg' },
  { k: '개봉동-세탁실탄성코트', img: 'bareumgonggan-field-03.jpg' }
];

const testBGroup = [
  { k: '남현동-탄성코트시공', img: 'bareumgonggan-field-04.jpg' },
  { k: '공릉동-탄성코트업체', img: 'bareumgonggan-field-05.jpg' },
  { k: '이문동-탄성코트업체', img: 'bareumgonggan-field-06.jpg' }
];

console.log('=== A/B TEST 9-URL MAPPING AUDIT ===\n');

console.log('--- CONTROL GROUP (3 URLs) ---');
for (const k of controlGroup) {
  const customThumb = thumbnailTestMap[k];
  const isTestB = testBKeywords.has(k);
  console.log(`URL: ?k=${k}`);
  console.log(`  og:image: ${customThumb || 'bareumgonggan-search-thumbnail-v2.jpg'}`);
  console.log(`  body img count: ${isTestB ? 1 : 0}`);
  console.log(`  Status: ${!customThumb && !isTestB ? 'PASS (v2.jpg maintained, body img 0)' : 'FAIL'}`);
  console.log('');
}

console.log('--- TEST-A GROUP (3 URLs) ---');
for (const item of testAGroup) {
  const customThumb = thumbnailTestMap[item.k];
  const isTestB = testBKeywords.has(item.k);
  const pass = customThumb && customThumb.includes(item.img) && !isTestB;
  console.log(`URL: ?k=${item.k}`);
  console.log(`  og:image: ${customThumb}`);
  console.log(`  body img count: ${isTestB ? 1 : 0}`);
  console.log(`  Status: ${pass ? 'PASS (Raw field photo mapped, body img 0)' : 'FAIL'}`);
  console.log('');
}

console.log('--- TEST-B GROUP (3 URLs) ---');
for (const item of testBGroup) {
  const customThumb = thumbnailTestMap[item.k];
  const isTestB = testBKeywords.has(item.k);
  const pass = customThumb && customThumb.includes(item.img) && isTestB;
  console.log(`URL: ?k=${item.k}`);
  console.log(`  og:image: ${customThumb}`);
  console.log(`  body img count: ${isTestB ? 1 : 0}`);
  console.log(`  Hero Mode: Semantic <img> DOM Enabled`);
  console.log(`  Status: ${pass ? 'PASS (Raw field photo mapped, body img 1)' : 'FAIL'}`);
  console.log('');
}
