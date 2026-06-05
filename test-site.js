const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let errorCount = 0;

console.log('Starting local link and asset checker...\n');

// Find all HTML files recursively in the directory
function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.github') {
                results = results.concat(getHtmlFiles(filePath));
            }
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
}

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to scan:\n${htmlFiles.map(f => ' - ' + path.relative(rootDir, f)).join('\n')}\n`);

htmlFiles.forEach(htmlPath => {
    const relativeHtmlPath = path.relative(rootDir, htmlPath);
    console.log(`Checking ${relativeHtmlPath}...`);
    const content = fs.readFileSync(htmlPath, 'utf8');

    // Extract linkages using regex (href="..." or src="...")
    const regex = /(?:href|src)=["']([^"']+)["']/g;
    let match;
    const links = [];

    while ((match = regex.exec(content)) !== null) {
        links.push(match[1]);
    }

    links.forEach(link => {
        // Skip absolute URLs, anchors, mailto, tel
        if (
            link.startsWith('http://') || 
            link.startsWith('https://') || 
            link.startsWith('mailto:') || 
            link.startsWith('tel:') || 
            link.startsWith('#') ||
            link === ''
        ) {
            return;
        }

        // Clean link from query parameters (e.g. ?v=2.2) and anchors (e.g. #L1)
        let cleanLink = link.split('?')[0].split('#')[0];
        
        // Skip empty links after cleaning
        if (!cleanLink) return;

        // Resolve link path relative to the directory of the current HTML file
        const htmlDir = path.dirname(htmlPath);
        const targetPath = path.resolve(htmlDir, decodeURIComponent(cleanLink));

        // Check if file exists
        if (!fs.existsSync(targetPath)) {
            console.error(`  [ERROR] Broken link: "${link}" -> Resolved to missing file: "${path.relative(rootDir, targetPath)}"`);
            errorCount++;
        } else {
            // Verify file name casing matches exactly (crucial for Linux case-sensitive filesystems like GitHub Pages)
            const targetDir = path.dirname(targetPath);
            const targetBasename = path.basename(targetPath);
            const filesInDir = fs.readdirSync(targetDir);
            if (!filesInDir.includes(targetBasename)) {
                console.error(`  [ERROR] Casing mismatch: "${link}" -> File exists but case does not match on disk.`);
                errorCount++;
            }
        }
    });
});

console.log('\n----------------------------------------');
if (errorCount > 0) {
    console.error(`FAILED: Found ${errorCount} broken link(s)/asset reference(s).`);
    process.exit(1);
} else {
    console.log('SUCCESS: All internal links and asset references verified.');
    process.exit(0);
}
