'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parseWorkFormData, workSchema } from '@/lib/validators'

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
    await requireAdmin()

    const rawData = parseWorkFormData(formData)

    const result = workSchema.safeParse(rawData)

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(', ')
        throw new Error(errorMessage)
    }

    // Check for slug collision? Supabase unique constraint will handle it, but better to check?
    // For now, let DB unique constraint throw if duplicated, we verify via error catch.

    // Clean up empty URLs to null for DB cleaner data if needed, or keep empty string.
    // Supabase text optional is nullable or text. Text empty string is fine.

    const { error } = await supabaseAdmin
        .from('works')
        .insert({
            ...result.data,
            published_at: result.data.is_public ? new Date().toISOString() : null
        })

    if (error) {
        console.error('Create Work Error:', error)
        if (error.code === '23505') { // Unique violation
            throw new Error('Slug already exists')
        }
        throw new Error('Failed to create work')
    }

    revalidatePath('/works')
    revalidatePath('/admin/works')
    redirect('/admin/works')
}

export async function updateWork(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parseWorkFormData(formData)
    const result = workSchema.safeParse(rawData)

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(', ')
        throw new Error(errorMessage)
    }

    const { error } = await supabaseAdmin
        .from('works')
        .update({
            ...result.data,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Update Work Error:', error)
        if (error.code === '23505') {
            throw new Error('Slug already exists')
        }
        throw new Error('Failed to update work')
    }

    revalidatePath('/works')
    revalidatePath('/admin/works')
    redirect('/admin/works')
}

export async function deleteWork(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin
        .from('works')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Failed to delete work')
    }

    revalidatePath('/works')
    revalidatePath('/admin/works')
}
