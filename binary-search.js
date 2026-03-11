const fs = require('fs');
const path = require('path');

const targetBytes = Buffer.from('制作実績', 'utf8');

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.resolve(dir, file);
        if (file === '.next' || file === 'node_modules' || file === '.git') return;

        try {
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                walk(fullPath);
            } else if (stat.isFile()) {
                const buffer = fs.readFileSync(fullPath);
                if (buffer.includes(targetBytes)) {
                    console.log(`FOUND IN: ${fullPath}`);
                }
            }
        } catch (e) {
            // Ignore errors for system files
        }
    });
}

walk(path.resolve(__dirname));
