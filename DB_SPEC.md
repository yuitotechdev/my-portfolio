# DB_SPEC.md — Database & RLS Spec (Supabase Postgres)

Version: v1.0.0 / 2026-01-30
Related: CONTENT_MODEL.md

## 1. Tables (minimum)
- profile (single row)
- links
- works
- products
- devices
- news
- posts

## 2. Common Fields
- id (uuid)
- created_at, updated_at (timestamp)
- order (int) where needed
- slug unique where needed

## 3. RLS Policy (Owner Only Write)
- Public read: enabled only for `is_public=true` content (or all content if you keep it simple)
- Owner write: allow only for allowlisted email (mapped to auth.uid)

Implementation idea:
- Create `app_admins` table with allowed user ids OR store allowlist in app layer only.
- Safer: both app check + RLS check.

## 4. Storage Buckets
- bucket: thumbnails
- path rule: works/{workId}/thumbnail.webp (or .png)
- public read ok, write only owner
