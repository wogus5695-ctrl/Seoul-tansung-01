import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

let seoFile = fs.readFileSync(path.join(workspaceRoot, 'api/seo.js'), 'utf-8');
seoFile = seoFile.replace(/\r\n/g, '\n');

const redirectStartBlock = '  // 301 Permanent Redirect logic for old joined error URLs\n  // e.g. 고양시-백석동-탄성코트 -> 백석동-탄성코트\n  if (kParam) {';
const redirectEndBlock = '  // Read index.html compiled template from the deployment output';

const startIdx = seoFile.indexOf(redirectStartBlock);
const endIdx = seoFile.indexOf(redirectEndBlock);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find redirect block in api/seo.js');
  process.exit(1);
}

const newRedirectCode = `  // 301 Permanent Redirect logic for old joined error URLs and long keywords
  // e.g. 부평구-산곡동-탄성코트 -> 부평-산곡동-탄성코트, 안양-비산동-탄성코트 -> bisan-dong-탄성코트
  if (kParam) {
    const sortedKeywords = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);
    let matchedService = null;
    let prefix = '';
    
    for (const s of sortedKeywords) {
      if (kParam.endsWith(\`-\${s.keyword}\`)) {
        matchedService = s;
        prefix = kParam.substring(0, kParam.length - s.keyword.length - 1);
        break;
      }
    }

    if (matchedService && prefix) {
      // Find if prefix matches any clean routeKey
      const directMatch = keywordMetadata.find(km => km.routeKey === prefix);
      let targetRouteKey = null;

      if (directMatch) {
        // Already clean or matched
      } else {
        // If not direct match, extract parent prefix and clean dong name
        const parts = prefix.split('-');
        const dongName = parts[parts.length - 1];
        const parentPrefix = parts.slice(0, -1).join('-');

        const candidates = keywordMetadata.filter(km => km.displayRegion === dongName && km.type === 'dong');
        if (candidates.length === 1) {
          targetRouteKey = candidates[0].routeKey;
        } else if (candidates.length > 1 && parentPrefix) {
          const cleanParentPrefix = parentPrefix.replace(/구$/, '').replace(/시$/, '');
          const matchedTarget = candidates.find(cand => {
            const parentClean = cand.parentRegion.replace(/구/g, '').replace(/시/g, '').replace(/권/g, '');
            return parentClean.includes(cleanParentPrefix);
          });
          if (matchedTarget) {
            targetRouteKey = matchedTarget.routeKey;
          }
        }
      }

      if (targetRouteKey) {
        const redirectUrl = \`https://www.barumspace.co.kr/?k=\${encodeURIComponent(targetRouteKey + '-' + matchedService.keyword)}\`;
        res.setHeader('Location', redirectUrl);
        return res.status(301).end();
      }
    }
  }
`;

seoFile = seoFile.substring(0, startIdx) + newRedirectCode + '\n  ' + seoFile.substring(endIdx);

// Make sure keywordMetadata is imported in api/seo.js
if (!seoFile.includes("import { keywordMetadata }")) {
  seoFile = "import { keywordMetadata } from '../src/data/keywordMetadata.js';\n" + seoFile;
}

fs.writeFileSync(path.join(workspaceRoot, 'api/seo.js'), seoFile, 'utf-8');
console.log('Successfully updated redirects in api/seo.js');

