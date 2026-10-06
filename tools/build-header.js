// Gera assets/header.svg a partir dos vetores do logo do portfolio (AnimatedLogoHeader.tsx)
// Uso: node tools/build-header.js
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'assets');
const { FAMILY, bold } = require('./font');

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

// ---------- layout: logo centralizada no banner 1200×300 ----------
const W = 560;                          // largura em linha ≈ 2533 → 560px
const S = W / 2533;
const X = (1200 - W) / 2;
const Y = (300 - 843 * S) / 2;          // altura em linha ≈ 843
const tx = (X + 110 * S).toFixed(1);    // bbox em linha começa em x = -110
const ty = (Y - 260 * S).toFixed(1);    // e em y = 260
const SW = (1.3 / S).toFixed(1);        // traço do contorno ≈ 1.3px na tela

// ---------- cursor: traz o ponto final, solta e sai para o lado ----------
const dot = letters.find(l => l.id === 'dot');
const n = dot.d.match(/[\d.]+/g).map(Number);
const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1);
const dotX = X + (110 + (Math.min(...xs) + Math.max(...xs)) / 2 + inline.dot[0]) * S;
const dotY = Y + (-260 + (Math.min(...ys) + Math.max(...ys)) / 2 + inline.dot[1]) * S;
const from = [1100, 330];                                  // entra pelo canto inferior direito
const tip = [Math.round(dotX + 2), Math.round(dotY + 2)];  // ponta do cursor sobre o ponto
const rest = [tip[0] + 36, tip[1] + 27];                   // ao lado do ponto, sem encostar na logo
const carry = [((from[0] - tip[0]) / S).toFixed(0), ((from[1] - tip[1]) / S).toFixed(0)];

// ---------- onda: depois que o ponto encaixa, cada letra dá um pulinho (o quique da queda) e termina no ponto ----------
const wave = { f: 0, oBody: 1, oDotL: 1.6, oDotR: 1.8, eTop: 2, g: 3, eBottom: 4, r: 5, dot: 6 };  // pinguinhos do ö logo depois do o
const hop = (l) => (4.45 + wave[l.id] * .08).toFixed(2);

const place = (l) => { const [x, y, r] = inline[l.id]; return `class="place" style="transform: translate(${x}px, ${y}px) rotate(${r}deg)"`; };
const rule = (l) => (l.evenodd ? ' fill-rule="evenodd"' : '');
const logo = [
  ...letters.filter(l => l.id !== 'dot').map(l => `    <g ${place(l)}><path class="draw" fill="none" stroke="#ffffff" stroke-width="${SW}" pathLength="1" d="${l.d}"/></g>`),
  ...letters.filter(l => l.id !== 'dot').map(l => `    <g ${place(l)}><path class="fill" style="animation-delay: 1.9s, ${hop(l)}s" fill="#ffffff"${rule(l)} d="${l.d}"/></g>`),
  `    <g ${place(dot)}><path class="carry" fill="#ffffff" d="${dot.d}"/></g>`,
].join('\n');

const header = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300" role="img" aria-label="föeger.">
  <style>
    ${bold}
    .sans  { font-family: ${FAMILY}; }
    .place { transform-box: fill-box; transform-origin: center; }
    .draw  { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.6s ease-in-out .3s forwards, gone .6s ease-out 2.3s forwards; }
    .fill  { transform-box: fill-box; transform-origin: center bottom; opacity: 0; animation: fade .7s ease-out forwards, hop .7s ease-in-out; }
    .carry { transform-box: fill-box; transform-origin: center; opacity: 0; animation: carry 1.4s cubic-bezier(.45,.05,.3,1) 2.5s forwards, drop .35s cubic-bezier(.3,1.6,.5,1) 3.95s, hop .7s ease-in-out ${hop(dot)}s; }
    .cursor { opacity: 0; animation: cursor 1.4s cubic-bezier(.45,.05,.3,1) 2.5s forwards, away .8s cubic-bezier(.45,.05,.3,1) 4.35s forwards; }
    .click  { transform-box: fill-box; transform-origin: 0 0; animation: click .25s ease-in-out 3.95s; }
    .float  { animation: float 4s ease-in-out 5.4s infinite; }
    @keyframes draw   { to { stroke-dashoffset: 0; } }
    @keyframes fade   { to { opacity: 1; } }
    @keyframes gone   { to { opacity: 0; } }
    @keyframes carry  { 0% { opacity: 0; transform: translate(${carry[0]}px, ${carry[1]}px) scale(.9); } 20% { opacity: 1; } 100% { opacity: 1; transform: none; } }
    @keyframes drop   { 50% { transform: scale(1.18); } }
    @keyframes hop    { 30% { transform: translateY(-90px) scaleY(1.04); } 58% { transform: translateY(0) scaleY(.94); } 74% { transform: translateY(-24px); } 88% { transform: translateY(0); } }
    @keyframes cursor { 0% { opacity: 0; transform: translate(${from[0]}px, ${from[1]}px); } 20% { opacity: 1; } 100% { opacity: 1; transform: translate(${tip[0]}px, ${tip[1]}px); } }
    @keyframes away   { from { opacity: 1; transform: translate(${tip[0]}px, ${tip[1]}px); } to { opacity: 1; transform: translate(${rest[0]}px, ${rest[1]}px); } }
    @keyframes click  { 50% { transform: scale(.82); } }
    @keyframes float  { 50% { transform: translate(-5px, 4px); } }
    @media (prefers-reduced-motion: reduce) {
      .draw { opacity: 0; animation: none; }
      .fill, .carry { opacity: 1; animation: none; }
      .cursor { opacity: 1; transform: translate(${rest[0]}px, ${rest[1]}px); animation: none; }
      .click, .float { animation: none; }
    }
  </style>

  <!-- canvas -->
  <rect x=".5" y=".5" width="1199" height="299" rx="16" fill="#0a0a0a" stroke="#1f1f1f"/>

  <!-- logo: vetores do portfolio; o contorno se desenha e é preenchido, ainda sem o ponto final -->
  <g transform="translate(${tx} ${ty}) scale(${S.toFixed(5)})">
${logo}
  </g>

  <!-- multiplayer cursor: traz o ponto final -->
  <g class="cursor">
    <g class="float">
      <g class="click">
        <path d="M0 0 L0 18 L4.8 13.4 L8 20.4 L10.8 19.2 L7.7 12.3 L14 12.3 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="1.4" stroke-linejoin="round"/>
      </g>
      <rect x="14" y="20" width="42" height="20" rx="5" fill="#ffffff"/>
      <text x="35" y="34" class="sans" font-size="12" font-weight="700" fill="#0a0a0a" text-anchor="middle">luiz</text>
    </g>
  </g>
</svg>
`;

fs.writeFileSync(path.join(out, 'header.svg'), header);
console.log('assets/header.svg ok');
