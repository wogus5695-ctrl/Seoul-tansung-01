// Automated test & regression audit script for STEP RSS-2.
// Uses Node.js native assert to avoid third-party test dependencies.

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { PILOT_EDITORIAL_ARTICLES } from '../src/data/editorial/editorialRegistry.js';
import {
  isArticlePublished,
  isArticleRssEligible,
  isArticleSitemapEligible,
  getAllArticles,
  getPublishedArticles,
  getRssEligibleArticles,
  getSitemapEligibleArticles,
  getArticleBySlug,
  getArticleByEditorialId
} from '../src/data/editorial/publicationGate.js';

import { getActiveRegions, findRegionByUrlToken, getAllowedServicesForRegion } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { isDynamicIndexable } from '../src/data/indexPolicy.js';
import guideHandler from '../api/guide.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = 'https://www.barumspace.co.kr';

function testGuideRequest(pathname) {
  return new Promise((resolve) => {
    let statusCode = 200;
    let headers = {};
    const req = {
      url: `http://localhost${pathname}`,
      headers: { host: 'www.barumspace.co.kr' }
    };
    const res = {
      status(c) { statusCode = c; return this; },
      setHeader(k, v) { headers[k] = v; },
      send(html) { resolve({ statusCode, headers, html }); },
      end() { resolve({ statusCode, headers, html: '' }); }
    };
    guideHandler(req, res);
  });
}

async function runAudit() {
  console.log('====================================================');
  console.log('[STEP RSS-2] EDITORIAL, GUIDE SSR & BASELINE AUDIT');
  console.log('====================================================\n');

  // 1. Editorial Registry Count
  const allArticles = getAllArticles();
  console.log(`1. Total Editorial Articles: ${allArticles.length} (Expected: 12)`);
  assert.strictEqual(allArticles.length, 12, 'Editorial entries must be exactly 12');

  // 2. Uniqueness Checks
  const editorialIds = new Set();
  const slugs = new Set();
  let duplicateEditorialIds = 0;
  let duplicateSlugs = 0;
  let missingQueryTargetId = 0;
  let missingTopicId = 0;

  allArticles.forEach(art => {
    if (editorialIds.has(art.editorialId)) duplicateEditorialIds++;
    editorialIds.add(art.editorialId);

    if (slugs.has(art.slug)) duplicateSlugs++;
    slugs.add(art.slug);

    if (!art.queryTargetId) missingQueryTargetId++;
    if (!art.topicId) missingTopicId++;
  });

  console.log(`2. Duplicate editorialId: ${duplicateEditorialIds} (Expected: 0)`);
  console.log(`   Duplicate slug: ${duplicateSlugs} (Expected: 0)`);
  console.log(`   Missing queryTargetId: ${missingQueryTargetId} (Expected: 0)`);
  console.log(`   Missing topicId: ${missingTopicId} (Expected: 0)`);
  assert.strictEqual(duplicateEditorialIds, 0, 'No duplicate editorialId allowed');
  assert.strictEqual(duplicateSlugs, 0, 'No duplicate slug allowed');
  assert.strictEqual(missingQueryTargetId, 0, 'No missing queryTargetId allowed');
  assert.strictEqual(missingTopicId, 0, 'No missing topicId allowed');

  // 3. Region and Service Target Verification
  let invalidRegions = 0;
  let invalidServices = 0;
  let nonIndexableRelatedLandings = 0;
  let totalRelatedLandings = 0;

  allArticles.forEach(art => {
    const reg = findRegionByUrlToken(art.urlRegion);
    if (!reg) {
      console.error(`Invalid region target: ${art.urlRegion} in article ${art.editorialId}`);
      invalidRegions++;
    }

    const svc = serviceKeywords.find(s => s.keyword === art.serviceKeyword);
    if (!svc) {
      console.error(`Invalid service keyword: ${art.serviceKeyword} in article ${art.editorialId}`);
      invalidServices++;
    }

    assert.ok(Array.isArray(art.relatedLandingTargets) && art.relatedLandingTargets.length > 0, `Article ${art.editorialId} must have related landing targets`);
    art.relatedLandingTargets.forEach(tgt => {
      totalRelatedLandings++;
      const targetReg = findRegionByUrlToken(tgt.urlRegion);
      const targetSvc = serviceKeywords.find(s => s.keyword === tgt.serviceKeyword);

      if (!targetReg || !targetSvc || !isDynamicIndexable(targetReg, targetSvc)) {
        console.error(`Non-indexable or invalid related landing: ${tgt.urlRegion} ${tgt.serviceKeyword}`);
        nonIndexableRelatedLandings++;
      }
    });
  });

  console.log(`3. Invalid Region Targets: ${invalidRegions} (Expected: 0)`);
  console.log(`   Invalid Service Targets: ${invalidServices} (Expected: 0)`);
  console.log(`   Total Related Landing Targets: ${totalRelatedLandings} (Expected: 12)`);
  console.log(`   Non-indexable Related Landings: ${nonIndexableRelatedLandings} (Expected: 0)`);
  assert.strictEqual(invalidRegions, 0);
  assert.strictEqual(invalidServices, 0);
  assert.strictEqual(totalRelatedLandings, 12);
  assert.strictEqual(nonIndexableRelatedLandings, 0);

  // 4. Publication Gate Safety Verification (RSS-2: 1 Approved Published, 11 Drafts)
  const publishedArticles = getPublishedArticles();
  const rssArticles = getRssEligibleArticles();
  const sitemapArticles = getSitemapEligibleArticles();

  console.log(`4. Publication Gate Status:`);
  console.log(`   Published Count: ${publishedArticles.length} (Expected: 1)`);
  console.log(`   RSS Eligible Count: ${rssArticles.length} (Expected: 1)`);
  console.log(`   Sitemap Eligible Count: ${sitemapArticles.length} (Expected: 1)`);
  assert.strictEqual(publishedArticles.length, 1, 'RSS-2 published count must be exactly 1');
  assert.strictEqual(rssArticles.length, 1, 'RSS-2 rss eligible count must be exactly 1');
  assert.strictEqual(sitemapArticles.length, 1, 'RSS-2 sitemap eligible count must be exactly 1');

  const published = publishedArticles[0];
  assert.strictEqual(published.editorialId, 'nowon_elastic__paint-vs-elastic-selection');
  assert.strictEqual(published.slug, 'nowon-elastic-coating-vs-paint-choice');
  assert.strictEqual(published.contentStatus, 'approved');
  assert.strictEqual(published.isPublished, true);
  assert.strictEqual(published.rssEnabled, true);
  assert.strictEqual(published.sitemapEnabled, true);

  // 5. RSS.xml Verification
  const rssPath = path.join(__dirname, '../public/rss.xml');
  assert.ok(fs.existsSync(rssPath), 'public/rss.xml must exist');
  const rssContent = fs.readFileSync(rssPath, 'utf-8');

  assert.ok(rssContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Valid XML declaration required');
  assert.ok(rssContent.includes('<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">'), 'Valid RSS 2.0 tag required');
  assert.ok(rssContent.includes('<title>바름공간 탄성코트 시공 가이드</title>'), 'Valid channel title');
  assert.ok(rssContent.includes('<link>https://www.barumspace.co.kr/</link>'), 'Valid channel link');
  assert.ok(rssContent.includes('<language>ko-KR</language>'), 'Valid channel language');

  const itemCountMatches = rssContent.match(/<item>/g) || [];
  console.log(`5. RSS.xml Check:`);
  console.log(`   Item Count: ${itemCountMatches.length} (Expected: 1)`);
  assert.strictEqual(itemCountMatches.length, 1, 'RSS Item count must be exactly 1 in RSS-2');

  const expectedArticleUrl = `${SITE_URL}/guide/nowon-elastic-coating-vs-paint-choice`;
  assert.ok(rssContent.includes(`<link>${expectedArticleUrl}</link>`), 'RSS must contain expected article link');
  assert.ok(rssContent.includes(`<guid isPermaLink="true">${expectedArticleUrl}</guid>`), 'RSS must contain expected article GUID');
  assert.ok(rssContent.includes('<content:encoded><![CDATA['), 'RSS content:encoded must use CDATA');
  assert.ok(rssContent.includes('노원구 탄성코트, 일반 페인트 도색과 선택이 달라지는 기준'), 'RSS content:encoded must contain article H1');

  // Forbidden host assertions
  const forbiddenKeywords = ['localhost', '127.0.0.1', 'http://www.barumspace', 'http://barumspace', 'vercel.app'];
  forbiddenKeywords.forEach(kw => {
    assert.ok(!rssContent.includes(kw), `RSS.xml must not contain '${kw}'`);
  });
  console.log('   RSS.xml Quality & Domain Check: ALL PASS');

  // 6. Sitemap.xml Verification (RSS-2: 5,848 = 5,844 dynamic + 3 static + 1 editorial)
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const sitemapLocs = (sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));
  const staticSitemap = sitemapLocs.filter(u => u === `${SITE_URL}/` || u === `${SITE_URL}/sitemap-seoul` || u === `${SITE_URL}/privacy-policy`);
  const dynamicSitemap = sitemapLocs.filter(u => u.includes('?k='));
  const editorialSitemap = sitemapLocs.filter(u => u.includes('/guide/'));

  console.log(`6. Sitemap.xml Check:`);
  console.log(`   Total URLs: ${sitemapLocs.length} (Expected: 5848)`);
  console.log(`   Dynamic URLs: ${dynamicSitemap.length} (Expected: 5844)`);
  console.log(`   Static URLs: ${staticSitemap.length} (Expected: 3)`);
  console.log(`   Editorial Article URLs: ${editorialSitemap.length} (Expected: 1)`);
  assert.strictEqual(sitemapLocs.length, 5848);
  assert.strictEqual(dynamicSitemap.length, 5844);
  assert.strictEqual(staticSitemap.length, 3);
  assert.strictEqual(editorialSitemap.length, 1);
  assert.strictEqual(editorialSitemap[0], expectedArticleUrl);
  assert.ok(!sitemapContent.includes(`${SITE_URL}/guide<`), 'Guide Hub must NOT be in sitemap');
  assert.ok(!sitemapContent.includes('rss.xml'), 'rss.xml must NOT be in sitemap');

  // 7. Exact URL Match Audit
  console.log(`7. Exact URL Match Audit:`);
  console.log(`   Canonical: ${expectedArticleUrl}`);
  console.log(`   Sitemap loc: ${editorialSitemap[0]}`);
  console.log(`   RSS Item Link: ${expectedArticleUrl}`);
  assert.strictEqual(editorialSitemap[0], expectedArticleUrl);

  // 8. Guide SSR Runtime & Draft Protection Test
  console.log(`8. Guide SSR Runtime Tests:`);
  
  // 8-A: Guide Hub (/guide)
  const hubRes = await testGuideRequest('/guide');
  console.log(`   /guide -> Status: ${hubRes.statusCode}`);
  assert.strictEqual(hubRes.statusCode, 200);
  assert.ok(hubRes.html.includes('<meta name="robots" content="noindex, follow" />'), 'Hub must have noindex, follow');
  assert.ok(hubRes.html.includes(`<link rel="canonical" href="${SITE_URL}/guide" />`), 'Hub must have self-canonical');
  assert.ok(hubRes.html.includes('/guide/nowon-elastic-coating-vs-paint-choice'), 'Hub must contain first published article link');

  // Ensure NONE of the 11 drafts appear in Guide Hub
  const draftArticles = allArticles.filter(a => !isArticlePublished(a));
  draftArticles.forEach(d => {
    assert.ok(!hubRes.html.includes(`/guide/${d.slug}`), `Hub must NOT contain draft slug: ${d.slug}`);
  });
  console.log(`   Guide Hub Draft Leak Check: 0 leaks (11 drafts hidden)`);

  // 8-B: Published Article (/guide/nowon-elastic-coating-vs-paint-choice)
  const artRes = await testGuideRequest('/guide/nowon-elastic-coating-vs-paint-choice');
  console.log(`   /guide/nowon-elastic-coating-vs-paint-choice -> Status: ${artRes.statusCode}`);
  assert.strictEqual(artRes.statusCode, 200);
  assert.ok(artRes.html.includes('<meta name="robots" content="index, follow" />'), 'Article must be index, follow');
  assert.ok(artRes.html.includes(`<link rel="canonical" href="${expectedArticleUrl}" />`), 'Article must have self-canonical');
  assert.ok(artRes.html.includes('<h1 style="font-size: 1.85rem; color: #183f35; margin-bottom: 12px; line-height: 1.4;">노원구 탄성코트, 일반 페인트 도색과 선택이 달라지는 기준</h1>'), 'Article must contain H1');
  assert.ok(artRes.html.includes('일반 페인트와 탄성코트는 무엇을 기준으로 비교해야 할까?'), 'Article must contain H2 section 1');
  assert.ok(artRes.html.includes('시공 문의 전 사전 점검 체크리스트'), 'Article must contain checklist');
  assert.ok(artRes.html.includes('자주 묻는 질문(FAQ)'), 'Article must contain FAQs');
  assert.ok(artRes.html.includes('/?k=%EB%85%B8%EC%9B%90%EA%B5%AC-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8'), 'Article must contain related dynamic landing link');
  assert.ok(artRes.html.includes('id="jsonld-schema"'), 'Article must contain JSON-LD');
  assert.ok(artRes.html.includes('"@type":"Article"'), 'JSON-LD must include Article schema');
  assert.ok(artRes.html.includes('"@type":"BreadcrumbList"'), 'JSON-LD must include BreadcrumbList');
  assert.ok(artRes.html.includes('"@type":"FAQPage"'), 'JSON-LD must include FAQPage');

  // 8-C: Draft Protection (Requesting a draft slug directly must return 404)
  const draftSample = draftArticles[0];
  const draftRes = await testGuideRequest(`/guide/${draftSample.slug}`);
  console.log(`   /guide/${draftSample.slug} (Draft) -> Status: ${draftRes.statusCode}`);
  assert.strictEqual(draftRes.statusCode, 404, 'Draft slug direct request must return 404');
  assert.ok(draftRes.html.includes('<meta name="robots" content="noindex, follow" />'), '404 must have noindex, follow');
  assert.ok(!draftRes.html.includes(draftSample.title), '404 must NOT leak draft title');

  // 9. Baseline Verification
  const activeRegions = getActiveRegions();
  let totalDyn = 0;
  let indexDyn = 0;
  let noindexDyn = 0;
  let seoulHubLinks = 0;
  let seoulHubGrout = 0;
  let chungHubLinks = 0;

  activeRegions.forEach(reg => {
    const services = getAllowedServicesForRegion(reg);
    services.forEach(s => {
      totalDyn++;
      if (isDynamicIndexable(reg, s)) {
        indexDyn++;
      } else {
        noindexDyn++;
      }
    });

    if (['서울', '인천', '경기'].includes(reg.metro)) {
      services.forEach(s => {
        if (isDynamicIndexable(reg, s)) {
          seoulHubLinks++;
          if (s.serviceFamily === 'grout') {
            seoulHubGrout++;
          }
        }
      });
    }

    if (['대전', '세종', '충북', '충남'].includes(reg.metro)) {
      services.forEach(s => {
        chungHubLinks++;
      });
    }
  });

  console.log(`9. Baseline Verification:`);
  console.log(`   Active Regions: ${activeRegions.length} (Expected: 1074)`);
  console.log(`   Total Dynamic URLs: ${totalDyn} (Expected: 11268)`);
  console.log(`   INDEX Dynamic URLs: ${indexDyn} (Expected: 5844)`);
  console.log(`   NOINDEX Dynamic URLs: ${noindexDyn} (Expected: 5424)`);
  console.log(`   Seoul Hub Dynamic Links: ${seoulHubLinks} (Expected: 5844)`);
  console.log(`   Seoul Hub Grout Links: ${seoulHubGrout} (Expected: 0)`);
  console.log(`   Chungcheong Hub Dynamic Links: ${chungHubLinks} (Expected: 600)`);

  assert.strictEqual(activeRegions.length, 1074);
  assert.strictEqual(totalDyn, 11268);
  assert.strictEqual(indexDyn, 5844);
  assert.strictEqual(noindexDyn, 5424);
  assert.strictEqual(seoulHubLinks, 5844);
  assert.strictEqual(seoulHubGrout, 0);
  assert.strictEqual(chungHubLinks, 600);

  console.log('\n====================================================');
  console.log('ALL RSS-2 VERIFICATION CHECKS PASSED PERFECTLY!');
  console.log('====================================================');
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
