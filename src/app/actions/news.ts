'use server'

import { auth } from '@/auth'
import {
    type AdminFormState,
    errorFormState,
    successFormState,
    zodIssuesToFieldErrors
} from '@/lib/admin-form-state'
import { validateServerConfig } from '@/lib/env-check'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { newsSchema, parseNewsFormData } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function createNews(_prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'サーバー設定が不足しています')
        }

        await requireAdmin()

        const rawData = parseNewsFormData(formData)
        const result = newsSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
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
                return errorFormState('同じURLスラッグがすでに使われています', {
                    slug: ['同じURLスラッグがすでに使われています']
                })
            }
            return errorFormState('お知らせの追加に失敗しました')
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')

        return successFormState('お知らせを追加しました', '/admin/news')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function updateNews(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'サーバー設定が不足しています')
        }

        await requireAdmin()

        const rawData = parseNewsFormData(formData)
        const result = newsSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

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
                return errorFormState('同じURLスラッグがすでに使われています', {
                    slug: ['同じURLスラッグがすでに使われています']
                })
            }
            return errorFormState('お知らせの更新に失敗しました')
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')

        return successFormState('お知らせを更新しました', '/admin/news')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
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
            return { error: 'お知らせの削除に失敗しました' }
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
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
            return { error: 'お知らせの一括削除に失敗しました' }
        }

        revalidatePath('/')
        revalidatePath('/news')
        revalidatePath('/admin/news')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}
