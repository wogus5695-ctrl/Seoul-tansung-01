/**
 * BARUMSPACE EDITORIAL ARTICLE HTML RENDERER (SSoT)
 * 
 * Converts structured editorial article data (sections, faqs, checklist)
 * into semantic, accessible HTML string for SSR injection and RSS content:encoded.
 * Ensures zero content duplication and 100% semantic parity across SSR, CSR, and RSS.
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
 * Builds standard semantic HTML body for an approved article.
 * @param {Object} article - Article entry from editorialRegistry
 * @param {Object} options - { forRss: boolean, siteUrl: string }
 * @returns {string}
 */
export function renderArticleBodyHtml(article, options = {}) {
  if (!article) return '';
  const { forRss = false, siteUrl = 'https://www.barumspace.co.kr' } = options;

  let out = `<div class="editorial-article-body" style="line-height: 1.8; color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">\n`;

  // 1. Article Header (H1)
  out += `  <header style="margin-bottom: 28px;">\n`;
  out += `    <h1 style="font-size: 1.85rem; color: #183f35; margin-bottom: 12px; line-height: 1.4;">${escapeXml(article.h1 || article.title)}</h1>\n`;
  if (article.publishedAt) {
    const pubDateFormatted = article.publishedAt.split('T')[0];
    out += `    <div style="font-size: 0.9rem; color: #666; margin-bottom: 16px;">발행일: ${pubDateFormatted} · 바름공간 시공 가이드</div>\n`;
  }
  out += `  </header>\n\n`;

  // 2. Intro Paragraph
  if (article.intro) {
    out += `  <div class="article-intro" style="background: #f8f9fa; border-left: 4px solid #183f35; padding: 16px 20px; margin-bottom: 32px; font-size: 1.05rem; color: #222;">\n`;
    out += `    <p style="margin: 0;">${escapeXml(article.intro)}</p>\n`;
    out += `  </div>\n\n`;
  }

  // 3. Sections (H2 + paragraphs)
  if (Array.isArray(article.sections)) {
    article.sections.forEach((sec, idx) => {
      out += `  <section style="margin-bottom: 36px;">\n`;
      if (sec.title) {
        out += `    <h2 style="font-size: 1.35rem; color: #183f35; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 16px;">${escapeXml(sec.title)}</h2>\n`;
      }
      if (Array.isArray(sec.paragraphs)) {
        sec.paragraphs.forEach(p => {
          out += `    <p style="margin-bottom: 14px; font-size: 1rem; color: #333;">${escapeXml(p)}</p>\n`;
        });
      }
      out += `  </section>\n\n`;
    });
  }

  // 4. Checklist Section
  if (Array.isArray(article.checklist) && article.checklist.length > 0) {
    out += `  <section style="background: #faf8f5; border: 1px solid #e5ded5; border-radius: 8px; padding: 24px; margin-bottom: 36px;">\n`;
    out += `    <h2 style="font-size: 1.25rem; color: #183f35; margin-top: 0; margin-bottom: 16px;">시공 문의 전 사전 점검 체크리스트</h2>\n`;
    out += `    <ul style="list-style: none; padding: 0; margin: 0;">\n`;
    article.checklist.forEach((item, idx) => {
      out += `      <li style="padding: 8px 0; border-bottom: 1px dashed #e8e2d9; display: flex; align-items: flex-start; gap: 8px; font-size: 0.95rem;">\n`;
      out += `        <span style="color: #183f35; font-weight: bold;">[체크 ${idx + 1}]</span>\n`;
      out += `        <span>${escapeXml(item)}</span>\n`;
      out += `      </li>\n`;
    });
    out += `    </ul>\n`;
    out += `  </section>\n\n`;
  }

  // 5. FAQ Section
  if (Array.isArray(article.faqs) && article.faqs.length > 0) {
    out += `  <section style="margin-bottom: 40px;">\n`;
    out += `    <h2 style="font-size: 1.35rem; color: #183f35; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 16px;">자주 묻는 질문(FAQ)</h2>\n`;
    out += `    <div style="display: flex; flex-direction: column; gap: 16px;">\n`;
    article.faqs.forEach(faq => {
      out += `      <div style="background: #fdfdfd; border: 1px solid #eee; border-radius: 6px; padding: 18px;">\n`;
      out += `        <h3 style="font-size: 1.05rem; color: #183f35; margin: 0 0 8px 0;">Q. ${escapeXml(faq.q)}</h3>\n`;
      out += `        <p style="margin: 0; color: #555; font-size: 0.95rem; line-height: 1.6;">A. ${escapeXml(faq.a)}</p>\n`;
      out += `      </div>\n`;
    });
    out += `    </div>\n`;
    out += `  </section>\n\n`;
  }

  // 6. Related Dynamic Landing Links (Requirement 7)
  if (Array.isArray(article.relatedLandingTargets) && article.relatedLandingTargets.length > 0) {
    out += `  <nav style="background: #f0f4f2; border: 1px solid #d2ded7; border-radius: 8px; padding: 20px; margin-top: 40px;">\n`;
    out += `    <div style="font-weight: bold; color: #183f35; font-size: 0.95rem; margin-bottom: 8px;">관련 시공 서비스 안내</div>\n`;
    article.relatedLandingTargets.forEach(tgt => {
      const linkHref = forRss ? `${siteUrl}${tgt.relativeUrl}` : tgt.relativeUrl;
      out += `    <p style="margin: 0;"><a href="${linkHref}" style="color: #0076ff; text-decoration: underline; font-weight: 600;">${escapeXml(tgt.label || '시공 서비스 바로가기')} &rarr;</a></p>\n`;
    });
    out += `  </nav>\n`;
  }

  out += `</div>`;
  return out;
}
