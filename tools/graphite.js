// Fundo grafite, a estética do banner do LinkedIn ("Do commit ao deploy."): preto, luz branca desfocada e grão por cima.
// bg(x, y, w, h, raio, manchas) devolve o <defs> e as camadas do fundo, recortadas no retângulo de cantos redondos.
// manchas: [cx, cy, raio, desfoque, cor, estica], como no banner (cada mancha é um disco desfocado, perfil erfc ≈ desfoque
// gaussiano); estica (opcional) alarga a mancha na horizontal, para a luz correr mais para os lados sem ficar mais forte.
// Cores próprias para o tema claro (tools/build-light.js): base #050505, luz #e5e5e5, penumbra #3b3b3b, sombra #020202, luzes mais fracas #8e8e8e e #6e6e6e.
const erfc = (x) => {
  const z = Math.abs(x), t = 1 / (1 + .5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (.37409196 + t * (.09678418 + t * (-.18628806 + t * (.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-.82215223 + t * .17087277)))))))));
  return x >= 0 ? r : 2 - r;
};

exports.LUZ = '#e5e5e5';
exports.PENUMBRA = '#3b3b3b';
exports.SOMBRA = '#020202';
exports.LUZ_SUAVE = '#8e8e8e';
exports.LUZ_FRACA = '#6e6e6e';

exports.bg = (x, y, w, h, r, manchas = []) => {
  const grads = manchas.map(([cx, cy, raio, desf, cor, estica = 1], i) => {
    const fim = raio + 3 * desf;
    const stops = Array.from({ length: 16 }, (_, k) => {
      const d = (fim * k) / 15, a = .5 * erfc((d - raio) / (desf * Math.SQRT2));
      return `<stop offset="${(k / 15).toFixed(3)}" stop-color="${cor}" stop-opacity="${a.toFixed(3)}"/>`;
    }).join('');
    const alarga = estica === 1 ? '' : ` gradientTransform="translate(${cx} ${cy}) scale(${estica} 1) translate(${-cx} ${-cy})"`;
    return `<radialGradient id="luz${i}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${fim.toFixed(1)}"${alarga}>${stops}</radialGradient>`;
  }).join('\n    ');
  const area = `x="${x}" y="${y}" width="${w}" height="${h}"`;
  return `<defs>
    <clipPath id="canto"><rect ${area} rx="${r}"/></clipPath>
    ${grads}
    <filter id="grao" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 0 1"/>
    </filter>
  </defs>
  <g clip-path="url(#canto)">
    <rect ${area} fill="#050505"/>
    ${manchas.map((_, i) => `<rect ${area} fill="url(#luz${i})"/>`).join('\n    ')}
    <rect ${area} filter="url(#grao)" opacity=".3" style="mix-blend-mode: overlay"/>
  </g>`;
};
