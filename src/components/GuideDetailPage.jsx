import React from 'react';
import { SectionContainer } from './Common';
import { getArticleBySlug, isArticlePublished } from '../data/editorial/publicationGate.js';

export function GuideDetailPage({ slug, onNavigate }) {
  const article = getArticleBySlug(slug);
  const isPublished = isArticlePublished(article);

  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  if (!article || !isPublished) {
    return (
      <SectionContainer padding="80px 20px">
        <div style={{ textAlign: 'center', padding: '60px 0', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ color: 'var(--forest-green-main)', fontSize: '1.8rem', marginBottom: '16px' }}>
            페이지를 찾을 수 없습니다. (404 Not Found)
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            요청하신 가이드 글이 존재하지 않거나 비공개 상태입니다.
          </p>
          <a
            href="/guide"
            onClick={(e) => handleLinkClick(e, '/guide')}
            style={{ color: '#0076ff', textDecoration: 'underline', fontWeight: 600 }}
          >
            &larr; 가이드 목록으로 이동
          </a>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer padding="60px 20px">
      <div style={{ maxWidth: '820px', margin: '0 auto', color: 'var(--charcoal-text)', lineHeight: 1.8 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/" onClick={(e) => handleLinkClick(e, '/')} style={{ color: 'var(--forest-green-main)', textDecoration: 'underline' }}>
            홈
          </a>
          <span>&gt;</span>
          <a href="/guide" onClick={(e) => handleLinkClick(e, '/guide')} style={{ color: 'var(--forest-green-main)', textDecoration: 'underline' }}>
            시공 가이드
          </a>
          <span>&gt;</span>
          <span style={{ color: 'var(--forest-green-main)', fontWeight: 'bold' }}>{article.regionName}</span>
        </nav>

        {/* Article Header */}
        <header style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '2rem',
              color: 'var(--forest-green-main)',
              marginBottom: '12px',
              lineHeight: 1.4,
              wordBreak: 'keep-all'
            }}
          >
            {article.h1 || article.title}
          </h1>
          {article.publishedAt && (
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
              발행일: {article.publishedAt.split('T')[0]} · 바름공간 시공 가이드
            </div>
          )}
        </header>

        {/* Intro */}
        {article.intro && (
          <div style={{ background: '#f8f9fa', borderLeft: '4px solid var(--forest-green-main)', padding: '16px 20px', marginBottom: '32px', fontSize: '1.05rem', color: '#222', lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>{article.intro}</p>
          </div>
        )}

        {/* Sections */}
        {article.sections && article.sections.map((sec, idx) => (
          <section key={idx} style={{ marginBottom: '36px' }}>
            {sec.title && (
              <h2
                style={{
                  fontSize: '1.35rem',
                  color: 'var(--forest-green-main)',
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: '8px',
                  marginBottom: '16px',
                  wordBreak: 'keep-all'
                }}
              >
                {sec.title}
              </h2>
            )}
            {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} style={{ marginBottom: '14px', fontSize: '1rem', color: '#333', lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* Checklist */}
        {article.checklist && article.checklist.length > 0 && (
          <section style={{ background: '#faf8f5', border: '1px solid #e5ded5', borderRadius: '8px', padding: '24px', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginTop: 0, marginBottom: '16px' }}>
              시공 문의 전 사전 점검 체크리스트
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {article.checklist.map((item, cIdx) => (
                <li key={cIdx} style={{ padding: '8px 0', borderBottom: '1px dashed #e8e2d9', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--forest-green-main)', fontWeight: 'bold' }}>[체크 {cIdx + 1}]</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ Section */}
        {article.faqs && article.faqs.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--forest-green-main)', borderBottom: '1px solid #e0e0e0', paddingBottom: '8px', marginBottom: '16px' }}>
              자주 묻는 질문(FAQ)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {article.faqs.map((faq, fIdx) => (
                <div key={fIdx} style={{ background: '#fdfdfd', border: '1px solid #eee', borderRadius: '6px', padding: '18px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--forest-green-main)', margin: '0 0 8px 0' }}>Q. {faq.q}</h3>
                  <p style={{ margin: 0, color: '#555', fontSize: '0.95rem', lineHeight: 1.6 }}>A. {faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Dynamic Landing Link (Requirement 7) */}
        {article.relatedLandingTargets && article.relatedLandingTargets.length > 0 && (
          <nav style={{ background: '#f0f4f2', border: '1px solid #d2ded7', borderRadius: '8px', padding: '20px', marginTop: '40px' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--forest-green-main)', fontSize: '0.95rem', marginBottom: '8px' }}>
              관련 시공 서비스 안내
            </div>
            {article.relatedLandingTargets.map((tgt, tIdx) => (
              <p key={tIdx} style={{ margin: 0 }}>
                <a
                  href={tgt.relativeUrl}
                  onClick={(e) => handleLinkClick(e, tgt.relativeUrl)}
                  style={{ color: '#0076ff', textDecoration: 'underline', fontWeight: 600 }}
                >
                  {tgt.label || '시공 서비스 바로가기'} &rarr;
                </a>
              </p>
            ))}
          </nav>
        )}

        {/* Bottom Nav */}
        <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '24px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
          <a href="/guide" onClick={(e) => handleLinkClick(e, '/guide')} style={{ color: 'var(--forest-green-main)', textDecoration: 'underline' }}>
            &larr; 가이드 목록 전체보기
          </a>
          <a href="/" onClick={(e) => handleLinkClick(e, '/')} style={{ color: '#666', textDecoration: 'none' }}>
            바름공간 메인 홈 바로가기
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
