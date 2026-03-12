'use server'

import { auth } from '@/auth'
import {
    type AdminFormState,
    errorFormState,
    successFormState,
    zodIssuesToFieldErrors
} from '@/lib/admin-form-state'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deviceSchema, parseDeviceFormData } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function createDevice(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseDeviceFormData(formData)
        const result = deviceSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin.from('devices').insert(result.data)

        if (error) {
            return errorFormState('デバイスの追加に失敗しました')
        }

        revalidatePath('/admin/devices')
        revalidatePath('/devices')

        return successFormState('デバイスを追加しました', '/admin/devices')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
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
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin
            .from('devices')
            .update({ ...result.data, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            return errorFormState('デバイスの更新に失敗しました')
        }

        revalidatePath('/admin/devices')
        revalidatePath('/devices')

        return successFormState('デバイスを更新しました', '/admin/devices')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function deleteDevice(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin.from('devices').delete().eq('id', id)

        if (error) {
            return { error: 'デバイスの削除に失敗しました' }
        }

        revalidatePath('/admin/devices')
        revalidatePath('/devices')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}
