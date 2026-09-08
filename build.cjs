const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const out = path.join(root, 'dist');
fs.mkdirSync(path.join(out, 'js'), { recursive: true });
for (const file of ['index.html', 'styles.css']) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
for (const file of ['data.js', 'art.js', 'engine.js', 'ui.js', 'main.js']) {
  fs.copyFileSync(path.join(root, 'js', file), path.join(out, 'js', file));
}
console.log('Sitio estático generado en dist/ (7 archivos).');
