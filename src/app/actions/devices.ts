'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parseDeviceFormData, deviceSchema } from '@/lib/validators'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}

export async function createDevice(formData: FormData) {
    await requireAdmin()

    const rawData = parseDeviceFormData(formData)
    const result = deviceSchema.safeParse(rawData)

    if (!result.success) throw new Error(result.error.issues.map(e => e.message).join(', '))

    const { error } = await supabaseAdmin.from('devices').insert(result.data)

    if (error) throw new Error('Failed to create device')

    revalidatePath('/admin/devices')
    revalidatePath('/devices')
    redirect('/admin/devices')
}

export async function updateDevice(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parseDeviceFormData(formData)
    const result = deviceSchema.safeParse(rawData)

    if (!result.success) throw new Error(result.error.issues.map(e => e.message).join(', '))

    const { error } = await supabaseAdmin
        .from('devices')
        .update({ ...result.data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error('Failed to update device')

    revalidatePath('/admin/devices')
    revalidatePath('/devices')
    redirect('/admin/devices')
}

export async function deleteDevice(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin.from('devices').delete().eq('id', id)

    if (error) throw new Error('Failed to delete device')

    revalidatePath('/admin/devices')
    revalidatePath('/devices')
}
