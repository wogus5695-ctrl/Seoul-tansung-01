import { serviceKeywords, FAQ_CATALOG } from '../src/data/serviceKeywords.js';

let errorsCount = 0;

// Definitions of exclusive keywords for validation
const groutExclusiveKeywords = ['백시멘트', '줄눈', '타일', '홈파기', '줄눈제'];
const elasticExclusiveKeywords = ['탄성코트', '도막', '도포', '보양', '페인트', '벽체', '벽면', '양생'];

serviceKeywords.forEach(service => {
  const name = service.keyword;
  const family = service.serviceFamily;
  const faqSet = service.faqSet;

  console.log(`\nChecking service: [${name}] (Family: ${family})`);
  
  // 1. Length check
  if (faqSet.length !== 5) {
    console.error(`  ERROR: FAQ count is ${faqSet.length} instead of 5.`);
    errorsCount++;
  } else {
    console.log(`  PASS: FAQ count is 5.`);
  }

  // 2. Cross-contamination and catalog mapping check
  faqSet.forEach((q, idx) => {
    const a = FAQ_CATALOG[q];
    if (!a) {
      console.error(`  ERROR [Q${idx + 1}]: Question "${q}" has no mapped answer in FAQ_CATALOG!`);
      errorsCount++;
      return;
    }

    // Checking grout rules inside elasticCoating
    if (family === 'elasticCoating') {
      const contaminated = groutExclusiveKeywords.filter(w => q.includes(w) || a.includes(w));
      if (contaminated.length > 0) {
        console.error(`  ERROR [Q${idx + 1}]: Contaminated with grout keywords:`, contaminated, `\n    Q: ${q}\n    A: ${a}`);
        errorsCount++;
      }
    }

    // Checking elastic rules inside grout
    if (family === 'grout') {
      // Allow '양생' in grout since grout also cures, but check others
      const filteredElasticKeywords = elasticExclusiveKeywords.filter(w => w !== '양생');
      const contaminated = filteredElasticKeywords.filter(w => q.includes(w) || a.includes(w));
      if (contaminated.length > 0) {
        console.error(`  ERROR [Q${idx + 1}]: Contaminated with elastic keywords:`, contaminated, `\n    Q: ${q}\n    A: ${a}`);
        errorsCount++;
      }
    }
  });
});

console.log(`\n=============================================`);
console.log(`Total Errors Detected: ${errorsCount}`);
console.log(`=============================================`);
if (errorsCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
