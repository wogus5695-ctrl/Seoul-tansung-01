import { parseAndValidateK } from '../src/data/regionResolver.js';
import { buildV2InternalLinks } from '../src/data/seoV2/linkEngine.js';
import { getSeoEngineVersion } from '../src/data/seoV2/featureFlag.js';

console.log('=== STEP 4 SSR INTERNAL LINK ENGINE V2 VERIFICATION ===\n');

const fixtures = [
  { k: '삼성동-탄성코트', name: 'Fixture 1: 서울 강남구 삼성동 (Pilot)' },
  { k: '황계동-탄성코트', name: 'Fixture 2: 경기 화성시 황계동 (Pilot)' },
  { k: '방교동-베란다탄성코트', name: 'Fixture 3: 경기 화성시 방교동 (Pilot)' }
];

fixtures.forEach(fix => {
  console.log(`--- ${fix.name} (${fix.k}) ---`);
  const parseResult = parseAndValidateK(fix.k, true);
  if (!parseResult.isValid) {
    console.error(`Invalid kParam: ${fix.k}`);
    return;
  }

  const v2Links = buildV2InternalLinks(parseResult.region, parseResult.service);
  console.log('Link Engine Activated:', v2Links.isV2LinkEngine ? 'YES ✅' : 'NO ❌');
  console.log('Total New Internal Links:', v2Links.totalLinkCount);

  console.log('\n[TIER A: Same Region Tasks]');
  v2Links.sameRegionTasks.forEach(l => {
    console.log(`  - <a href="${l.href}">${l.label}</a>`);
  });

  console.log(`\n[TIER B: ${v2Links.sameDistrictTitle}]`);
  v2Links.sameDistrictRegions.forEach(l => {
    console.log(`  - <a href="${l.href}">${l.label}</a>`);
  });

  console.log('\n[TIER C: Existing Hub Link]');
  console.log(`  - <a href="${v2Links.hubLink.href}">${v2Links.hubLink.label}</a>`);

  // Integrity Audits
  let hasSelfLink = false;
  let hasDuplicate = false;
  let hasBroken = false;

  const currentHref = `/?k=${fix.k}`;
  const seenHrefs = new Set();

  const allLinks = [
    ...v2Links.sameRegionTasks,
    ...v2Links.sameDistrictRegions,
    v2Links.hubLink
  ];

  allLinks.forEach(l => {
    if (l.href === currentHref) hasSelfLink = true;
    if (seenHrefs.has(l.href)) hasDuplicate = true;
    seenHrefs.add(l.href);

    // Validate link target if it's dynamic k link
    if (l.href.includes('/?k=')) {
      const targetK = l.href.split('k=')[1];
      const targetParse = parseAndValidateK(targetK, true);
      if (!targetParse.isValid) hasBroken = true;
    }
  });

  console.log('\nIntegrity Check Results:');
  console.log(`  Self-Link Count: ${hasSelfLink ? 'FAIL ❌ (Self-link detected)' : '0 ✅'}`);
  console.log(`  Duplicate Destination Count: ${hasDuplicate ? 'FAIL ❌ (Duplicates detected)' : '0 ✅'}`);
  console.log(`  Broken Dynamic Link Count: ${hasBroken ? 'FAIL ❌ (Broken links detected)' : '0 ✅'}`);
  console.log('\n' + '='.repeat(60) + '\n');
});

// V1 & Grout Non-Link Engine Check
console.log('--- V1 REGRESSION & GROUT CHECK ---');
const groutParse = parseAndValidateK('삼성동-줄눈시공', true);
const groutVer = getSeoEngineVersion(groutParse.region.name, groutParse.service.keyword);
console.log(`Grout '삼성동-줄눈시공' Engine Version: ${groutVer} (Expected: V1)`);

if (groutVer === 'V1') {
  console.log('V1 & Grout Regression Check: PASS ✅ (No V2 link engine injected)');
} else {
  console.error('V1 & Grout Regression Check: FAIL ❌');
}
