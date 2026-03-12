'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { parseProfileFormData, profileSchema, parseLinkFormData, linkSchema } from '@/lib/validators'
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

// Profile Actions
export async function updateProfile(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseProfileFormData(formData)
        const result = profileSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        // Check if profile exists (Safe check against multiple rows)
        const { data: existingRows } = await supabaseAdmin.from('profile').select('id').limit(1)
        const existing = existingRows?.[0]

        let error
        if (existing) {
            const { error: updateError } = await supabaseAdmin
                .from('profile')
                .update({ ...result.data, updated_at: new Date().toISOString() })
                .eq('id', existing.id)
            error = updateError
        } else {
            const { error: insertError } = await supabaseAdmin
                .from('profile')
                .insert({ ...result.data })
            error = insertError
        }

        if (error) return errorFormState('Failed to update profile')

        revalidatePath('/')
        revalidatePath('/about')
        revalidatePath('/admin/settings')

        return successFormState('Profile updated successfully')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

// Link Actions
export async function createLink(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseLinkFormData(formData)
        const result = linkSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin.from('links').insert(result.data)
        if (error) return errorFormState('Failed to create link')

        revalidatePath('/')
        revalidatePath('/admin/settings')

        return successFormState('Link created successfully')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function updateLink(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parseLinkFormData(formData)
    const result = linkSchema.safeParse(rawData)

    if (!result.success) throw new Error(result.error.issues.map(e => e.message).join(', '))

    const { error } = await supabaseAdmin
        .from('links')
        .update({ ...result.data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error('Failed to update link')

    revalidatePath('/')
    revalidatePath('/admin/settings')
}

export async function deleteLink(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin.from('links').delete().eq('id', id)
    if (error) throw new Error('Failed to delete link')

    revalidatePath('/')
    revalidatePath('/admin/settings')
}
