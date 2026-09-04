import { thumbnailTestMap } from '../src/data/thumbnailTestMap.js';

const testCases = [
  // Test Group
  { k: '개봉동-탄성코트', expected: 'bareumgonggan-search-thumbnail-test-a.jpg' },
  { k: '삼성동-탄성코트', expected: 'bareumgonggan-search-thumbnail-test-b.jpg' },
  { k: '개봉동-세탁실탄성코트', expected: 'bareumgonggan-search-thumbnail-test-c.jpg' },
  
  // Control Group
  { k: '천호동-탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  { k: '천호동-세탁실탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  
  // Other Pages
  { k: '대치동-탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  { k: '강남구-탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  { k: '개봉동-탄성코트시공', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  { k: '개봉동-베란다탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' },
  { k: '삼성동-세탁실탄성코트', expected: 'bareumgonggan-search-thumbnail-v2.jpg' }
];

console.log('=== LOCAL A/B TEST MAPPING VERIFICATION ===\n');

let allPassed = true;
for (const tc of testCases) {
  const customThumb = thumbnailTestMap[tc.k];
  const resolvedThumb = customThumb 
    ? `https://www.barumspace.co.kr${customThumb}`
    : 'https://www.barumspace.co.kr/images/seo/bareumgonggan-search-thumbnail-v2.jpg';
    
  const success = resolvedThumb.includes(tc.expected);
  if (success) {
    console.log(`[PASS] ${tc.k} -> ${resolvedThumb}`);
  } else {
    console.error(`[FAIL] ${tc.k} -> Expected: ${tc.expected}, Got: ${resolvedThumb}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\nAll local mapping checks PASSED successfully!');
} else {
  console.error('\nSome mapping checks FAILED!');
}
