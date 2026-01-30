# API_CONTRACT.md — Data Contract

Version: v1.0.0 / 2026-01-30
Related: CONTENT_MODEL.md

## 1. Admin Operations
- Create/Update/Delete for each entity
- Validation rules: required fields, slug uniqueness
- Thumbnail upload: size limit + format convert (optional)

## 2. Export/Import
### Export
- GET /admin/export -> JSON (content-export-v1)
- Must match CONTENT_MODEL.md exactly

### Import
- POST /admin/import (JSON)
- Validate schema -> upsert into DB
- Handle slug conflicts strategy:
  - default: overwrite if same slug, else append suffix

## 3. Revalidation
- After admin save, trigger revalidate for affected pages
- Minimum: works list + that slug page, etc.
