// Node.js script to dynamically generate standard-compliant RSS 2.0 feed (rss.xml).
// Reads published articles from the editorial publication gate.
// Only articles where isPublished === true && contentStatus === 'approved' && rssEnabled === true are included.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRssEligibleArticles } from '../src/data/editorial/publicationGate.js';
import { renderArticleBodyHtml } from '../src/data/editorial/renderArticleHtml.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base SITE_URL strictly forced to official canonical production host
const SITE_URL = 'https://www.barumspace.co.kr';

/**
 * Escapes standard XML special characters.
 * @param {string} str 
 * @returns {string}
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a Date object or ISO string to RFC 822 / RFC 2822 date format (e.g. Wed, 21 Oct 2026 09:00:00 GMT).
 * @param {Date|string} dateInput 
 * @returns {string}
 */
function formatRfc822(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toUTCString();
}

/**
 * Wraps content safely in CDATA block.
 * @param {string} text 
 * @returns {string}
 */
function wrapCdata(text) {
  if (!text) return '<![CDATA[]]>';
  // Escape nested CDATA end markers if any
  const safeText = text.replace(/\]\]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${safeText}]]>`;
}

async function generateRss() {
  console.log('Generating rss.xml for target domain:', SITE_URL);

  const articles = getRssEligibleArticles();
  console.log(`Found ${articles.length} RSS-eligible published article(s).`);

  const channelTitle = '바름공간 탄성코트 시공 가이드';
  const channelLink = `${SITE_URL}/`;
  const channelDesc = '탄성코트 및 베란다탄성코트 시공 전 확인해야 할 선택 기준과 상담·시공 정보를 안내합니다.';
  const channelLang = 'ko-KR';
  const lastBuildDate = formatRfc822(new Date());

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml(channelTitle)}</title>\n`;
  xml += `    <link>${escapeXml(channelLink)}</link>\n`;
  xml += `    <description>${escapeXml(channelDesc)}</description>\n`;
  xml += `    <language>${escapeXml(channelLang)}</language>\n`;
  xml += `    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n`;

  articles.forEach(article => {
    const itemUrl = `${SITE_URL}/guide/${article.slug}`;
    const pubDate = formatRfc822(article.publishedAt || new Date());
    const itemTitle = article.title;
    const itemDesc = article.metaDescription;

    // Build semantic HTML body from shared renderer (Requirement 26)
    const htmlContent = renderArticleBodyHtml(article, { forRss: true, siteUrl: SITE_URL });

    xml += '    <item>\n';
    xml += `      <title>${escapeXml(itemTitle)}</title>\n`;
    xml += `      <link>${escapeXml(itemUrl)}</link>\n`;
    xml += `      <guid isPermaLink="true">${escapeXml(itemUrl)}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <description>${escapeXml(itemDesc)}</description>\n`;
    xml += `      <content:encoded>${wrapCdata(htmlContent)}</content:encoded>\n`;
    xml += '    </item>\n';
  });

  xml += '  </channel>\n';
  xml += '</rss>\n';

  const outputPath = path.join(__dirname, '../public/rss.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Success! Wrote rss.xml successfully with ${articles.length} items to ${outputPath}`);
}

generateRss().catch(err => {
  console.error('RSS generation script failed:', err);
  process.exit(1);
});
