const fs = require('fs');
const path = require('path');

// 1. Update App.jsx
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Replace import
appContent = appContent.replace(
  "import { siteConfig } from './config';",
  "import { siteConfig, contactConfig } from './config';"
);

// Replace handleCTA and handlePhoneCall
const oldHandlers = `  const handleCTA = () => {
    window.open(siteConfig.consultationUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneCall = () => {
    window.location.href = \`tel:\${siteConfig.phoneNumber.replace(/-/g, '')}\`;
  };`;

const newHandlers = `  const handleCTA = () => {
    if (contactConfig.kakaoEnabled && contactConfig.kakaoChannelUrl) {
      window.open(contactConfig.kakaoChannelUrl, '_blank', 'noopener,noreferrer');
    } else if (siteConfig.consultationUrl) {
      window.open(siteConfig.consultationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePhoneCall = () => {
    window.location.href = \`tel:\${contactConfig.phoneNumber.replace(/-/g, '')}\`;
  };`;

// Standardize line endings to LF first for search, then restore if needed
const lfAppContent = appContent.replace(/\r\n/g, '\n');
const lfOldHandlers = oldHandlers.replace(/\r\n/g, '\n');
const lfNewHandlers = newHandlers.replace(/\r\n/g, '\n');

if (lfAppContent.includes(lfOldHandlers)) {
  const updatedLfContent = lfAppContent.replace(lfOldHandlers, lfNewHandlers);
  fs.writeFileSync(appPath, updatedLfContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('App.jsx updated successfully.');
} else {
  console.error('Could not find handlers in App.jsx');
}

// 2. Update Common.jsx
const commonPath = path.join(__dirname, '..', 'src', 'components', 'Common.jsx');
let commonContent = fs.readFileSync(commonPath, 'utf8');

// Replace import in Common.jsx
commonContent = commonContent.replace(
  "import { siteConfig } from '../config';",
  "import { siteConfig, contactConfig } from '../config';"
);

// Replace footer phone display to use contactConfig
commonContent = commonContent.replace(
  "대표번호: {siteConfig.phoneNumber}",
  "대표번호: {contactConfig.phoneNumber}"
);

fs.writeFileSync(commonPath, commonContent, 'utf8');
console.log('Common.jsx updated successfully.');
