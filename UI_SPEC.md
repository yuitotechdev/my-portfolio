# UI_SPEC.md — Screen & UX Specification

Version: v1.0.0 / 2026-01-30
Related: SPEC.md / MOTION.md

## 1. Public Screens
### Home (/)
- Hero: name, one-liner, main CTA (Works)
- Highlights: top works cards, recent blog/news
- Quick links: GitHub/X/Booth etc.

### Works (/works, /works/[slug])
- List: filter by tags, sort by order
- Detail: summary, tech, role, links, metrics, thumbnail

### Products (/products)
- Cards: title, summary, link out

### Devices (/devices)
- Category sections + quick scan layout

### Blog (/blog, /blog/[slug])
- Markdown rendering + TOC (optional)
- Tags and date

### News (/news, /news/[slug])
- Shorter format, date-first

### About (/about)
- Profile long + design philosophy summary + “how I build” section

### Contact (/contact)
- Email: copy-only button + obfuscated rendering
- Optional: “Open mail app” button

### Stats (/stats)
- Public highlight only: monthly PV, top pages, top works (range-limited)

## 2. Admin Screens (/admin)
- Dashboard: quick actions + stats overview
- Works CRUD: list/new/edit, thumbnail upload, order controls
- Products CRUD
- Devices CRUD
- News CRUD
- Blog CRUD (Markdown editor + preview)
- Profile/Links editor
- Export/Import screen
- Settings screen (site name, OGP, theme intensity)

## 3. UX Rules (Must)
- Every action feedback: toast + button state + optimistic UI when safe
- Always consistent motion tokens (MOTION.md)
- Mobile-first admin usability (big targets, simple forms)
