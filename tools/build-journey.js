// Gera assets/journey.svg: teia de branches + ícones do skillicons.dev embutidos
// Uso: node tools/build-journey.js
const fs = require('fs');
const path = require('path');

// ---- ícones do skillicons.dev embutidos (sem depender de URL externa) ----
const icon = (name, x, y, size) => {
  const raw = fs.readFileSync(path.join(__dirname, 'icons', `${name}.svg`), 'utf8');
  const start = raw.indexOf('<svg', raw.indexOf('<g'));
  const end = raw.lastIndexOf('</svg>', raw.lastIndexOf('</svg>') - 1) + 6;
  let inner = raw.slice(start, end);
  const p = `${name}-`;
  inner = inner.replace(/id="([^"]+)"/g, `id="${p}$1"`)
               .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
               .replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
  return inner.replace(/^<svg([^>]*)>/, (m, a) => `<svg x="${x}" y="${y}" width="${size}" height="${size}"${a.replace(/\s(width|height)="[^"]*"/g, '')}>`);
};

const rows = [
  ['design',    ['figma', 'photoshop'],                  ['figma', 'ps']],
  ['backend',   ['javascript', '.net'],                  ['js', 'dotnet']],
  ['frontend',  ['html', 'css', 'react', 'tailwind css'], ['html', 'css', 'react', 'tailwind']],
  ['fullstack', ['typescript', 'next.js', 'node.js'],    ['ts', 'nextjs', 'nodejs']],
  ['infra',     ['docker', 'azure devops', 'keycloak'],  ['docker', 'azure']],
];

const graph = (s, delays) => {
  const k = s / 52, Y = (i) => 90 + i * s, r = (v) => +v.toFixed(1);
  return `  <g fill="none" stroke-width="2.5" stroke-linecap="round">
    <path d="M60 ${Y(0)} V${Y(4)}" stroke="#333333" pathLength="1" class="draw" style="animation-duration:2.2s;animation-delay:.2s"/>
    <path d="M60 ${Y(0)} C60 ${r(Y(0) + 28 * k)} 140 ${r(Y(1) - 30 * k)} 140 ${Y(1)} V${r(Y(3) - 40 * k)} C140 ${r(Y(3) - 14 * k)} 100 ${r(Y(3) - 20 * k)} 100 ${Y(3)}" stroke="#7a7a7a" pathLength="1" class="draw" style="animation-duration:1.4s;animation-delay:.5s"/>
    <path d="M60 ${Y(0)} C60 ${r(Y(0) + 40 * k)} 100 ${r(Y(0) + 42 * k)} 100 ${r(Y(2) - 24 * k)} V${Y(3)} C100 ${r(Y(3) + 30 * k)} 60 ${r(Y(3) + 24 * k)} 60 ${Y(4)}" stroke="#f2f2f2" pathLength="1" class="draw" style="animation-duration:1.8s;animation-delay:.6s"/>
  </g>
  <g stroke-width="2.5" fill="#0a0a0a">
    <circle cx="60"  cy="${Y(0)}" r="6" stroke="#8a8a8a" class="dot" style="animation-delay:${delays[0]}s"/>
    <circle cx="140" cy="${Y(1)}" r="6" stroke="#7a7a7a" class="dot" style="animation-delay:${delays[1]}s"/>
    <circle cx="100" cy="${Y(2)}" r="6" stroke="#f2f2f2" class="dot" style="animation-delay:${delays[2]}s"/>
    <circle cx="100" cy="${Y(3)}" r="8" stroke="#f2f2f2" class="dot" style="animation-delay:${delays[3]}s"/>
    <circle cx="100" cy="${Y(3)}" r="3" fill="#f2f2f2" stroke="none" class="dot" style="animation-delay:${delays[3] + .1}s"/>
  </g>
  <circle cx="60" cy="${Y(4)}" r="8" fill="#ffffff" class="dot" style="animation-delay:${delays[4]}s"/>`;
};

const shell = (H, label, body, W = 900, open = false, ts = 13) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">
  <style>
    text { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
    .draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw linear forwards; }
    .dot  { transform-box: fill-box; transform-origin: center; transform: scale(0); animation: pop .35s cubic-bezier(.3,1.6,.5,1) forwards; }
    .row  { opacity: 0; animation: in .45s ease-out forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes pop  { to { transform: scale(1); } }
    @keyframes in   { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) {
      .draw { stroke-dashoffset: 0; animation: none; }
      .dot  { transform: none; animation: none; }
      .row  { opacity: 1; animation: none; }
    }
  </style>

  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="#0a0a0a" stroke="#1f1f1f"/>
  <text x="32" y="40" font-size="${ts}" fill="#6b6b6b"><tspan fill="#4a4a4a">~/luiz-foeger $ </tspan><tspan fill="#a8a8a8">git log --graph --author=luiz</tspan></text>
  <line x1="32" y1="60" x2="${W - 32}" y2="60" stroke="#1a1a1a"/>${open ? `
  <g class="row" style="animation-delay:2.1s">
    <text x="${W - 32}" y="40" font-size="${ts}" fill="#ffffff" text-anchor="end">open to new projects</text>
  </g>` : ''}
${body}
</svg>
`;

const delays = [.3, .75, 1.1, 1.5, 1.95];
const label = 'Started in design (Figma, Photoshop) · backend (JavaScript, .NET) · frontend (HTML, CSS, React, Tailwind CSS) · fullstack (TypeScript, Next.js, Node.js) · infra (Docker, Azure DevOps, Keycloak) · open to new projects';

// ---- journey ----
// Largura = coluna do README no GitHub (~830px), então 1 unidade ≈ 1px na tela.
{
  const W = 830;
  const FONT = 13, TITLE = 13;            // nomes das frentes / título
  const ICON = 38, GAP = 10;              // ícones
  const G = 0.9;                          // escala da teia (1 = tamanho anterior)
  const STEP = 50;                        // distância entre linhas na tela
  const Y0 = 100, gx = 48;                // primeira linha / início da teia
  const Y = (i) => Y0 + i * STEP;
  const labelX = gx + 90 * G + 44, ix = labelX + 128;
  const rowsB = rows.map((r, i) => i === 4 ? ['infra &amp; tools', null, ['docker', 'azure', 'keycloak', 'git', 'vscode', 'visualstudio']] : r);
  const body = `  <g transform="translate(${(gx - 60 * G).toFixed(1)} ${(Y0 - 90 * G).toFixed(1)}) scale(${G})">
${graph(STEP / G, delays)}
  </g>
${rowsB.map(([lb, , ic], i) => `  <g class="row" style="animation-delay:${delays[i]}s">
    <text x="${labelX}" y="${Y(i) + FONT * .35}" font-size="${FONT}" fill="#6b6b6b">${lb}:</text>
    ${ic.map((n, j) => icon(n, ix + j * (ICON + GAP), Y(i) - ICON / 2, ICON)).join('\n    ')}
  </g>`).join('\n')}`;

  // números à direita: anos contados desde START; frentes e ferramentas contadas das linhas acima.
  // A Action .github/workflows/update-stats.yml roda isto todo dia 1 e commita só se o número mudar.
  const START = new Date(2023, 5, 1);     // início: junho de 2023 (primeiro commit no GitHub)
  const now = new Date();
  const full = now.getFullYear() - START.getFullYear() - (now < new Date(now.getFullYear(), START.getMonth(), START.getDate()) ? 1 : 0);
  const YEARS = `${full}+`;
  const tools = rowsB.reduce((n, [, , ic]) => n + ic.length, 0);
  const stats = [[YEARS, 'years building'], [rowsB.length, 'fronts'], [tools, 'tools']];
  const statsSvg = `
  <line x1="640" y1="92" x2="640" y2="310" stroke="#1a1a1a"/>
${stats.map(([n, l], i) => `  <g class="row" style="animation-delay:${(2.2 + i * .2).toFixed(1)}s">
    <text x="${W - 32}" y="${132 + i * 78}" font-size="34" fill="#ffffff" text-anchor="end" font-weight="700">${n}</text>
    <text x="${W - 32}" y="${154 + i * 78}" font-size="12" fill="#6b6b6b" text-anchor="end">${l}</text>
  </g>`).join('\n')}`;

  const labelB = label.replace('infra (Docker, Azure DevOps, Keycloak)', 'infra &amp; tools (Docker, Azure DevOps, Keycloak / RHBK, Git, VS Code, Visual Studio)')
    .replace(' · open to new projects', ` · ${YEARS} years building, ${rowsB.length} fronts, ${tools} tools · open to new projects`);
  const svg = shell(Y(4) + 44, labelB, body + statsSvg, W, true, TITLE);
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'journey.svg'), svg);
}

console.log('assets/journey.svg ok');
