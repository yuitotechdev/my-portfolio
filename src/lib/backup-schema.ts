import { z } from 'zod'

// We need looser schemas for backup because we trust the exported data structure somewhat,
// but want to verify the shape. We also need to include system fields (id, created_at)
// which are not in the input validators.

const timestampSchema = z.string().nullable().optional()

export const backupWorkSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    thumbnail_url: z.string().nullable().optional(),
    tech_stack: z.array(z.string()).optional(),
    deployment_url: z.string().nullable().optional(),
    github_url: z.string().nullable().optional(),
    is_public: z.boolean().optional(),
    published_at: timestampSchema,
    created_at: timestampSchema,
    updated_at: timestampSchema,
})

export const backupPostSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    content: z.string().nullable().optional(),
    is_public: z.boolean().optional(),
    published_at: timestampSchema,
    created_at: timestampSchema,
    updated_at: timestampSchema,
})

export const backupNewsSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    content: z.string().nullable().optional(),
    is_public: z.boolean().optional(),
    published_at: timestampSchema,
    created_at: timestampSchema,
    updated_at: timestampSchema,
})

export const backupProfileSchema = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    bio: z.string().nullable().optional(),
    avatar_url: z.string().nullable().optional(),
    created_at: timestampSchema,
    updated_at: timestampSchema,
})

export const backupLinkSchema = z.object({
    id: z.string().uuid(),
    platform: z.string(),
    url: z.string(),
    icon: z.string().nullable().optional(),
    created_at: timestampSchema,
})

export const backupSchema = z.object({
    works: z.array(backupWorkSchema).optional(),
    posts: z.array(backupPostSchema).optional(),
    news: z.array(backupNewsSchema).optional(),
    profile: z.array(backupProfileSchema).optional(),
    links: z.array(backupLinkSchema).optional(),
    exported_at: z.string().optional(),
    version: z.number().optional(), // In case we add versioning later
})

export type BackupData = z.infer<typeof backupSchema>
