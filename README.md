# Robert Williamson — Portfolio

A lightweight, responsive portfolio built with semantic HTML, CSS, and vanilla
JavaScript. It is designed to run directly on GitHub Pages without a build step.

## Run locally

Serve the repository root with any static file server so the project data can be
loaded with `fetch`:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Structure

- `index.html` contains the page structure and content.
- `css/style.css` contains both themes and responsive styles.
- `js/script.js` renders education and project data and manages interactions.
- `data/projects.json` is the source of truth for portfolio projects.
- `data/images/` contains local project images and site assets.
