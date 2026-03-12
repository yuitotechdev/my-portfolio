'use server'

import { auth } from '@/auth'
import {
    type AdminFormState,
    errorFormState,
    successFormState,
    zodIssuesToFieldErrors
} from '@/lib/admin-form-state'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { linkSchema, parseLinkFormData, parseProfileFormData, profileSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function updateProfile(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseProfileFormData(formData)
        const result = profileSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

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

        if (error) {
            return errorFormState('プロフィールの更新に失敗しました')
        }

        revalidatePath('/')
        revalidatePath('/about')
        revalidatePath('/admin/settings')

        return successFormState('プロフィールを更新しました')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function createLink(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseLinkFormData(formData)
        const result = linkSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin.from('links').insert(result.data)
        if (error) {
            return errorFormState('リンクの追加に失敗しました')
        }

        revalidatePath('/')
        revalidatePath('/admin/settings')

        return successFormState('リンクを追加しました')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function updateLink(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parseLinkFormData(formData)
    const result = linkSchema.safeParse(rawData)

    if (!result.success) {
        throw new Error(result.error.issues.map((issue) => issue.message).join(', '))
    }

    const { error } = await supabaseAdmin
        .from('links')
        .update({ ...result.data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        throw new Error('リンクの更新に失敗しました')
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')
}

export async function deleteLink(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin.from('links').delete().eq('id', id)
    if (error) {
        throw new Error('リンクの削除に失敗しました')
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')
}
