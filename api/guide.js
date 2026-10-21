import fs from 'fs';
import path from 'path';
import { getArticleBySlug, getPublishedArticles, isArticlePublished } from '../src/data/editorial/publicationGate.js';
import { renderArticleBodyHtml } from '../src/data/editorial/renderArticleHtml.js';

const SITE_URL = 'https://www.barumspace.co.kr';

export default async function handler(req, res) {
  // Parse incoming URL robustly under Vercel Rewrites
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  let pathname = url.pathname;
  const originalUrlHeader = req.headers['x-vercel-original-url'] || req.headers['x-matched-path'] || '';
  if (originalUrlHeader) {
    try {
      const origUrl = new URL(originalUrlHeader, `http://${req.headers.host || 'localhost'}`);
      pathname = origUrl.pathname;
    } catch (e) {
      // fallback to url.pathname
    }
  }

  // Normalize pathname: remove trailing slash except root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Load app.html compiled template from the deployment output
  let htmlPath = path.join(process.cwd(), 'dist', 'app.html');
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  }
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'index.html');
  }

  let html = fs.readFileSync(htmlPath, 'utf-8');

  // CASE 1: Guide Hub (/guide)
  if (pathname === '/guide') {
    const hubTitle = '탄성코트 시공 가이드 | 바름공간';
    const hubDesc = '탄성코트 및 베란다탄성코트 시공 전 확인해야 할 선택 기준과 상담·시공 정보를 안내합니다.';
    const hubCanonical = `${SITE_URL}/guide`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${hubTitle}</title>`);
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${hubDesc}" />`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${hubTitle}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${hubDesc}" />`);

    const headInjections = `
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="${hubCanonical}" />
<meta property="og:url" content="${hubCanonical}" />
<meta property="og:type" content="website" />
</head>`;
    html = html.replace('</head>', headInjections);

    const publishedArticles = getPublishedArticles();

    let hubBody = `
<div style="padding: 40px 20px; max-width: 900px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #333;">
  <nav style="font-size: 0.85rem; color: #666; margin-bottom: 24px;">
    <a href="/" style="color: #666; text-decoration: none;">홈</a> &gt; <span>가이드</span>
  </nav>
  <h1 style="font-size: 2rem; color: #183f35; margin-bottom: 12px; border-bottom: 2px solid #183f35; padding-bottom: 12px;">바름공간 탄성코트 시공 가이드</h1>
  <p style="color: #555; font-size: 1.05rem; margin-bottom: 32px;">시공을 결정하기 전 필요한 객관적인 선택 기준과 현장 자가 점검 체크리스트를 공유합니다.</p>
  
  <div style="display: flex; flex-direction: column; gap: 20px;">`;

    if (publishedArticles.length === 0) {
      hubBody += `<p style="color: #888;">현재 준비 중인 가이드 글이 없습니다.</p>`;
    } else {
      publishedArticles.forEach(art => {
        hubBody += `
    <article style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fff; transition: box-shadow 0.2s;">
      <h2 style="font-size: 1.3rem; margin: 0 0 10px 0;">
        <a href="/guide/${art.slug}" style="color: #183f35; text-decoration: none;">${art.title}</a>
      </h2>
      <p style="color: #666; font-size: 0.95rem; margin: 0 0 16px 0; line-height: 1.6;">${art.metaDescription}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #888;">
        <span>${art.publishedAt ? art.publishedAt.split('T')[0] : ''}</span>
        <a href="/guide/${art.slug}" style="color: #0076ff; font-weight: 600; text-decoration: none;">가이드 읽기 &rarr;</a>
      </div>
    </article>`;
      });
    }

    hubBody += `
  </div>
  
  <div style="margin-top: 48px; border-top: 1px solid #eee; padding-top: 24px; font-size: 0.9rem;">
    <a href="/" style="color: #0076ff; text-decoration: none;">&larr; 메인 홈페이지로 돌아가기</a>
  </div>
</div>`;

    html = html.replace('<div id="root"></div>', `<div id="root">${hubBody}</div>`);
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // CASE 2: Guide Article Detail (/guide/:slug)
  if (pathname.startsWith('/guide/')) {
    const slug = pathname.replace('/guide/', '').trim();
    const article = getArticleBySlug(slug);

    // Draft / Non-existent Article Protection (Requirement 12)
    if (!article || !isArticlePublished(article)) {
      html = html.replace(/<title>.*?<\/title>/, `<title>페이지를 찾을 수 없습니다 | 바름공간</title>`);
      html = html.replace('</head>', '<meta name="robots" content="noindex, follow" />\n</head>');
      html = html.replace(
        '<div id="root"></div>',
        '<div id="root" style="padding: 60px 20px; text-align: center; font-family: sans-serif;">' +
        '<h1 style="color: #183f35; font-size: 1.8rem; margin-bottom: 16px;">페이지를 찾을 수 없습니다. (404 Not Found)</h1>' +
        '<p style="color: #666; margin-bottom: 24px;">요청하신 가이드 글이 존재하지 않거나 비공개 상태입니다.</p>' +
        '<a href="/guide" style="color: #0076ff; text-decoration: underline;">가이드 목록으로 이동</a>' +
        '</div>'
      );
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(html);
    }

    // Published Article SEO Meta Injections
    const articleTitle = `${article.title} | 바름공간`;
    const articleDesc = article.metaDescription;
    const articleCanonical = `${SITE_URL}/guide/${article.slug}`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${articleTitle}</title>`);
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${articleDesc}" />`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${articleTitle}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${articleDesc}" />`);

    // Construct JSON-LD Schemas (Article, BreadcrumbList, FAQPage)
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title,
        'description': article.metaDescription,
        'datePublished': article.publishedAt,
        'dateModified': article.modifiedAt || article.publishedAt,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': articleCanonical
        },
        'author': {
          '@type': 'Organization',
          'name': '바름공간'
        },
        'publisher': {
          '@type': 'Organization',
          'name': '바름공간',
          'url': SITE_URL
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': '홈', 'item': `${SITE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': '시공 가이드', 'item': `${SITE_URL}/guide` },
          { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': articleCanonical }
        ]
      }
    ];

    if (Array.isArray(article.faqs) && article.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': article.faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a
          }
        }))
      });
    }

    const headInjections = `
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${articleCanonical}" />
<meta property="og:url" content="${articleCanonical}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${articleTitle}" />
<meta name="twitter:description" content="${articleDesc}" />
<script type="application/ld+json" id="jsonld-schema">
${JSON.stringify(schemas)}
</script>
</head>`;
    html = html.replace('</head>', headInjections);

    // Render Semantic Raw HTML Body from Shared Renderer (Requirement 26)
    const articleHtml = renderArticleBodyHtml(article, { forRss: false, siteUrl: SITE_URL });
    const wrappedContent = `
<div style="padding: 40px 20px; max-width: 820px; margin: 0 auto;">
  <nav style="font-size: 0.85rem; color: #666; margin-bottom: 24px;">
    <a href="/" style="color: #666; text-decoration: none;">홈</a> &gt; <a href="/guide" style="color: #666; text-decoration: none;">가이드</a> &gt; <span>${article.regionName}</span>
  </nav>
  ${articleHtml}
  <div style="margin-top: 48px; border-top: 1px solid #eee; padding-top: 24px; font-size: 0.9rem; display: flex; justify-content: space-between;">
    <a href="/guide" style="color: #183f35; text-decoration: underline;">&larr; 가이드 목록 전체보기</a>
    <a href="/" style="color: #666; text-decoration: none;">바름공간 메인 홈 바로가기</a>
  </div>
</div>`;

    html = html.replace('<div id="root"></div>', `<div id="root">${wrappedContent}</div>`);
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // If page does not match /guide or /guide/*, 404
  html = html.replace(/<title>.*?<\/title>/, `<title>페이지를 찾을 수 없습니다 | 바름공간</title>`);
  html = html.replace('</head>', '<meta name="robots" content="noindex, follow" />\n</head>');
  html = html.replace('<div id="root"></div>', '<div id="root" style="padding: 50px; text-align: center;"><h1>페이지를 찾을 수 없습니다. (404 Not Found)</h1></div>');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(404).send(html);
}
