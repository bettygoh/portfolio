# Betty Goh — Portfolio

Static portfolio site. No build step: plain HTML, one stylesheet, a few small vanilla JS files.

## Structure

```
index.html                  Home
work.html                   All work
about.html                  About
side-quests.html            Side quests / abide.clo
readsg-challenge.html       Case study — ReadSG Challenge (password-protected)
personality-quiz.html       Case study — CrowdTaskSG personality quiz (unlisted)
bulk-image-download.html    Case study — bulk image download (unlisted)
app-store-previews.html     Case study — ADDX app store previews
product-discovery.html      Case study — ADDX product discovery
design-system.html          Case study — ADDX Design System 2.0
mobile-preview.html         Dev tool: every page in phone frames (gitignored)

portfolio.css               All styles
theme-toggle.js             Light / dark / system switch
project-carousel.js         "More projects" carousel injected into case studies
project-gate.js             Password gate for protected case studies

assets/                     Images, logos, CV
prototypes/                 Embedded interactive prototypes
```

## Notes

- **Password gate** — `project-gate.js` holds the gated pages and their passwords in `GATED`. Client-side only: casual privacy, not security. Unlock persists in `localStorage`.
- **Unlisted projects** — `personality-quiz.html` and `bulk-image-download.html` are reachable by URL but their cards are non-clickable and they're excluded from the nav and carousel.
- **Brand** — the nav wordmark is live text (`.brand-text`), not an image file.
- **No authoring-only components** — all `<image-slot>` placeholders have been removed, so every page renders identically on any static host. `personality-quiz.html` and `bulk-image-download.html` are text-only placeholders awaiting real content.

## Deploy

Any static host. For GitHub Pages: push to `main`, then Settings → Pages → Deploy from branch → `main` / root.
