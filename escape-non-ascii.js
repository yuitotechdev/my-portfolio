const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.resolve(__dirname, 'src'));

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (/[^\x00-\x7F]/.test(content)) {
        console.log(`Processing: ${file}`);
        const escaped = content.replace(/[^\x00-\x7F]/g, c => {
            return '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
        });
        fs.writeFileSync(file, escaped, 'utf8');
    }
});
