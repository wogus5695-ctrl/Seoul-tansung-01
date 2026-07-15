import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config';

// 1. Header Component with Mobile Hamburger Menu and Keyboard accessibility
export function Header({ onNavigate, currentPath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const menuItems = [
    { label: '탄성코트', href: '#elastic-coating' },
    { label: '줄눈시공', href: '#grout' },
    { label: '시공 사례', href: '#portfolio' },
    { label: '시공 과정', href: '#process' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    
    if (currentPath !== '/') {
      onNavigate('/', '');
      // Wait for navigation update, then scroll
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} style={{ ...styles.logo, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="바름공간 로고" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
          <span>{siteConfig.brandName}</span>
        </a>

        {/* PC Nav */}
        <nav style={styles.pcNav}>
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              style={styles.navLink}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/sitemap-seoul"
            onClick={(e) => { e.preventDefault(); onNavigate('/sitemap-seoul'); }}
            style={{ ...styles.navLink, ...(currentPath === '/sitemap-seoul' ? styles.navActive : {}) }}
          >
            지역 시공안내
          </a>
        </nav>

        {/* PC Right CTA */}
        <div style={styles.pcCTA}>
          <a href="#consultation" onClick={(e) => handleLinkClick(e, '#consultation')} style={styles.headerCTA}>
            상담하기
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
        >
          <span style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ ...styles.hamburgerLine, opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={styles.drawer} onClick={() => setMenuOpen(false)}>
          <div style={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <nav style={styles.drawerNav}>
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  style={styles.drawerLink}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/sitemap-seoul"
                onClick={(e) => { e.preventDefault(); onNavigate('/sitemap-seoul'); setMenuOpen(false); }}
                style={styles.drawerLink}
              >
                지역 시공안내
              </a>
              <a
                href="#consultation"
                onClick={(e) => handleLinkClick(e, '#consultation')}
                style={{ ...styles.drawerLink, color: 'var(--forest-green-main)', fontWeight: '600' }}
              >
                상담하기
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// 2. Footer Component
export function Footer({ onNavigate }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerGrid}>
          <div>
            <h3 style={styles.footerBrand}>{siteConfig.brandName}</h3>
            <p style={styles.footerText}>대표번호: {siteConfig.phoneNumber}</p>
            <p style={styles.footerText}>운영시간: {siteConfig.operatingHours}</p>
          </div>
          <div>
            <p style={styles.footerText}>사업자 정보: {siteConfig.businessInformation}</p>
            <div style={styles.footerLinks}>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('개인정보처리방침 안내 플레이스홀더'); }} style={styles.footerLink}>
                개인정보처리방침
              </a>
              <span style={{ opacity: 0.3 }}>|</span>
              <a href="/sitemap-seoul" onClick={(e) => { e.preventDefault(); onNavigate('/sitemap-seoul'); }} style={styles.footerLink}>
                통합 허브 페이지 (sitemap-seoul)
              </a>
            </div>
          </div>
        </div>
        <p style={styles.copyright}>© {new Date().getFullYear()} {siteConfig.brandName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

// 3. SectionContainer Component
export function SectionContainer({ id, children, background = 'transparent', padding = '80px 20px' }) {
  let bgValue = 'transparent';
  if (background === 'sand') bgValue = 'var(--light-sand)';
  else if (background === 'beige') bgValue = 'var(--sand-beige)';
  else if (background === 'white') bgValue = 'var(--white)';
  else if (background !== 'transparent') bgValue = background;

  return (
    <section id={id} style={{ ...styles.section, backgroundColor: bgValue, padding }}>
      <div style={styles.sectionInner}>
        {children}
      </div>
    </section>
  );
}

// 4. PrimaryButton Component
export function PrimaryButton({ children, onClick, style = {} }) {
  return (
    <button style={{ ...styles.primaryBtn, ...style }} onClick={onClick}>
      {children}
    </button>
  );
}

// 5. SecondaryButton Component
export function SecondaryButton({ children, onClick, style = {} }) {
  return (
    <button style={{ ...styles.secondaryBtn, ...style }} onClick={onClick}>
      {children}
    </button>
  );
}

// 6. ImagePlaceholder Component (Renders real images if configured, otherwise shows placeholder)
export function ImagePlaceholder({ label, ratio = '16:9', size = 'Recommended: 800x450' }) {
  // Map labels to siteImages keys
  let imageSrc = null;
  const isGroutKeyword = label === 'BATHROOM_GROUT_IMAGE' || 
                         label === 'GROUT_HERO' || 
                         label === 'ENTRANCE_GROUT_IMAGE' || 
                         label === 'BALCONY_GROUT_IMAGE' || 
                         label === 'TOILET_GROUT_IMAGE';

  const isElasticKeyword = label === 'ELASTIC_COATING_HERO' || 
                           label === 'BALCONY_ELASTIC_IMAGE' || 
                           label === 'LAUNDRY_ELASTIC_IMAGE';

  if (isGroutKeyword) {
    imageSrc = '/bathroom_grout_hero.png';
  } else if (label === 'GROUT_SERVICE_IMAGE' || label === 'GROUT_PANEL') {
    imageSrc = '/bathroom_grout_panel.png';
  } else if (isElasticKeyword) {
    imageSrc = '/elastic_coating_hero.png';
  } else if (label === 'ELASTIC_COATING_SERVICE_IMAGE') {
    imageSrc = '/elastic_coating_panel.png';
  } else if (label === 'ELASTIC_COATING_BEFORE') {
    imageSrc = '/closet_before.png';
  } else if (label === 'ELASTIC_COATING_AFTER') {
    imageSrc = '/closet_after.png';
  }

  if (imageSrc) {
    const isElastic = imageSrc.includes('elastic');
    return (
      <div style={{ ...styles.placeholderContainer, border: 'none', backgroundColor: 'transparent' }}>
        <img 
          src={imageSrc} 
          alt={isElastic ? "바름공간 탄성코트 시공" : "바름공간 줄눈시공"} 
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} 
        />
      </div>
    );
  }

  return (
    <div style={styles.placeholderContainer}>
      <div style={{ ...styles.placeholderRatioBox, paddingBottom: ratio === '16:9' ? '56.25%' : ratio === '4:3' ? '75%' : ratio === '4:5' ? '125%' : ratio === '5:6' ? '120%' : ratio === '1:1' ? '100%' : '56.25%' }}>
        <div style={styles.placeholderContent}>
          <span style={styles.placeholderLabel}>{label}</span>
          <span style={styles.placeholderInfo}>{ratio} / {size}</span>
        </div>
      </div>
    </div>
  );
}

// 7. Accordion Component (FAQ with proper aria roles)
export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.accordionContainer}>
      {items.map((item, index) => (
        <div key={index} style={styles.accordionItem}>
          <button
            style={styles.accordionHeader}
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            id={`faq-header-${index}`}
            aria-controls={`faq-panel-${index}`}
          >
            <span style={styles.accordionTitle}>{item.question}</span>
            <span style={styles.accordionIcon}>{openIndex === index ? '−' : '+'}</span>
          </button>
          <div
            id={`faq-panel-${index}`}
            aria-labelledby={`faq-header-${index}`}
            role="region"
            style={{
              ...styles.accordionBody,
              maxHeight: openIndex === index ? '400px' : '0px',
              padding: openIndex === index ? '20px' : '0px 20px',
            }}
          >
            <div style={styles.accordionContent}>{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 8. MobileFixedCTA Component (Only visible on mobile width via index.css rules / display checks)
export function MobileFixedCTA({ onPhoneClick, onChatClick }) {
  return (
    <div style={styles.fixedCta}>
      <div style={styles.fixedCtaGrid}>
        <button style={styles.fixedCtaPhone} onClick={onPhoneClick}>
          전화 문의
        </button>
        <button style={styles.fixedCtaChat} onClick={onChatClick}>
          사진 상담
        </button>
      </div>
    </div>
  );
}

// 9. ServiceSection Component
export function ServiceSection({ id, label, title, description, children }) {
  return (
    <div id={id} style={styles.serviceSec}>
      <span style={styles.serviceLabel}>{label}</span>
      <h2 style={styles.serviceTitle}>{title}</h2>
      <p style={styles.serviceDesc}>{description}</p>
      <div style={styles.serviceInnerContent}>
        {children}
      </div>
    </div>
  );
}

// 10. SEOContentSection Component
export function SEOContentSection({ keywordInfo }) {
  if (!keywordInfo) return null;
  return (
    <SectionContainer background="beige">
      <div style={styles.seoBox}>
        <h3>{keywordInfo.region} {keywordInfo.service} 맞춤형 마감 제안</h3>
        <p style={styles.seoDesc}>
          {keywordInfo.region}의 세대 환경에 최적화된 마감 자재와 전문 시공 기술력을 결합합니다.
          현장의 습도와 노후도를 고려하여 결로 방지 성능을 극대화하는 탄성코트와 세균 번식을 근본적으로 방지하는 친환경 줄눈 공법으로 안심할 수 있는 정돈된 공간을 구현합니다.
        </p>
      </div>
    </SectionContainer>
  );
}

// Inline Styles Object
const styles = {
  header: {
    backgroundColor: 'var(--warm-white)',
    borderBottom: '1px solid var(--light-sand)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  headerContainer: {
    maxWidth: 'var(--desktop-max-width)',
    margin: '0 auto',
    padding: '16px var(--mobile-side-margin)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '60px',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'var(--forest-green-main)',
    letterSpacing: '-0.5px',
  },
  pcNav: {
    display: 'none',
  },
  pcCTA: {
    display: 'none',
  },
  headerCTA: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    padding: '8px 18px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    padding: 0,
    border: 'none',
    background: 'none',
  },
  hamburgerLine: {
    display: 'block',
    width: '100%',
    height: '2px',
    backgroundColor: 'var(--forest-green-main)',
    transition: 'all 0.25s ease-in-out',
  },
  drawer: {
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '100%',
    height: 'calc(100vh - 60px)',
    backgroundColor: 'rgba(40, 49, 46, 0.4)',
    zIndex: 99,
  },
  drawerContent: {
    backgroundColor: 'var(--warm-white)',
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    padding: '30px var(--mobile-side-margin)',
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
  },
  drawerNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  drawerLink: {
    fontSize: '1.1rem',
    color: 'var(--charcoal-text)',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--light-sand)',
  },
  footer: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--light-sand)',
    padding: '60px var(--mobile-side-margin) 110px var(--mobile-side-margin)',
    width: '100%',
  },
  footerContainer: {
    maxWidth: 'var(--desktop-max-width)',
    margin: '0 auto',
  },
  footerGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '32px',
  },
  footerBrand: {
    color: 'var(--white)',
    fontSize: '1.3rem',
    marginBottom: '8px',
  },
  footerText: {
    fontSize: '0.9rem',
    opacity: 0.85,
    lineHeight: 1.6,
  },
  footerLinks: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginTop: '16px',
    fontSize: '0.85rem',
  },
  footerLink: {
    opacity: 0.9,
    textDecoration: 'underline',
  },
  copyright: {
    fontSize: '0.8rem',
    opacity: 0.6,
    borderTop: '1px solid rgba(240, 233, 220, 0.2)',
    paddingTop: '20px',
  },
  section: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  sectionInner: {
    width: '100%',
    maxWidth: 'var(--desktop-max-width)',
  },
  primaryBtn: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    padding: '14px 28px',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    minHeight: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'var(--forest-green-main)',
    border: '1px solid var(--forest-green-main)',
    padding: '14px 28px',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    minHeight: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  placeholderContainer: {
    width: '100%',
    backgroundColor: '#F3EFE9',
    border: '1px dashed var(--sand-beige)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  placeholderRatioBox: {
    position: 'relative',
    width: '100%',
  },
  placeholderContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    textAlign: 'center',
  },
  placeholderLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--forest-green-main)',
    marginBottom: '4px',
  },
  placeholderInfo: {
    fontSize: '0.8rem',
    color: 'var(--charcoal-text)',
    opacity: 0.7,
  },
  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  accordionItem: {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--light-sand)',
    overflow: 'hidden',
  },
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px',
    textAlign: 'left',
    minHeight: '48px',
    backgroundColor: 'var(--white)',
  },
  accordionTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--forest-green-main)',
  },
  accordionIcon: {
    fontSize: '1.2rem',
    color: 'var(--forest-green-sub)',
  },
  accordionBody: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-out, padding 0.3s ease-out',
    backgroundColor: '#FCFAF7',
    borderTop: '1px solid var(--light-sand)',
  },
  accordionContent: {
    fontSize: '0.95rem',
    color: 'var(--charcoal-text)',
    lineHeight: 1.6,
  },
  fixedCta: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'var(--white)',
    borderTop: '1px solid var(--light-sand)',
    padding: '12px var(--mobile-side-margin) calc(12px + env(safe-area-inset-bottom)) var(--mobile-side-margin)',
    zIndex: 99,
  },
  fixedCtaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    maxWidth: 'var(--desktop-max-width)',
    margin: '0 auto',
  },
  fixedCtaPhone: {
    backgroundColor: 'var(--white)',
    color: 'var(--forest-green-main)',
    border: '1px solid var(--forest-green-main)',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '1rem',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedCtaChat: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '1rem',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceSec: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  serviceLabel: {
    fontSize: '0.85rem',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--forest-green-sub)',
    fontWeight: '600',
  },
  serviceTitle: {
    fontSize: '1.75rem',
  },
  serviceDesc: {
    fontSize: '1rem',
    color: 'var(--charcoal-text)',
    opacity: 0.8,
    maxWidth: '680px',
    lineHeight: 1.6,
  },
  serviceInnerContent: {
    marginTop: '12px',
  },
  seoBox: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  seoDesc: {
    fontSize: '0.95rem',
    color: 'var(--charcoal-text)',
    opacity: 0.8,
    lineHeight: 1.6,
  },
};

// Check media values dynamically for responsive elements on client initialization
if (typeof window !== 'undefined') {
  const checkMedia = () => {
    if (window.innerWidth >= 1024) {
      styles.pcNav.display = 'flex';
      styles.pcNav.gap = '32px';
      styles.pcCTA.display = 'block';
      styles.hamburger.display = 'none';
      styles.footerGrid.flexDirection = 'row';
      styles.footerGrid.justifyContent = 'space-between';
      styles.fixedCta.display = 'none'; // Hide fixed CTA on desktop
    } else {
      styles.pcNav.display = 'none';
      styles.pcCTA.display = 'none';
      styles.hamburger.display = 'flex';
      styles.footerGrid.flexDirection = 'column';
      styles.fixedCta.display = 'block';
    }
  };
  window.addEventListener('resize', checkMedia);
  // Run once initially after small timeout to ensure DOM is ready
  setTimeout(checkMedia, 100);
}
