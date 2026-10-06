// Bricolage Grotesque (a fonte do portfolio) embutida nos SVGs: imagem do README não carrega fonte de fora.
// tools/fonts: recortes estáticos feitos com subset-font (ASCII em 400 e 700 no opsz 14; números em 700 no opsz 36).
// Licença da fonte: tools/fonts/OFL.txt.
const fs = require('fs');
const path = require('path');

const face = (family, weight, file) => {
  const b64 = fs.readFileSync(path.join(__dirname, 'fonts', file)).toString('base64');
  return `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/woff2;base64,${b64}) format("woff2"); }`;
};

exports.FAMILY = '"Bricolage Grotesque", "Segoe UI", Helvetica, Arial, sans-serif';
exports.DISPLAY = '"Bricolage Display", "Bricolage Grotesque", "Segoe UI", Helvetica, Arial, sans-serif';
exports.regular = face('Bricolage Grotesque', 400, 'bricolage-400.woff2');
exports.bold = face('Bricolage Grotesque', 700, 'bricolage-700.woff2');
exports.display = face('Bricolage Display', 700, 'bricolage-700-display.woff2');
