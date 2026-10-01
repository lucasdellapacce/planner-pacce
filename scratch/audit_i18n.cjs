const fs = require('fs');
const path = require('path');

const dirs = [
    'src/routes',
    'src/lib/components',
    'src/lib/templates',
    'src/lib/panels',
    'src/lib/modals'
];

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.svelte') || fullPath.endsWith('.ts')) {
            auditFile(fullPath);
        }
    }
}

function auditFile(file) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
        // Skip obvious translated lines or comments
        if (line.includes('i18n.t') || line.includes('$t(') || line.includes('t(')) return;
        if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;
        
        // Match common patterns:
        // 1. Text inside HTML tags containing words
        // 2. Specific attributes
        // 3. JS return strings or object properties
        
        const htmlTextMatch = line.match(/>([^<{}]+)</);
        let hasHtmlText = false;
        if (htmlTextMatch) {
            const text = htmlTextMatch[1].trim();
            // If it has letters and is not just a symbol
            if (/[a-zA-Z]{2,}/.test(text) && !/^[A-Z0-9_]+$/.test(text) && !['true', 'false', 'null', 'undefined'].includes(text)) {
                hasHtmlText = true;
            }
        }
        
        const hasAttribute = /(placeholder|title|label|text)=["'][A-Z][a-zA-Z\s\.]+["']/.test(line);
        const hasJsString = /(return|label:|name:|description:|title:|message:)\s*['"][A-Z][a-zA-Z\s\.]+['"]/.test(line);
            
        if (hasHtmlText || hasAttribute || hasJsString) {
            console.log(`File: ${file} | Line ${index + 1}: ${line.trim()}`);
        }
    });
}

dirs.forEach(scanDir);
