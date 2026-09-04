const fs = require('fs');
const path = require('path');

// 1. Update Common.jsx
const commonPath = path.join(__dirname, '..', 'src', 'components', 'Common.jsx');
let commonContent = fs.readFileSync(commonPath, 'utf8');

// Update Header parameter
commonContent = commonContent.replace(
  "export function Header({ onNavigate, currentPath }) {",
  "export function Header({ onNavigate, currentPath, onPhoneClick, onChatClick }) {"
);

// Update PC Right CTA block in Header
const oldHeaderCTA = `        {/* PC Right CTA */}
        <div style={styles.pcCTA}>
          <a href="#consultation" onClick={(e) => handleLinkClick(e, '#consultation')} style={styles.headerCTA}>
            상담하기
          </a>
        </div>`;

const newHeaderCTA = `        {/* PC Right CTA */}
        <div style={{ ...styles.pcCTA, display: styles.pcCTA.display, gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={onPhoneClick} 
            style={styles.headerPhoneCTA}
          >
            {contactConfig.phoneLabel}
          </button>
          <button 
            onClick={contactConfig.kakaoEnabled ? onChatClick : undefined} 
            style={{
              ...styles.headerKakaoCTA,
              opacity: contactConfig.kakaoEnabled ? 1 : 0.6,
              cursor: contactConfig.kakaoEnabled ? 'pointer' : 'not-allowed'
            }}
            aria-disabled={!contactConfig.kakaoEnabled}
          >
            {contactConfig.kakaoLabel}
          </button>
        </div>`;

commonContent = commonContent.replace(oldHeaderCTA, newHeaderCTA);

// Add styles
commonContent = commonContent.replace(
  `  headerCTA: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    padding: '8px 18px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },`,
  `  headerCTA: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    padding: '8px 18px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  headerPhoneCTA: {
    backgroundColor: 'transparent',
    color: 'var(--forest-green-main)',
    border: '1px solid var(--forest-green-main)',
    padding: '8px 18px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  headerKakaoCTA: {
    backgroundColor: 'var(--forest-green-main)',
    color: 'var(--white)',
    border: '1px solid var(--forest-green-main)',
    padding: '8px 18px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },`
);

// Update checkMedia to set pcCTA display to flex instead of block
commonContent = commonContent.replace(
  "styles.pcCTA.display = 'block';",
  "styles.pcCTA.display = 'flex';\n      styles.pcCTA.gap = '8px';"
);

fs.writeFileSync(commonPath, commonContent, 'utf8');
console.log('Common.jsx updated successfully.');

// 2. Update App.jsx
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Update Header instantiation in App.jsx
appContent = appContent.replace(
  "<Header onNavigate={navigate} currentPath={path} />",
  "<Header onNavigate={navigate} currentPath={path} onPhoneClick={handlePhoneCall} onChatClick={handleCTA} />"
);

// Update Hero Section CTA Buttons
const oldHeroCTA = `              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '12px',
                marginTop: '12px'
              }}>
                <PrimaryButton onClick={handleCTA}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>사진으로 시공 상담</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>사진 상담</span>
                </PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>전화로 바로 문의</span>
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

// Standardize endings and replace
appContent = appContent.replace(/\r\n/g, '\n').replace(oldHeroCTA.replace(/\r\n/g, '\n'), newHeroCTA.replace(/\r\n/g, '\n'));

// Update Space Guide Section Single Button
const oldSpaceGuideCTA = `                <div style={{ marginTop: '8px' }}>
                  <SecondaryButton onClick={handleCTA} style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: '48px' }}>
                    상세 정보 보기
                  </SecondaryButton>
                </div>`;

const newSpaceGuideCTA = `                <div style={{ marginTop: '8px' }}>
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
                          opacity: contactConfig.kakaoEnabled ? 0.6 : 1,
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

// Replace in appContent (checking kakaoEnabled logic logic swap in styling)
const fixedNewSpaceGuideCTA = newSpaceGuideCTA.replace('opacity: contactConfig.kakaoEnabled ? 0.6 : 1', 'opacity: contactConfig.kakaoEnabled ? 1 : 0.6');
appContent = appContent.replace(oldSpaceGuideCTA.replace(/\r\n/g, '\n'), fixedNewSpaceGuideCTA.replace(/\r\n/g, '\n'));

// Update Bottom Inquiry Section CTA Buttons
const oldBottomCTA = `              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '12px'
              }}>
                <PrimaryButton onClick={handleCTA}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>사진 상담하기</span>
                  <span className="cta-mobile-only" style={{ display: isDesktop ? 'none' : 'inline' }}>사진 상담</span>
                </PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>
                  <span className="cta-pc-only" style={{ display: isDesktop ? 'inline' : 'none' }}>전화 상담하기</span>
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

appContent = appContent.replace(oldBottomCTA.replace(/\r\n/g, '\n'), newBottomCTA.replace(/\r\n/g, '\n'));

fs.writeFileSync(appPath, appContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('App.jsx updated successfully.');
