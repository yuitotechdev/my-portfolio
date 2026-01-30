import { z } from 'zod'

// Shared validators
const slugSchema = z
    .string()
    .min(3, { message: 'Slug must be at least 3 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase alphanumeric with hyphens' })

const urlSchema = z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal(''))

// Works
export const workSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: slugSchema,
    description: z.string().optional(),
    thumbnail_url: z.string().optional(),
    tech_stack: z.array(z.string()), // Expecting array of strings
    deployment_url: urlSchema,
    github_url: urlSchema,
    is_public: z.boolean(),
})

export type WorkInput = z.infer<typeof workSchema>

// Posts
export const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: slugSchema,
    content: z.string().optional(),
    is_public: z.boolean(),
})

export type PostInput = z.infer<typeof postSchema>

// News
export const newsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: slugSchema,
    content: z.string().optional(),
    is_public: z.boolean(),
})

export type NewsInput = z.infer<typeof newsSchema>

// Helper to parse FormData for Work
export function parseWorkFormData(formData: FormData): WorkInput {
    const is_public = formData.get('is_public') === 'on'
    const tech_stack_str = formData.get('tech_stack') as string
    const tech_stack = tech_stack_str ? tech_stack_str.split(',').map(s => s.trim()).filter(Boolean) : []

    return {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        thumbnail_url: formData.get('thumbnail_url') as string,
        tech_stack,
        deployment_url: formData.get('deployment_url') as string,
        github_url: formData.get('github_url') as string,
        is_public,
    }
}

// Helper for Post/News
export function parsePostFormData(formData: FormData): PostInput {
    return {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        content: formData.get('content') as string,
        is_public: formData.get('is_public') === 'on',
    }
}

export function parseNewsFormData(formData: FormData): NewsInput {
    return {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        content: formData.get('content') as string,
        is_public: formData.get('is_public') === 'on',
    }
}

// Products
export const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    url: z.string().url('Must be a valid URL'),
    price_display: z.string().optional(),
    thumbnail_url: z.string().optional(),
    order: z.coerce.number().default(0),
    is_public: z.boolean(),
})

export type ProductInput = z.infer<typeof productSchema>

export function parseProductFormData(formData: FormData): ProductInput {
    return {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        url: formData.get('url') as string,
        price_display: formData.get('price_display') as string,
        thumbnail_url: formData.get('thumbnail_url') as string,
        order: Number(formData.get('order') || 0),
        is_public: formData.get('is_public') === 'on',
    }
}

// Devices
export const deviceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    purchase_reason: z.string().optional(),
    link_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    order: z.coerce.number().default(0),
    is_public: z.boolean(),
})

export type DeviceInput = z.infer<typeof deviceSchema>

export function parseDeviceFormData(formData: FormData): DeviceInput {
    return {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        purchase_reason: formData.get('purchase_reason') as string,
        link_url: formData.get('link_url') as string,
        order: Number(formData.get('order') || 0),
        is_public: formData.get('is_public') === 'on',
    }
}

// Profile
export const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    bio_short: z.string().optional(),
    bio_medium: z.string().optional(),
    bio_long: z.string().optional(),
    avatar_url: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

export function parseProfileFormData(formData: FormData): ProfileInput {
    return {
        name: formData.get('name') as string,
        bio_short: formData.get('bio_short') as string,
        bio_medium: formData.get('bio_medium') as string,
        bio_long: formData.get('bio_long') as string,
        avatar_url: formData.get('avatar_url') as string,
    }
}

// Links
export const linkSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().url('Must be a valid URL'),
    icon_name: z.string().optional(),
    order: z.coerce.number().default(0),
    is_active: z.boolean(),
})

export type LinkInput = z.infer<typeof linkSchema>

export function parseLinkFormData(formData: FormData): LinkInput {
    return {
        title: formData.get('title') as string,
        url: formData.get('url') as string,
        icon_name: formData.get('icon_name') as string,
        order: Number(formData.get('order') || 0),
        is_active: formData.get('is_active') === 'on',
    }
}
