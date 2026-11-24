// Gera assets/note.svg: a frase de fechamento e a disponibilidade, logo abaixo do journey.
// Uso: node tools/build-note.js
const fs = require('fs');
const path = require('path');
const { FAMILY, regular, semibold, bold } = require('./font');

const ABOUT = 'Connecting design and development, from concept to product.';
const OPEN = 'Open to new projects', WHAT = 'web apps, SaaS &amp; interfaces';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 830 46" width="830" height="46" role="img" aria-label="${ABOUT} ${OPEN}: ${WHAT}.">
  <style>${regular} ${semibold} ${bold} text { font-family: ${FAMILY}; }</style>
  <text x="415" y="18" font-size="15" font-weight="600" letter-spacing="-.3" fill="#ffffff" text-anchor="middle">${ABOUT}</text>
  <text x="415" y="42" font-size="13" fill="#6b6b6b" text-anchor="middle"><tspan fill="#e0e0e0" font-weight="700">${OPEN}</tspan>: ${WHAT}</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'note.svg'), svg);

// celular (assets/mobile): 400 de largura, a frase quebrada em duas linhas para caber com letra legível
const [L1, L2] = ['Connecting design and development,', 'from concept to product.'];
const mobile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" width="400" height="80" role="img" aria-label="${ABOUT} ${OPEN}: ${WHAT}.">
  <style>${regular} ${semibold} ${bold} text { font-family: ${FAMILY}; }</style>
  <text x="200" y="20" font-size="17" font-weight="600" letter-spacing="-.34" fill="#ffffff" text-anchor="middle">${L1}</text>
  <text x="200" y="42" font-size="17" font-weight="600" letter-spacing="-.34" fill="#ffffff" text-anchor="middle">${L2}</text>
  <text x="200" y="72" font-size="13" fill="#6b6b6b" text-anchor="middle"><tspan fill="#e0e0e0" font-weight="700">${OPEN}</tspan>: ${WHAT}</text>
</svg>
`;
fs.mkdirSync(path.join(__dirname, '..', 'assets', 'mobile'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'mobile', 'note.svg'), mobile);
console.log('assets/note.svg ok (+ mobile)');
