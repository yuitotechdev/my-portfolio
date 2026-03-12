'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { parseDeviceFormData, deviceSchema } from '@/lib/validators'
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

export async function createDevice(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseDeviceFormData(formData)
        const result = deviceSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin.from('devices').insert(result.data)

        if (error) return errorFormState('Failed to create device')

        revalidatePath('/admin/devices')
        revalidatePath('/devices')

        return successFormState('Device created successfully', '/admin/devices')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function updateDevice(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseDeviceFormData(formData)
        const result = deviceSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin
            .from('devices')
            .update({ ...result.data, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) return errorFormState('Failed to update device')

        revalidatePath('/admin/devices')
        revalidatePath('/devices')

        return successFormState('Device updated successfully', '/admin/devices')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function deleteDevice(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin.from('devices').delete().eq('id', id)

        if (error) return { error: 'Failed to delete device' }

        revalidatePath('/admin/devices')
        revalidatePath('/devices')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
