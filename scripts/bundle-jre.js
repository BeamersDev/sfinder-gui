/**
 * Bundle a minimal JRE using jlink for sfinder-gui.
 *
 * Usage: node scripts/bundle-jre.js
 *
 * Requires: JDK 17+ with jlink on PATH
 * Output: src-tauri/binaries/jre/
 *
 * The bundled JRE includes only the modules needed to run sfinder.jar.
 * Size: ~35-40 MB (vs ~180 MB full JDK)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'src-tauri', 'binaries', 'jre');
const MODULES = [
  'java.base',
  'java.logging',
  'java.desktop',   // needed by some Haxe runtime features
  'java.management',
];

function main() {
  // Check jlink
  try {
    execSync('jlink --version', { stdio: 'pipe' });
  } catch {
    console.error('jlink not found. Install JDK 17+ and ensure jlink is on PATH.');
    process.exit(1);
  }

  // Clean output
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const modules = MODULES.join(',');
  const cmd = `jlink --no-header-files --no-man-pages --compress=2 --strip-debug --add-modules ${modules} --output "${OUT_DIR}"`;

  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });

  // Verify
  const javaExe = process.platform === 'win32' ? 'java.exe' : 'java';
  const javaPath = path.join(OUT_DIR, 'bin', javaExe);
  if (fs.existsSync(javaPath)) {
    const size = getDirSize(OUT_DIR);
    console.log(`\nJRE bundled: ${javaPath}`);
    console.log(`Size: ${(size / 1024 / 1024).toFixed(1)} MB`);
  } else {
    console.error('JRE bundle failed — java executable not found.');
    process.exit(1);
  }
}

function getDirSize(dir) {
  let size = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) size += getDirSize(full);
    else size += fs.statSync(full).size;
  }
  return size;
}

main();
