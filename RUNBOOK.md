# Runbook

## Overview
This document outlines operational procedures for the Portfolio Web Application.

## Environment Setup
Required environment variables in `.env.local`:
- `AUTH_SECRET`: NextAuth secret.
- `ADMIN_EMAIL`: Email allowed to access /admin.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Admin-level key (Server-side only).

> **Security Note**: The application performs a check on startup/admin access (`src/lib/check-env.ts`) and will log errors if these are missing.

## Deployment
1.  **Build**: `npm run build`
2.  **Start**: `npm start`
3.  **Vercel**: Push to main branch. Ensure Env Vars are set in Vercel Dashboard.

## Backup & Restore
We use a JSON-based backup system available in the Admin Settings.

### Export (Backup)
1.  Go to `/admin/settings`.
2.  Click "Download Backup".
3.  A JSON file containing `works`, `posts`, `news`, `profile`, `links` will be downloaded.
4.  **Store this file securely.** It contains all site content.

### Import (Restore)
1.  Go to `/admin/settings`.
2.  Select a Backup JSON file.
3.  **Validation**: The system will first validate the file structure and show a summary (e.g., "Works: 5, Posts: 10").
    - If errors are found (e.g., missing fields, invalid JSON), they will be displayed.
4.  **Execution**: Click "Confirm Restore" to proceed.
    - **Warning**: This uses `upsert`. Existing records with matching IDs will be overwritten. New records will be created.

## Content Management
- **Works/Posts/News**: Managed via Admin Dashboard.
- **Validation**: All inputs are validated using Zod (`src/lib/validators.ts`).
    - Title/Slug are required.
    - Slugs must be alphanumeric (kebab-case).
    - URLs must be valid format.
    - Errors are displayed via Toast notifications.

## Database Schema
defined in Supabase.
- `works`: Portfolio items.
- `posts`: Blog articles.
- `news`: News updates.
- `profile`: User profile info.
- `links`: Social links.

## Troubleshooting
- **Build Errors**: Check strict type safety.
- **Validation Errors**: Check `ZodError` handling in `src/app/actions/*.ts`.
- **Import Failures**: Validate JSON structure against `src/lib/backup-schema.ts`.
