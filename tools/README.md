# tools

Geradores dos SVGs do README do perfil. Nada aqui aparece no perfil.

```bash
node tools/build-header.js    # assets/header.svg  (logo, cursor, console.log(contact))
node tools/build-journey.js   # assets/journey.svg (teia de branches + ícones)
node tools/serve.js           # simulação do perfil em http://localhost:5599
```

- Tamanhos do journey: constantes no topo do bloco `journey` em `build-journey.js` (`FONT`, `TITLE`, `ICON`, `GAP`, `G`, `STEP`).
- Ícones: `tools/icons/`, do [skillicons.dev](https://skillicons.dev) (MIT); `keycloak.svg` montado com o ícone do [Simple Icons](https://simpleicons.org).
- Vetores do logo: os mesmos de `AnimatedLogoHeader.tsx` do portfolio.
