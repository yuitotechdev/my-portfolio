# ADR.md — Architecture Decision Records (Summary)

Version: v1.0.0 / 2026-01-30

## ADR-001: Custom /admin instead of 3rd-party CMS
- Decision: Build /admin inside Next.js using same UI & motion system
- Rationale: consistent design, “I built this” credibility, no UI mismatch
- Consequences: more build work, but better portfolio impact

## ADR-002: Supabase for DB/Auth/Storage (start free, scale later)
- Decision: Supabase first, abstract via repositories + export/import
- Rationale: fastest to ship with good capabilities
- Consequences: free plan limitations; mitigated by migration-ready design

## ADR-003: Markdown blog editor
- Decision: Markdown + preview in admin
- Rationale: lightweight, fast, portable
- Consequences: rich text can be added later if needed
