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
    if (/\\u[0-9a-fA-F]{4}/.test(content)) {
        console.log(`Unescaping: ${file}`);
        const unescaped = content.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        });
        fs.writeFileSync(file, unescaped, 'utf8');
    }
});
