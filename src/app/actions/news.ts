'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parseNewsFormData, newsSchema } from '@/lib/validators'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}


export async function createNews(formData: FormData) {
    await requireAdmin()

    const rawData = parseNewsFormData(formData)
    const result = newsSchema.safeParse(rawData)

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(', ')
        throw new Error(errorMessage)
    }

    const { error } = await supabaseAdmin
        .from('news')
        .insert({
            ...result.data,
            published_at: result.data.is_public ? new Date().toISOString() : null
        })

    if (error) {
        console.error('Create News Error:', error)
        if (error.code === '23505') {
            throw new Error('Slug already exists')
        }
        throw new Error('Failed to create news')
    }

    revalidatePath('/news')
    revalidatePath('/admin/news')
    redirect('/admin/news')
}

export async function updateNews(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parseNewsFormData(formData)
    const result = newsSchema.safeParse(rawData)

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(', ')
        throw new Error(errorMessage)
    }

    const { error } = await supabaseAdmin
        .from('news')
        .update({
            ...result.data,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Update News Error:', error)
        if (error.code === '23505') {
            throw new Error('Slug already exists')
        }
        throw new Error('Failed to update news')
    }

    revalidatePath('/news')
    revalidatePath('/admin/news')
    redirect('/admin/news')
}

export async function deleteNews(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin
        .from('news')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Failed to delete news')
    }

    revalidatePath('/news')
    revalidatePath('/admin/news')
}
