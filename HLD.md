# HLD.md — High Level Design (Architecture)

Version: v1.0.0 / 2026-01-30
Related: SPEC.md / CONTENT_MODEL.md / DECISIONS.md

## 1. Overview
- Public site + Admin (/admin) in one Next.js app (Vercel)
- Auth: Google login (Auth.js) + allowlist (owner only)
- Data: Supabase Postgres
- Thumbnails: Supabase Storage (works thumbnail only)
- Stats: Cloudflare Web Analytics (free) + optional internal events later
- Speed: Vercel Speed Insights

## 2. Components
- Next.js App
  - Public routes: / /works /products /devices /news /blog /about /contact /stats
  - Admin routes: /admin/*
- Auth layer
  - Auth.js session + allowlist check
- Data layer
  - Repository interfaces (WorksRepository etc.)
  - Supabase implementations
- Storage layer
  - StorageRepository (upload/get url/delete)
- Export/Import
  - JSON format = CONTENT_MODEL.md (single truth)

## 3. Data Flow
### Public
1) Request -> Next.js
2) Fetch public data (Supabase) -> render
3) Thumbnails via Storage URL + next/image optimization

### Admin
1) /admin -> Google login
2) allowlist pass -> CRUD UI
3) Save -> Supabase write (RLS protects)
4) Reflect immediately on public pages (ISR or revalidate)

## 4. Non-Functional Requirements
- Performance: light JS, optimized images, minimal heavy scroll animations
- Accessibility: focus visible, keyboard navigation, reduced motion fallback
- Security: allowlist, RLS, env secrets, no public write

## 5. Migration Strategy
- Repository layer prevents coupling
- Export/Import JSON enables DB replacement
- StorageRepository enables storage replacement
