import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

// Update debug_redirect.js
let debugContent = fs.readFileSync(path.join(workspaceRoot, 'scratch/debug_redirect.js'), 'utf-8');
debugContent = debugContent.replace(/%EB%B9%84%EC%82%B5%EB%8F%99/g, '%EB%B9%84%EC%82%B0%EB%8F%99');
fs.writeFileSync(path.join(workspaceRoot, 'scratch/debug_redirect.js'), debugContent, 'utf-8');

// Update regression_test.js
let regressionContent = fs.readFileSync(path.join(workspaceRoot, 'scratch/regression_test.js'), 'utf-8');
regressionContent = regressionContent.replace(/%EB%B9%84%EC%82%B5%EB%8F%99/g, '%EB%B9%84%EC%82%B0%EB%8F%99');
fs.writeFileSync(path.join(workspaceRoot, 'scratch/regression_test.js'), regressionContent, 'utf-8');

console.log('Successfully corrected percent encoding in test scripts.');

