# Nour Musharbash, RD — website

Bilingual (English / Arabic) single-page site for the Nour Musharbash Nutrition Clinic, Amman.
Implemented from the Claude Design file **"Nour Musharbash RD v3"** (split hero direction).

Live: https://aro-software.github.io/nour-musharbash-clinic/ · Arabic: https://aro-software.github.io/nour-musharbash-clinic/ar/

## Structure

```
index.html            English page (generated)
ar/index.html         Arabic page, RTL (generated)
assets/css/site.css   All styles
assets/js/site.js     Interactions + scroll-driven motion (vanilla JS, no dependencies)
assets/img/           Logo marks and portrait
src/content.mjs       All copy (EN + AR) and clinic details: phone, address, links
src/template.mjs      Page markup, rendered once per language
build.mjs             Writes index.html and ar/index.html
```

## Editing

1. Change copy or clinic details in `src/content.mjs`, markup in `src/template.mjs`.
2. Run `npm run build` (Node 18+) to regenerate both pages.
3. Preview with `npm run dev`, then open http://localhost:4173.

Styles and `site.js` are served as-is and need no build step.

## Deploy

GitHub Pages serves the `main` branch root. Commit the regenerated HTML and push.
