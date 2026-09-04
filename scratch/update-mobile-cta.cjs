const fs = require('fs');
const path = require('path');

// 1. Update Common.jsx
const commonPath = path.join(__dirname, '..', 'src', 'components', 'Common.jsx');
let commonContent = fs.readFileSync(commonPath, 'utf8');

// Update Mobile Drawer CTA block in Header
const oldDrawerCTA = `              <a
                href="#consultation"
                onClick={(e) => handleLinkClick(e, '#consultation')}
                style={{ ...styles.drawerLink, color: 'var(--forest-green-main)', fontWeight: '600' }}
              >
                상담하기
              </a>`;

const newDrawerCTA = `              <button
                onClick={(e) => { setMenuOpen(false); onPhoneClick(); }}
                style={{ ...styles.drawerLink, color: 'var(--forest-green-main)', fontWeight: '600', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {contactConfig.phoneLabel}
              </button>
              <button
                onClick={(e) => { 
                  if (contactConfig.kakaoEnabled) {
                    setMenuOpen(false); 
                    onChatClick(); 
                  }
                }}
                style={{
                  ...styles.drawerLink,
                  color: 'var(--forest-green-main)',
                  fontWeight: '600',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  opacity: contactConfig.kakaoEnabled ? 1 : 0.6,
                  cursor: contactConfig.kakaoEnabled ? 'pointer' : 'not-allowed'
                }}
                aria-disabled={!contactConfig.kakaoEnabled}
              >
                {contactConfig.kakaoLabel}
              </button>`;

commonContent = commonContent.replace(oldDrawerCTA, newDrawerCTA);

// Update MobileFixedCTA component
const oldMobileFixedCTA = `export function MobileFixedCTA({ onPhoneClick, onChatClick }) {
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
}`;

const newMobileFixedCTA = `export function MobileFixedCTA({ onPhoneClick, onChatClick }) {
  return (
    <div style={styles.fixedCta}>
      <div style={styles.fixedCtaGrid}>
        <button style={styles.fixedCtaPhone} onClick={onPhoneClick}>
          {contactConfig.phoneLabel}
        </button>
        <button 
          style={{
            ...styles.fixedCtaChat,
            opacity: contactConfig.kakaoEnabled ? 1 : 0.6,
            cursor: contactConfig.kakaoEnabled ? 'pointer' : 'not-allowed'
          }} 
          onClick={contactConfig.kakaoEnabled ? onChatClick : undefined}
          aria-disabled={!contactConfig.kakaoEnabled}
        >
          {contactConfig.kakaoLabel}
        </button>
      </div>
    </div>
  );
}`;

commonContent = commonContent.replace(oldMobileFixedCTA, newMobileFixedCTA);

// Optimize button font size and whitespace to prevent text wrapping on narrow screens like 320px
commonContent = commonContent.replace(
  `  fixedCtaPhone: {
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
  },`,
  `  fixedCtaPhone: {
    backgroundColor: 'var(--white)',
    color: 'var(--forest-green-main)',
    border: '1px solid var(--forest-green-main)',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '0.95rem',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justify('center'),
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },`
);

// Note: fix typo in justify('center') replace
commonContent = commonContent.replace("justify('center'),", "");

commonContent = commonContent.replace(
  `  fixedCtaChat: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '1rem',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },`,
  `  fixedCtaChat: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '0.95rem',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },`
);

fs.writeFileSync(commonPath, commonContent, 'utf8');
console.log('Common.jsx updated successfully.');

// 2. Update App.jsx
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Update Hero Section CTA Buttons (supporting both PC and Mobile disabled state and labels)
const oldHeroCTA = `              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '12px',
                marginTop: '12px'
              }}>
                <PrimaryButton 
                  onClick={contactConfig.kakaoEnabled ? handleCTA : undefined}
                  style={{
                    opacity: (isDesktop && !contactConfig.kakaoEnabled) ? 0.6 : 1,
                    cursor: (isDesktop && !contactConfig.kakaoEnabled) ? 'not-allowed' : 'pointer'
                  }}
                  aria-disabled={isDesktop && !contactConfig.kakaoEnabled}
                >
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.kakaoLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>사진 상담</span>
                </PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.phoneLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>전화 문의</span>
                </SecondaryButton>
              </div>`;

const newHeroCTA = `              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '12px',
                marginTop: '12px'
              }}>
                <PrimaryButton 
                  onClick={contactConfig.kakaoEnabled ? handleCTA : undefined}
                  style={{
                    opacity: !contactConfig.kakaoEnabled ? 0.6 : 1,
                    cursor: !contactConfig.kakaoEnabled ? 'not-allowed' : 'pointer'
                  }}
                  aria-disabled={!contactConfig.kakaoEnabled}
                >
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.kakaoLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>{contactConfig.kakaoLabel}</span>
                </PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.phoneLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>{contactConfig.phoneLabel}</span>
                </SecondaryButton>
              </div>`;

// Update Space Guide Section Single Button -> Double Buttons for both PC & Mobile
const oldSpaceGuideCTA = `                <div style={{ marginTop: '8px' }}>
                  {isDesktop ? (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <SecondaryButton onClick={handlePhoneCall} style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: '48px', flex: 1 }}>
                        {contactConfig.phoneLabel}
                      </SecondaryButton>
                      <PrimaryButton 
                        onClick={contactConfig.kakaoEnabled ? handleCTA : undefined} 
                        style={{ 
                          fontSize: '0.9rem', 
                          padding: '10px 20px', 
                          minHeight: '48px', 
                          flex: 1,
                          opacity: contactConfig.kakaoEnabled ? 1 : 0.6,
                          cursor: contactConfig.kakaoEnabled ? 'pointer' : 'not-allowed'
                        }}
                        aria-disabled={!contactConfig.kakaoEnabled}
                      >
                        {contactConfig.kakaoLabel}
                      </PrimaryButton>
                    </div>
                  ) : (
                    <SecondaryButton onClick={handleCTA} style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: '48px' }}>
                      상세 정보 보기
                    </SecondaryButton>
                  )}
                </div>`;

const newSpaceGuideCTA = `                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <SecondaryButton onClick={handlePhoneCall} style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: '48px', flex: 1 }}>
                      {contactConfig.phoneLabel}
                    </SecondaryButton>
                    <PrimaryButton 
                      onClick={contactConfig.kakaoEnabled ? handleCTA : undefined} 
                      style={{ 
                        fontSize: '0.9rem', 
                        padding: '10px 20px', 
                        minHeight: '48px', 
                        flex: 1,
                        opacity: contactConfig.kakaoEnabled ? 1 : 0.6,
                        cursor: contactConfig.kakaoEnabled ? 'pointer' : 'not-allowed'
                      }}
                      aria-disabled={!contactConfig.kakaoEnabled}
                    >
                      {contactConfig.kakaoLabel}
                    </PrimaryButton>
                  </div>
                </div>`;

// Update Bottom Inquiry Section CTA Buttons
const oldBottomCTA = `              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '12px'
              }}>
                <PrimaryButton 
                  onClick={contactConfig.kakaoEnabled ? handleCTA : undefined}
                  style={{
                    opacity: (isDesktop && !contactConfig.kakaoEnabled) ? 0.6 : 1,
                    cursor: (isDesktop && !contactConfig.kakaoEnabled) ? 'not-allowed' : 'pointer'
                  }}
                  aria-disabled={isDesktop && !contactConfig.kakaoEnabled}
                >
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.kakaoLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>사진 상담</span>
                </PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.phoneLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>전화 문의</span>
                </SecondaryButton>
              </div>`;

const newBottomCTA = `              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '12px'
              }}>
                <PrimaryButton 
                  onClick={contactConfig.kakaoEnabled ? handleCTA : undefined}
                  style={{
                    opacity: !contactConfig.kakaoEnabled ? 0.6 : 1,
                    cursor: !contactConfig.kakaoEnabled ? 'not-allowed' : 'pointer'
                  }}
                  aria-disabled={!contactConfig.kakaoEnabled}
                >
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.kakaoLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>{contactConfig.kakaoLabel}</span>
                </PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>{contactConfig.phoneLabel}</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>{contactConfig.phoneLabel}</span>
                </SecondaryButton>
              </div>`;

appContent = appContent.replace(/\r\n/g, '\n');
appContent = appContent.replace(oldHeroCTA.replace(/\r\n/g, '\n'), newHeroCTA.replace(/\r\n/g, '\n'));
appContent = appContent.replace(oldSpaceGuideCTA.replace(/\r\n/g, '\n'), newSpaceGuideCTA.replace(/\r\n/g, '\n'));
appContent = appContent.replace(oldBottomCTA.replace(/\r\n/g, '\n'), newBottomCTA.replace(/\r\n/g, '\n'));

fs.writeFileSync(appPath, appContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('App.jsx updated successfully.');
