'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parseWorkFormData, workSchema } from '@/lib/validators'
import { validateServerConfig } from '@/lib/env-check'

// Helper to ensure admin (Double check in action level is good practice)
async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}

// ZodError removed

export async function createWork(formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return { error: config.message }
        }

        await requireAdmin()

        const rawData = parseWorkFormData(formData)
        const result = workSchema.safeParse(rawData)

        if (!result.success) {
            const errorMessage = result.error.issues.map(e => e.message).join(', ')
            return { error: errorMessage }
        }

        const { error } = await supabaseAdmin
            .from('works')
            .insert({
                ...result.data,
                published_at: result.data.is_public ? new Date().toISOString() : null
            })

        if (error) {
            console.error('Create Work Error:', error)
            if (error.code === '23505') {
                return { error: 'Slug already exists' }
            }
            return { error: 'Failed to create work' }
        }

        revalidatePath('/works')
        revalidatePath('/admin/works')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
    // redirect must be outside try-catch to work correctly in Next.js Server Actions
    redirect('/admin/works')
}

export async function updateWork(id: string, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return { error: config.message }
        }

        await requireAdmin()

        const rawData = parseWorkFormData(formData)
        const result = workSchema.safeParse(rawData)

        if (!result.success) {
            const errorMessage = result.error.issues.map(e => e.message).join(', ')
            return { error: errorMessage }
        }

        // Get existing record to preserve published_at
        const { data: existing } = await supabaseAdmin
            .from('works')
            .select('published_at')
            .eq('id', id)
            .single()

        const { error } = await supabaseAdmin
            .from('works')
            .update({
                ...result.data,
                published_at: result.data.is_public 
                    ? (existing?.published_at || new Date().toISOString()) 
                    : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error('Update Work Error:', error)
            if (error.code === '23505') {
                return { error: 'Slug already exists' }
            }
            return { error: 'Failed to update work' }
        }

        revalidatePath('/works')
        revalidatePath('/admin/works')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
    redirect('/admin/works')
}

export async function deleteWork(id: string) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return { error: config.message }
        }

        await requireAdmin()

        const { error } = await supabaseAdmin
            .from('works')
            .delete()
            .eq('id', id)

        if (error) {
            return { error: 'Failed to delete work' }
        }

        revalidatePath('/works')
        revalidatePath('/admin/works')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
