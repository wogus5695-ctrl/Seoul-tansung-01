import React from 'react';
import { SectionContainer } from './Common';
import { getPublishedArticles } from '../data/editorial/publicationGate.js';

export function GuideHubPage({ onNavigate }) {
  const publishedArticles = getPublishedArticles();

  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <SectionContainer padding="60px 20px">
      <div style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--charcoal-text)', lineHeight: 1.75 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: '#666', display: 'flex', gap: '8px' }}>
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            style={{ color: 'var(--forest-green-main)', textDecoration: 'underline' }}
          >
            홈
          </a>
          <span>&gt;</span>
          <span style={{ color: 'var(--forest-green-main)', fontWeight: 'bold' }}>시공 가이드</span>
        </div>

        {/* H1 Title */}
        <h1
          style={{
            fontSize: '2.2rem',
            color: 'var(--forest-green-main)',
            marginBottom: '12px',
            borderBottom: '2px solid var(--forest-green-main)',
            paddingBottom: '12px',
            wordBreak: 'keep-all'
          }}
        >
          바름공간 탄성코트 시공 가이드
        </h1>
        <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '36px', lineHeight: 1.6 }}>
          시공을 결정하기 전 필요한 객관적인 선택 기준과 현장 자가 점검 체크리스트를 공유합니다.
        </p>

        {/* Published Article Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {publishedArticles.length === 0 ? (
            <p style={{ color: '#888' }}>현재 준비 중인 가이드 글이 없습니다.</p>
          ) : (
            publishedArticles.map((art) => (
              <article
                key={art.editorialId}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '28px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <h2 style={{ fontSize: '1.35rem', margin: '0 0 12px 0', color: 'var(--forest-green-main)' }}>
                  <a
                    href={`/guide/${art.slug}`}
                    onClick={(e) => handleLinkClick(e, `/guide/${art.slug}`)}
                    style={{ color: 'var(--forest-green-main)', textDecoration: 'none' }}
                  >
                    {art.title}
                  </a>
                </h2>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: 1.6 }}>
                  {art.metaDescription}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#888' }}>
                  <span>{art.publishedAt ? art.publishedAt.split('T')[0] : ''}</span>
                  <a
                    href={`/guide/${art.slug}`}
                    onClick={(e) => handleLinkClick(e, `/guide/${art.slug}`)}
                    style={{ color: '#0076ff', fontWeight: 600, textDecoration: 'none' }}
                  >
                    가이드 읽기 &rarr;
                  </a>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Bottom Back Nav */}
        <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '24px', fontSize: '0.9rem' }}>
          <a href="/" onClick={(e) => handleLinkClick(e, '/')} style={{ color: '#0076ff', textDecoration: 'none' }}>
            &larr; 메인 홈페이지로 돌아가기
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
