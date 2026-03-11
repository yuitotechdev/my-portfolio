'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parsePostFormData, postSchema } from '@/lib/validators'
import { validateServerConfig } from '@/lib/env-check'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}


export async function createPost(formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return { error: config.message }
        }
        await requireAdmin()

        const rawData = parsePostFormData(formData)
        const result = postSchema.safeParse(rawData)

        if (!result.success) {
            const errorMessage = result.error.issues.map(e => e.message).join(', ')
            return { error: errorMessage }
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
                return { error: 'Slug already exists' }
            }
            return { error: 'Failed to create post' }
        }

        revalidatePath('/posts')
        revalidatePath('/admin/posts')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
    redirect('/admin/posts')
}

export async function updatePost(id: string, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parsePostFormData(formData)
        const result = postSchema.safeParse(rawData)

        if (!result.success) {
            const errorMessage = result.error.issues.map(e => e.message).join(', ')
            return { error: errorMessage }
        }

        const { error } = await supabaseAdmin
            .from('posts')
            .update({
                ...result.data,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error('Update Post Error:', error)
            if (error.code === '23505') {
                return { error: 'Slug already exists' }
            }
            return { error: 'Failed to update post' }
        }

        revalidatePath('/posts')
        revalidatePath('/admin/posts')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
    redirect('/admin/posts')
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

        revalidatePath('/posts')
        revalidatePath('/admin/posts')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
