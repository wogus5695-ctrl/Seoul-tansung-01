// Automated test & regression audit script for STEP RSS-8.
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
  console.log('======================================================================');
  console.log('[STEP RSS-8] NOWON BATCH FINAL PRODUCTION RELEASE AUDIT');
  console.log('======================================================================\n');

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

  // 4. Publication Gate Safety Verification (RSS-8: 12 Published, 0 Draft / RC)
  const publishedArticles = getPublishedArticles();
  const rssArticles = getRssEligibleArticles();
  const sitemapArticles = getSitemapEligibleArticles();

  console.log(`4. Publication Gate Status:`);
  console.log(`   Published Count: ${publishedArticles.length} (Expected: 12)`);
  console.log(`   RSS Eligible Count: ${rssArticles.length} (Expected: 12)`);
  console.log(`   Sitemap Eligible Count: ${sitemapArticles.length} (Expected: 12)`);
  assert.strictEqual(publishedArticles.length, 12, 'Published count must be exactly 12');
  assert.strictEqual(rssArticles.length, 12, 'RSS eligible count must be exactly 12');
  assert.strictEqual(sitemapArticles.length, 12, 'Sitemap eligible count must be exactly 12');

  // Verify all 12 have approved content status and isPublished = true
  allArticles.forEach(a => {
    assert.strictEqual(a.contentStatus, 'approved', `Article ${a.slug} must have contentStatus 'approved'`);
    assert.strictEqual(a.isPublished, true, `Article ${a.slug} must be isPublished: true`);
  });

  // 4-B. Date / Time Policy & Uniqueness Audit
  console.log(`4-B. Date / Time Policy Audit:`);
  const createdSet = new Set();
  const iso9Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/;

  let missingCreatedAt = 0;
  let invalidTimezone = 0;
  let futureTimestamps = 0;
  const nowThreshold = new Date('2026-10-21T15:38:00+09:00').getTime();

  allArticles.forEach((a) => {
    // 1. createdAt must exist
    if (!a.createdAt) missingCreatedAt++;
    assert.ok(a.createdAt, `Article ${a.editorialId} must have createdAt`);

    // 2. ISO 8601 +09:00 check
    if (!iso9Regex.test(a.createdAt)) {
      invalidTimezone++;
    }
    assert.ok(iso9Regex.test(a.createdAt), `Article ${a.editorialId} createdAt must be ISO 8601 +09:00`);

    // 3. Unique createdAt check
    assert.ok(!createdSet.has(a.createdAt), `createdAt must be unique: ${a.createdAt} duplicated in ${a.editorialId}`);
    createdSet.add(a.createdAt);

    // 4. No future timestamp relative to current release time
    const cTime = new Date(a.createdAt).getTime();
    if (cTime > nowThreshold) {
      futureTimestamps++;
    }
    assert.ok(cTime <= nowThreshold, `Article ${a.editorialId} createdAt cannot be in the future`);

    // 5. Check publishedAt
    assert.ok(iso9Regex.test(a.publishedAt), `Published article ${a.editorialId} publishedAt must be ISO 8601 +09:00`);
    const pTime = new Date(a.publishedAt).getTime();
    assert.ok(cTime <= pTime, `Article ${a.editorialId} createdAt (${a.createdAt}) must be <= publishedAt (${a.publishedAt})`);
    assert.ok(pTime <= nowThreshold, `Article ${a.editorialId} publishedAt cannot be in the future`);
  });

  // 6. Chronological order check for createdAt across the 12 articles
  for (let i = 0; i < allArticles.length - 1; i++) {
    const t1 = new Date(allArticles[i].createdAt).getTime();
    const t2 = new Date(allArticles[i+1].createdAt).getTime();
    assert.ok(t1 < t2, `Articles must have chronological createdAt: ${allArticles[i].editorialId} (${allArticles[i].createdAt}) vs ${allArticles[i+1].editorialId} (${allArticles[i+1].createdAt})`);
  }

  // 7. Protected article publishedAt checks
  const art1 = allArticles.find(a => a.editorialId === 'nowon_elastic__paint-vs-elastic-selection');
  assert.strictEqual(art1.publishedAt, '2026-10-21T09:00:00+09:00', 'Article 1 publishedAt must be preserved (Diff 0)');

  // 8. Batch 2~12 publishedAt check
  for (let i = 1; i < allArticles.length; i++) {
    assert.strictEqual(allArticles[i].publishedAt, '2026-10-21T15:37:00+09:00', `Article ${allArticles[i].editorialId} publishedAt must be batch release timestamp`);
    assert.strictEqual(allArticles[i].modifiedAt, '2026-10-21T15:37:00+09:00', `Article ${allArticles[i].editorialId} modifiedAt must match`);
  }

  console.log(`   createdAt Missing: ${missingCreatedAt} (Expected: 0)`);
  console.log(`   createdAt Unique Count: ${createdSet.size} (Expected: 12)`);
  console.log(`   Invalid Timezone: ${invalidTimezone} (Expected: 0)`);
  console.log(`   Future Timestamps: ${futureTimestamps} (Expected: 0)`);
  console.log(`   Article 1 publishedAt Preserved: 2026-10-21T09:00:00+09:00`);
  console.log(`   Article 2~12 publishedAt: 2026-10-21T15:37:00+09:00`);
  console.log(`   Date / Time Policy Audit: ALL PASS`);

  // 5. RSS.xml Verification (Published Batch: 12 Items)
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
  console.log(`   Item Count: ${itemCountMatches.length} (Expected: 12)`);
  assert.strictEqual(itemCountMatches.length, 12, 'RSS Item count must be exactly 12');

  const rssItems = rssContent.split('<item>').slice(1).map(block => '<item>' + block);
  assert.strictEqual(rssItems.length, 12);

  allArticles.forEach((art) => {
    const expectedUrl = `${SITE_URL}/guide/${art.slug}`;
    const matchingBlock = rssItems.find(item => item.includes(`<link>${expectedUrl}</link>`));
    assert.ok(matchingBlock, `RSS must contain item for ${art.slug}`);
    assert.ok(matchingBlock.includes(`<guid isPermaLink="true">${expectedUrl}</guid>`), `RSS item must have permalink guid for ${art.slug}`);

    // RSS pubDate must strictly match publishedAt in RFC 822 UTC format
    const expectedRfc822PubDate = new Date(art.publishedAt).toUTCString();
    const pubDateMatch = matchingBlock.match(/<pubDate>(.*?)<\/pubDate>/);
    assert.ok(pubDateMatch, `Item ${art.slug} must have pubDate in RSS`);
    assert.strictEqual(pubDateMatch[1], expectedRfc822PubDate, `RSS pubDate for ${art.slug} must strictly equal publishedAt in RFC 822`);
  });

  // Forbidden host assertions
  const forbiddenKeywords = ['localhost', '127.0.0.1', 'http://www.barumspace', 'http://barumspace', 'vercel.app'];
  forbiddenKeywords.forEach(kw => {
    assert.ok(!rssContent.includes(kw), `RSS.xml must not contain '${kw}'`);
  });
  console.log('   RSS.xml Quality & Domain Check: ALL PASS (12 items verified)');

  // 6. Sitemap.xml Verification (Batch: 5,859 = 5,844 dynamic + 3 static + 12 editorial)
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const sitemapLocs = (sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));
  const staticSitemap = sitemapLocs.filter(u => u === `${SITE_URL}/` || u === `${SITE_URL}/sitemap-seoul` || u === `${SITE_URL}/privacy-policy`);
  const dynamicSitemap = sitemapLocs.filter(u => u.includes('?k='));
  const editorialSitemap = sitemapLocs.filter(u => u.includes('/guide/'));

  console.log(`6. Sitemap.xml Check:`);
  console.log(`   Total URLs: ${sitemapLocs.length} (Expected: 5859)`);
  console.log(`   Dynamic URLs: ${dynamicSitemap.length} (Expected: 5844)`);
  console.log(`   Static URLs: ${staticSitemap.length} (Expected: 3)`);
  console.log(`   Editorial Article URLs: ${editorialSitemap.length} (Expected: 12)`);
  assert.strictEqual(sitemapLocs.length, 5859);
  assert.strictEqual(dynamicSitemap.length, 5844);
  assert.strictEqual(staticSitemap.length, 3);
  assert.strictEqual(editorialSitemap.length, 12);

  // All 12 articles must be in sitemap
  allArticles.forEach(art => {
    const expectedUrl = `${SITE_URL}/guide/${art.slug}`;
    assert.ok(sitemapLocs.includes(expectedUrl), `Sitemap must contain ${expectedUrl}`);
  });
  assert.ok(!sitemapContent.includes(`${SITE_URL}/guide<`), 'Guide Hub must NOT be in sitemap');
  assert.ok(!sitemapContent.includes('rss.xml'), 'rss.xml must NOT be in sitemap');

  // 7. Exact URL Match Audit
  console.log(`7. Exact URL Match Audit: All 12 Articles Canonical = Sitemap = RSS verified`);

  // 8. Guide SSR Runtime Tests
  console.log(`8. Guide SSR Runtime Tests:`);
  
  // 8-A: Guide Hub (/guide)
  const hubRes = await testGuideRequest('/guide');
  console.log(`   /guide -> Status: ${hubRes.statusCode}`);
  assert.strictEqual(hubRes.statusCode, 200);
  assert.ok(hubRes.html.includes('<meta name="robots" content="noindex, follow" />'), 'Hub must have noindex, follow');
  assert.ok(hubRes.html.includes(`<link rel="canonical" href="${SITE_URL}/guide" />`), 'Hub must have self-canonical');
  
  // All 12 articles must appear in Guide Hub
  allArticles.forEach(art => {
    assert.ok(hubRes.html.includes(`/guide/${art.slug}`), `Hub must contain link for ${art.slug}`);
  });
  console.log(`   Guide Hub: All 12 published articles present`);

  // 8-B: All 12 Articles Direct SSR Sweep
  console.log(`   Sweeping all 12 Articles direct SSR requests:`);
  for (const art of allArticles) {
    const artRes = await testGuideRequest(`/guide/${art.slug}`);
    assert.strictEqual(artRes.statusCode, 200, `Article ${art.slug} must return 200`);
    assert.ok(artRes.html.includes('<meta name="robots" content="index, follow" />'), `Article ${art.slug} must have index, follow`);
    assert.ok(artRes.html.includes(`<link rel="canonical" href="${SITE_URL}/guide/${art.slug}" />`), `Article ${art.slug} must have self-canonical`);
    assert.ok(artRes.html.includes(art.h1), `Article ${art.slug} must contain H1`);
    assert.ok(artRes.html.includes('"@type":"Article"'), `Article ${art.slug} must contain Article schema`);
    assert.ok(artRes.html.includes('"@type":"BreadcrumbList"'), `Article ${art.slug} must contain BreadcrumbList schema`);

    if (Array.isArray(art.faqs) && art.faqs.length > 0) {
      assert.ok(artRes.html.includes('자주 묻는 질문(FAQ)'), `Article ${art.slug} must contain FAQ section`);
      assert.ok(artRes.html.includes('"@type":"FAQPage"'), `Article ${art.slug} must contain FAQPage schema`);
    }

    if (Array.isArray(art.checklist) && art.checklist.length > 0) {
      assert.ok(artRes.html.includes('시공 문의 전 사전 점검 체크리스트'), `Article ${art.slug} must contain checklist section`);
    }

    // Verify related dynamic landing link presence
    art.relatedLandingTargets.forEach(tgt => {
      assert.ok(artRes.html.includes(tgt.relativeUrl), `Article ${art.slug} must contain related landing link: ${tgt.relativeUrl}`);
    });
  }
  console.log(`   All 12 Articles verified 200 with index, follow and valid schema: PASS`);

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
  console.log('ALL RSS-8 FINAL PRODUCTION RELEASE CHECKS PASSED PERFECTLY!');
  console.log('====================================================');
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
