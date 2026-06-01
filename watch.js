const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const watchDir = path.join(__dirname, 'src');
console.log(`\x1b[36m%s\x1b[0m`, `[Stellar Watcher] Starting... Watching directory: ${watchDir}`);

// Initial compilation
compile();

let fsWait = false;
// Watch the directory
fs.watch(watchDir, (eventType, filename) => {
    if (filename) {
        if (fsWait) return;
        // Debounce to prevent multiple fires on a single save
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 100);

        console.log(`\x1b[33m%s\x1b[0m`, `[Stellar Watcher] Change detected in ${filename}. Recompiling...`);
        compile();
    }
});

function compile() {
    exec('node encrypt.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`\x1b[31m%s\x1b[0m`, `[Stellar Build Error]: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`\x1b[31m%s\x1b[0m`, `[Stellar Build Error]: ${stderr}`);
            return;
        }
        console.log(`\x1b[32m%s\x1b[0m`, `[Stellar Watcher] Build Successful! root index.html updated.`);
    });
}
