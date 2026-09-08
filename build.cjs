const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
for (const file of ['index.html', 'styles.css', 'data.js', 'art.js', 'engine.js', 'ui.js', 'main.js']) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
console.log('Sitio estático generado en dist/ (7 archivos).');
