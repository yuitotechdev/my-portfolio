'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parsePostFormData, postSchema } from '@/lib/validators'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}


export async function createPost(formData: FormData) {
    await requireAdmin()

    const rawData = parsePostFormData(formData)
    const result = postSchema.safeParse(rawData)

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(', ')
        throw new Error(errorMessage)
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
            throw new Error('Slug already exists')
        }
        throw new Error('Failed to create post')
    }

    revalidatePath('/posts')
    revalidatePath('/admin/posts')
    redirect('/admin/posts')
}

export async function updatePost(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parsePostFormData(formData)
    const result = postSchema.safeParse(rawData)

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(', ')
        throw new Error(errorMessage)
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
            throw new Error('Slug already exists')
        }
        throw new Error('Failed to update post')
    }

    revalidatePath('/posts')
    revalidatePath('/admin/posts')
    redirect('/admin/posts')
}

export async function deletePost(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Failed to delete post')
    }

    revalidatePath('/posts')
    revalidatePath('/admin/posts')
}
