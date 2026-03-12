'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { parseNewsFormData, newsSchema } from '@/lib/validators'
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


export async function createNews(_prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'Server configuration incomplete')
        }
        await requireAdmin()

        const rawData = parseNewsFormData(formData)
        const result = newsSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
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
                return errorFormState('Slug already exists', {
                    slug: ['Slug already exists']
                })
            }
            return errorFormState('Failed to create news')
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')

        return successFormState('News created successfully', '/admin/news')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function updateNews(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'Server configuration incomplete')
        }
        await requireAdmin()

        const rawData = parseNewsFormData(formData)
        const result = newsSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        // Get existing record to preserve published_at
        const { data: existing } = await supabaseAdmin
            .from('news')
            .select('published_at')
            .eq('id', id)
            .single()

        const { error } = await supabaseAdmin
            .from('news')
            .update({
                ...result.data,
                published_at: result.data.is_public 
                    ? (existing?.published_at || new Date().toISOString()) 
                    : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error('Update News Error:', error)
            if (error.code === '23505') {
                return errorFormState('Slug already exists', {
                    slug: ['Slug already exists']
                })
            }
            return errorFormState('Failed to update news')
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')

        return successFormState('News updated successfully', '/admin/news')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function deleteNews(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin
            .from('news')
            .delete()
            .eq('id', id)

        if (error) {
            return { error: 'Failed to delete news' }
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}

export async function deleteMultipleNews(ids: string[]) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin
            .from('news')
            .delete()
            .in('id', ids)

        if (error) {
            return { error: 'Failed to delete multiple news' }
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
