import { z } from 'zod'

const slugSchema = z
    .string()
    .min(3, { message: 'URLスラッグは3文字以上で入力してください' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'URLスラッグは半角英数字とハイフンのみ使用できます' })

const urlSchema = z
    .string()
    .url({ message: '正しいURLを入力してください' })
    .optional()
    .or(z.literal(''))

export const workSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    slug: slugSchema,
    description: z.string().optional(),
    thumbnail_url: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    tech_stack: z.array(z.string()),
    deployment_url: urlSchema,
    github_url: urlSchema,
    is_public: z.boolean()
})

export type WorkInput = z.infer<typeof workSchema>

export const postSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    slug: slugSchema,
    content: z.string().optional(),
    is_public: z.boolean()
})

export type PostInput = z.infer<typeof postSchema>

export const newsSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    slug: slugSchema,
    content: z.string().optional(),
    is_public: z.boolean()
})

export type NewsInput = z.infer<typeof newsSchema>

export function parseWorkFormData(formData: FormData): WorkInput {
    const is_public = formData.get('is_public') === 'on'
    const techStackRaw = formData.get('tech_stack') as string
    const tech_stack = techStackRaw ? techStackRaw.split(',').map((item) => item.trim()).filter(Boolean) : []
    const screenshotsRaw = formData.get('screenshots') as string | null
    const screenshots = screenshotsRaw ? JSON.parse(screenshotsRaw) as string[] : []

    return {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        thumbnail_url: formData.get('thumbnail_url') as string,
        screenshots,
        tech_stack,
        deployment_url: formData.get('deployment_url') as string,
        github_url: formData.get('github_url') as string,
        is_public
    }
}

export function parsePostFormData(formData: FormData): PostInput {
    return {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        content: formData.get('content') as string,
        is_public: formData.get('is_public') === 'on'
    }
}

export function parseNewsFormData(formData: FormData): NewsInput {
    return {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        content: formData.get('content') as string,
        is_public: formData.get('is_public') === 'on'
    }
}

export const productSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    description: z.string().optional(),
    url: z.string().url('正しいURLを入力してください'),
    price_display: z.string().optional(),
    thumbnail_url: z.string().optional(),
    order: z.coerce.number().default(0),
    is_public: z.boolean()
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
        is_public: formData.get('is_public') === 'on'
    }
}

export const deviceSchema = z.object({
    name: z.string().min(1, 'デバイス名は必須です'),
    category: z.string().min(1, 'カテゴリは必須です'),
    description: z.string().optional(),
    purchase_reason: z.string().optional(),
    link_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
    thumbnail_url: z.string().optional(),
    order: z.coerce.number().default(0),
    is_public: z.boolean()
})

export type DeviceInput = z.infer<typeof deviceSchema>

export function parseDeviceFormData(formData: FormData): DeviceInput {
    return {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        purchase_reason: formData.get('purchase_reason') as string,
        link_url: formData.get('link_url') as string,
        thumbnail_url: formData.get('thumbnail_url') as string,
        order: Number(formData.get('order') || 0),
        is_public: formData.get('is_public') === 'on'
    }
}

export const profileSchema = z.object({
    name: z.string().min(1, '名前は必須です'),
    bio_short: z.string().optional(),
    bio_medium: z.string().optional(),
    bio_long: z.string().optional(),
    avatar_url: z.string().optional()
})

export type ProfileInput = z.infer<typeof profileSchema>

export function parseProfileFormData(formData: FormData): ProfileInput {
    return {
        name: formData.get('name') as string,
        bio_short: formData.get('bio_short') as string,
        bio_medium: formData.get('bio_medium') as string,
        bio_long: formData.get('bio_long') as string,
        avatar_url: formData.get('avatar_url') as string
    }
}

export const linkSchema = z.object({
    title: z.string().min(1, '表示名は必須です'),
    url: z.string().url('正しいURLを入力してください'),
    icon_name: z.string().optional(),
    order: z.coerce.number().default(0),
    is_active: z.boolean()
})

export type LinkInput = z.infer<typeof linkSchema>

export function parseLinkFormData(formData: FormData): LinkInput {
    return {
        title: formData.get('title') as string,
        url: formData.get('url') as string,
        icon_name: formData.get('icon_name') as string,
        order: Number(formData.get('order') || 0),
        is_active: formData.get('is_active') === 'on'
    }
}
