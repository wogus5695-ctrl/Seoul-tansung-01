import { serviceKeywords } from '../src/data/serviceKeywords.js';

const prohibitedWords = [
  '친환경',
  '항균',
  '100%',
  '완전 차단',
  '결로 완전',
  '곰팡이 완전',
  '완전 방지',
  '영구적',
  '하자 없음',
  '수명 보장'
];

let errors = 0;

serviceKeywords.forEach(service => {
  const name = service.keyword;
  const templates = [
    { key: 'metaDescriptionTemplate', text: service.metaDescriptionTemplate },
    { key: 'heroDescriptionTemplate', text: service.heroDescriptionTemplate },
    { key: 'sectionDescriptionTemplate', text: service.sectionDescriptionTemplate }
  ];

  templates.forEach(t => {
    if (!t.text) return;
    prohibitedWords.forEach(word => {
      if (t.text.includes(word)) {
        console.error(`  ERROR: Prohibited word [${word}] found in [${name}] -> ${t.key}:\n    "${t.text}"`);
        errors++;
      }
    });
  });
});

console.log(`\n=============================================`);
console.log(`Total Prohibited Word Errors: ${errors}`);
console.log(`=============================================`);

if (errors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
