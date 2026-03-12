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
import { parsePostFormData, postSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function createPost(_prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'サーバー設定が不足しています')
        }

        await requireAdmin()

        const rawData = parsePostFormData(formData)
        const result = postSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin
            .from('posts')
            .insert({
                ...result.data,
                published_at: result.data.is_public ? new Date().toISOString() : null
            })

        if (error) {
            console.error('Create Post Error:', error)
            if (error.code === '23505') {
                return errorFormState('同じURLスラッグがすでに使われています', {
                    slug: ['同じURLスラッグがすでに使われています']
                })
            }
            return errorFormState('ブログ記事の追加に失敗しました')
        }

        revalidatePath('/blog')
        revalidatePath('/blog/posts')
        revalidatePath('/admin/posts')

        return successFormState('ブログ記事を追加しました', '/admin/posts')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function updatePost(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        const config = validateServerConfig()
        if (!config.valid) {
            return errorFormState(config.message || 'サーバー設定が不足しています')
        }

        await requireAdmin()

        const rawData = parsePostFormData(formData)
        const result = postSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { data: existing } = await supabaseAdmin
            .from('posts')
            .select('published_at')
            .eq('id', id)
            .single()

        const { error } = await supabaseAdmin
            .from('posts')
            .update({
                ...result.data,
                published_at: result.data.is_public
                    ? (existing?.published_at || new Date().toISOString())
                    : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error('Update Post Error:', error)
            if (error.code === '23505') {
                return errorFormState('同じURLスラッグがすでに使われています', {
                    slug: ['同じURLスラッグがすでに使われています']
                })
            }
            return errorFormState('ブログ記事の更新に失敗しました')
        }

        revalidatePath('/blog')
        revalidatePath('/blog/posts')
        revalidatePath('/admin/posts')

        return successFormState('ブログ記事を更新しました', '/admin/posts')
    } catch (err: unknown) {
        console.error('Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function deletePost(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('id', id)

        if (error) {
            return { error: 'ブログ記事の削除に失敗しました' }
        }

        revalidatePath('/blog')
        revalidatePath('/blog/posts')
        revalidatePath('/admin/posts')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}
