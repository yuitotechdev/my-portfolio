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
import { parseWorkFormData, workSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function createWork(_prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'サーバー設定が不足しています')
        }

        await requireAdmin()

        const rawData = parseWorkFormData(formData)
        const result = workSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
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
                return errorFormState('同じURLスラッグがすでに使われています', {
                    slug: ['同じURLスラッグがすでに使われています']
                })
            }
            return errorFormState('制作実績の追加に失敗しました')
        }

        revalidatePath('/')
        revalidatePath('/works')
        revalidatePath('/admin/works')

        return successFormState('制作実績を追加しました', '/admin/works')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function updateWork(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'サーバー設定が不足しています')
        }

        await requireAdmin()

        const rawData = parseWorkFormData(formData)
        const result = workSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

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
                return errorFormState('同じURLスラッグがすでに使われています', {
                    slug: ['同じURLスラッグがすでに使われています']
                })
            }
            return errorFormState('制作実績の更新に失敗しました')
        }

        revalidatePath('/')
        revalidatePath('/works')
        revalidatePath('/admin/works')

        return successFormState('制作実績を更新しました', '/admin/works')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function deleteWork(id: string) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return { error: config.message || 'サーバー設定が不足しています' }
        }

        await requireAdmin()

        const { error } = await supabaseAdmin
            .from('works')
            .delete()
            .eq('id', id)

        if (error) {
            return { error: '制作実績の削除に失敗しました' }
        }

        revalidatePath('/')
        revalidatePath('/works')
        revalidatePath('/admin/works')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}

export async function updateWorkOrder(items: Array<{ id: string; order: number }>) {
    try {
        await requireAdmin()

        const payload = items.map((item) => ({
            id: item.id,
            order: item.order,
            updated_at: new Date().toISOString()
        }))

        const { error } = await supabaseAdmin
            .from('works')
            .upsert(payload, { onConflict: 'id' })

        if (error) {
            return { error: '並び順の保存に失敗しました' }
        }

        revalidatePath('/')
        revalidatePath('/works')
        revalidatePath('/admin/works')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}
