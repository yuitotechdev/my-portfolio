'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { parsePostFormData, postSchema } from '@/lib/validators'
import { validateServerConfig } from '@/lib/env-check'
import {
    type AdminFormState,
    errorFormState,
    successFormState,
    zodIssuesToFieldErrors
} from '@/lib/admin-form-state'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}


export async function createPost(_prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'Server configuration incomplete')
        }
        await requireAdmin()

        const rawData = parsePostFormData(formData)
        const result = postSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin
            .from('posts')
            .insert({
                ...result.data,
                published_at: result.data.is_public ? new Date().toISOString() : null
            })

        if (error) {
            console.error('Create Post Error:', error)
            if (error.code === '23505') {
                return errorFormState('Slug already exists', {
                    slug: ['Slug already exists']
                })
            }
            return errorFormState('Failed to create post')
        }

        revalidatePath('/blog')
        revalidatePath('/blog/posts')
        revalidatePath('/admin/posts')

        return successFormState('Post created successfully', '/admin/posts')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function updatePost(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'Server configuration incomplete')
        }
        await requireAdmin()

        const rawData = parsePostFormData(formData)
        const result = postSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        // Get existing record to check current published_at
        const { data: existing } = await supabaseAdmin
            .from('posts')
            .select('published_at')
            .eq('id', id)
            .single()

        const { error } = await supabaseAdmin
            .from('posts')
            .update({
                ...result.data,
                published_at: result.data.is_public 
                    ? (existing?.published_at || new Date().toISOString()) 
                    : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error('Update Post Error:', error)
            if (error.code === '23505') {
                return errorFormState('Slug already exists', {
                    slug: ['Slug already exists']
                })
            }
            return errorFormState('Failed to update post')
        }

        revalidatePath('/blog')
        revalidatePath('/blog/posts')
        revalidatePath('/admin/posts')

        return successFormState('Post updated successfully', '/admin/posts')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function deletePost(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('id', id)

        if (error) {
            return { error: 'Failed to delete post' }
        }

        revalidatePath('/blog')
        revalidatePath('/blog/posts')
        revalidatePath('/admin/posts')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
