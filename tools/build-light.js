// Gera assets/light/*.svg: versão para o tema claro do GitHub, a partir dos SVGs escuros.
// Uso: node tools/build-light.js   (rodar depois dos outros build-*.js)
// O README usa <picture>: o GitHub mostra a versão clara para quem usa o tema claro.
// Os ícones coloridos embutidos (<svg x=...> internos do journey) não são alterados.
// Celular (assets/mobile): o README só troca pela largura da tela, porque o GitHub reescreve a regra inteira das fontes
// com prefers-color-scheme quando a pessoa fixa um tema. Por isso o tema claro do celular vai dentro do próprio SVG:
// as mesmas trocas, em CSS, valendo quando o aparelho está no claro.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'assets');
const out = path.join(src, 'light');
fs.mkdirSync(out, { recursive: true });

// escuro → claro (fundos viram claros, textos e a logo viram escuros)
const LIGHT = {
  '#050505': '#ececec', '#e5e5e5': '#ffffff', '#3b3b3b': '#f7f7f7', '#020202': '#ececec', '#8e8e8e': '#ffffff', '#6e6e6e': '#f7f7f7',  // fundo grafite
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
// celular: o tema do aparelho dentro do SVG (refeito a cada rodada, sem duplicar)
const mobile = path.join(src, 'mobile');
const trocas = [...Object.entries(LIGHT), ...Object.entries(SHORT)];
const css = trocas.map(([de, para]) => ['fill', 'stroke', 'stop-color'].map((p) => `[${p}="${de}" i]:not(svg svg *){${p}:${para}}`).join('')).join('');
const tema = `<style data-tema="aparelho">@media (prefers-color-scheme: light){${css}}</style>`;
if (fs.existsSync(mobile)) {
  for (const f of fs.readdirSync(mobile).filter((f) => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(mobile, f), 'utf8').replace(/<style data-tema="aparelho">[\s\S]*?<\/style>\n?/, '');
    const fim = svg.lastIndexOf('</svg>');
    fs.writeFileSync(path.join(mobile, f), `${svg.slice(0, fim)}${tema}\n${svg.slice(fim)}`);
  }
}
console.log('assets/light/*.svg ok (+ tema do aparelho em assets/mobile)');
