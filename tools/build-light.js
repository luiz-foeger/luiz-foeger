// Gera assets/light/*.svg: versão para o tema claro do GitHub, a partir dos SVGs escuros.
// Uso: node tools/build-light.js   (rodar depois dos outros build-*.js)
// O README usa <picture>: o GitHub mostra a versão clara para quem usa o tema claro.
// Os ícones coloridos embutidos (<svg x=...> internos do journey) não são alterados.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'assets');
const out = path.join(src, 'light');
fs.mkdirSync(out, { recursive: true });

// escuro → claro (fundos viram claros, textos e a logo viram escuros)
const LIGHT = {
  '#0a0a0a': '#ffffff', '#101010': '#f6f6f6', '#111111': '#f4f4f4', '#141414': '#f2f2f2',
  '#1a1a1a': '#ececec', '#1b1b1b': '#eaeaea', '#1f1f1f': '#e4e4e4', '#262626': '#dedede', '#2a2a2a': '#dadada',
  '#2e2e2e': '#d4d4d4', '#333333': '#cfcfcf', '#3a3a3a': '#c4c4c4', '#3f3f3f': '#bdbdbd',
  '#4a4a4a': '#9a9a9a', '#4f4f4f': '#949494', '#5a5a5a': '#8a8a8a', '#6b6b6b': '#6f6f6f',
  '#7a7a7a': '#8c8c8c', '#8a8a8a': '#6a6a6a', '#a8a8a8': '#555555', '#bdbdbd': '#444444',
  '#e0e0e0': '#1f1f1f', '#e6e6e6': '#1a1a1a', '#f2f2f2': '#111111', '#ffffff': '#0a0a0a',
};
const SHORT = { '#fff': '#0a0a0a' };

const toLight = (svg) => svg
  .split(/(<svg x="[\s\S]*?<\/svg>)/g)
  .map((part, i) => (i % 2 ? part : part
    .replace(/#[0-9a-fA-F]{6}\b/g, (c) => LIGHT[c.toLowerCase()] || c)
    .replace(/"#fff"/g, `"${SHORT['#fff']}"`)))
  .join('');

for (const f of fs.readdirSync(src).filter((f) => f.endsWith('.svg'))) {
  fs.writeFileSync(path.join(out, f), toLight(fs.readFileSync(path.join(src, f), 'utf8')));
}
console.log('assets/light/*.svg ok');
