// Gera assets/header.svg a partir dos vetores do logo do portfolio (AnimatedLogoHeader.tsx)
// Uso: node tools/build-header.js
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'assets');
const { bg, LUZ, PENUMBRA, SOMBRA } = require('./graphite');

const letters = [
  { id: 'f',       d: 'M0.52832 94.6189L44.5283 735.119L278.528 648.619L232.028 435.619L394.528 413.119L363.028 267.119L205.528 312.619L185.528 233.119L431.028 214.119L424.528 0.618896L0.52832 94.6189Z' },
  { id: 'oBody',   d: 'M386.528 589.619L435.528 299.619L689.028 249.119L770.028 368.619L755.028 636.619L478.528 694.619L386.528 589.619ZM547.028 379.619L523.528 538.119L645.028 551.619L635.028 386.119L547.028 379.619Z', evenodd: true },
  { id: 'oDotL',   d: 'M464.528 107.619L471.528 226.619L586.528 218.119L578.528 100.119L464.528 107.619Z' },
  { id: 'oDotR',   d: 'M634.528 86.6189L622.528 203.119L737.028 214.119L747.028 96.1189L634.528 86.6189Z' },
  { id: 'eTop',    d: 'M785.528 575.119L909.528 691.119L1176.53 641.619L1195.03 504.619L943.528 537.119L925.028 504.619L1195.03 441.619L1168.03 251.619L1047.03 202.119L819.028 260.119L785.528 575.119ZM929.528 335.119L917.028 406.119L1062.53 373.619L1045.53 335.119H929.528Z', evenodd: true },
  { id: 'g',       d: 'M26.5283 1046.12L42.5283 783.619L228.028 715.119L285.528 753.119V692.119L472.028 728.619L455.028 850.619L418.028 858.119L468.528 1226.12L367.028 1353.12L55.5283 1316.62L77.5283 1165.62L282.528 1195.62L301.028 1109.62L180.028 1139.62L26.5283 1046.12ZM180.028 858.119L172.028 982.119L282.528 1014.12V875.119L180.028 858.119Z', evenodd: true },
  { id: 'eBottom', d: 'M464.528 1001.12L474.528 872.119L541.528 723.119L731.528 680.619L864.528 733.619L892.528 923.119L618.528 980.119L632.528 1006.12L889.528 1029.62L839.528 1177.62L529.528 1111.12L464.528 1001.12ZM626.028 807.619L610.028 879.619L759.028 851.119L744.028 814.119L626.028 807.619Z', evenodd: true },
  { id: 'r',       d: 'M926.528 871.119L907.028 1171.12L1104.53 1133.12L1052.53 855.619L1097.53 830.619L1126.03 859.119L1129.53 901.119L1237.53 859.119L1258.03 737.619L1135.03 683.619L1038.53 759.619V701.119L892.028 732.619L926.528 871.119Z' },
  { id: 'dot',     d: 'M1303.53 1145.12L1156.53 1134.62L1163.03 1011.12L1291.53 997.619L1303.53 1145.12Z' },
];

// mesmos valores do portfolio: movements (posição em linha)
const inline = {
  f: [-110, 260, 2], oBody: [-105, 260, -2], oDotL: [-105, 260, 2], oDotR: [-105, 260, -2], eTop: [-95, 250, 2],
  g: [1100, -250, -2], eBottom: [1100, -250, 2], r: [1120, -250, -2], dot: [1120, -250, 2],
};

// ---------- layout: logo centralizada no banner 1200×300 (fundo grafite, como o banner do LinkedIn) ----------
const W = 440;                          // largura em linha ≈ 2533 → 440px (37% do banner, a proporção da frase do LinkedIn)
const S = W / 2533;
const X = (1200 - W) / 2;
const Y = (300 - 843 * S) / 2;          // altura em linha ≈ 843
const tx = (X + 110 * S).toFixed(1);    // bbox em linha começa em x = -110
const ty = (Y - 260 * S).toFixed(1);    // e em y = 260
const SW = (1.3 / S).toFixed(1);        // traço do contorno ≈ 1.3px na tela

const place = (l) => { const [x, y, r] = inline[l.id]; return `class="place" style="transform: translate(${x}px, ${y}px) rotate(${r}deg)"`; };
const rule = (l) => (l.evenodd ? ' fill-rule="evenodd"' : '');
const logo = [
  ...letters.map(l => `    <g ${place(l)}><path class="draw" fill="none" stroke="#ffffff" stroke-width="${SW}" pathLength="1" d="${l.d}"/></g>`),
  ...letters.map(l => `    <g ${place(l)}><path class="fill" fill="#ffffff"${rule(l)} d="${l.d}"/></g>`),
].join('\n');

const header = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300" role="img" aria-label="föeger.">
  <style>
    .place { transform-box: fill-box; transform-origin: center; }
    .draw  { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.6s ease-in-out .3s forwards, gone .6s ease-out 2.3s forwards; }
    .fill  { opacity: 0; animation: fade .7s ease-out 1.9s forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes fade { to { opacity: 1; } }
    @keyframes gone { to { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) {
      .draw { opacity: 0; animation: none; }
      .fill { opacity: 1; animation: none; }
    }
  </style>

  <!-- canvas: preto, a luz desfocada no canto e o grão (tools/graphite.js) -->
  ${bg(0, 0, 1200, 300, 16, [[1076, 15, 250, 91, LUZ], [871, 288, 227, 91, PENUMBRA], [197, 288, 288, 197, SOMBRA], [1212, 0, 182, 152, SOMBRA]])}

  <!-- logo: vetores do portfolio; o contorno se desenha e é preenchido -->
  <g transform="translate(${tx} ${ty}) scale(${S.toFixed(5)})">
${logo}
  </g>
</svg>
`;

fs.writeFileSync(path.join(out, 'header.svg'), header);
console.log('assets/header.svg ok');
