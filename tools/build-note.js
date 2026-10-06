// Gera assets/note.svg: a frase de fechamento e a disponibilidade, logo abaixo do journey.
// Uso: node tools/build-note.js
const fs = require('fs');
const path = require('path');
const { FAMILY, regular, bold } = require('./font');

const ABOUT = 'Design and development, end to end. Nothing is lost between concept and product.';
const OPEN = 'Open to new projects', WHAT = 'SaaS, branding &amp; interfaces';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 830 52" width="830" height="52" role="img" aria-label="${ABOUT} ${OPEN}: ${WHAT}.">
  <style>${regular} ${bold} text { font-family: ${FAMILY}; }</style>
  <text x="415" y="18" font-size="14" fill="#a8a8a8" text-anchor="middle">${ABOUT}</text>
  <text x="415" y="42" font-size="13" fill="#6b6b6b" text-anchor="middle"><tspan fill="#e0e0e0" font-weight="700">${OPEN}</tspan>: ${WHAT}</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'note.svg'), svg);
console.log('assets/note.svg ok');
