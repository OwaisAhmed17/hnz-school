# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **HNZ School**, a primary school (Grades 1–5) in Ramanagara, Karnataka. No build system, framework, or dependencies.

To preview: open `index.html` in a browser, or run `python3 -m http.server 8080`.

## File Structure

```
index.html        — HTML shell, references external CSS and JS
css/style.css     — all styles (~1164 lines), including CSS custom properties
js/main.js        — mobile nav, scroll-reveal, nav shadow, form validation + Netlify POST
assets/logo.png   — school logo
netlify.toml      — security headers (CSP, X-Frame-Options, etc.) + cache rules
logo.png          — legacy root copy, pending deletion after browser verification
```

## Architecture

- **HTML** — sequential sections: `nav → #hero → #pillars → #about → #academics → #marquee-section → #admissions → #contact → footer`
- **CSS** — design tokens in `:root`: `--navy` / `--gold` are the two primary brand colors. Fonts: Playfair Display (headings) and Inter (body) via Google Fonts.
- **JavaScript** — mobile nav toggle, scroll-reveal via `IntersectionObserver`, nav shadow on scroll, Netlify Forms submission with client-side validation.
- **CSP** — `unsafe-inline` is not used; all styles and scripts are external files.

## Key Design Conventions

- Responsive breakpoints: `1100px`, `900px` (tablet), `600px` (mobile). **All mobile changes must stay inside `@media` blocks — desktop design must never be touched.**
- `.reveal` + `.visible` drive scroll animations — `opacity:0; translateY(30px)` → visible on viewport entry.
- Contact form: Netlify Forms (`data-netlify="true"`), `+91` prefix (non-editable span via `.phone-input-wrap`), either phone or email required, `#form-success` shown in-place on submit.
- Google Maps iframe: `.map-wrap` — 60% width, `margin: 48px auto` (equal top/bottom), gold border. Full width + 32px top margin on mobile.

## Placeholders to Replace

- Phone number: `+91 00000 00000`
- `about-image` panel: shows logo instead of a real campus photo.
