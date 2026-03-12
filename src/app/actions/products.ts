'use server'

import { auth } from '@/auth'
import {
    type AdminFormState,
    errorFormState,
    successFormState,
    zodIssuesToFieldErrors
} from '@/lib/admin-form-state'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { parseProductFormData, productSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function createProduct(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseProductFormData(formData)
        const result = productSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin.from('products').insert(result.data)

        if (error) {
            return errorFormState('プロダクトの追加に失敗しました')
        }

        revalidatePath('/admin/products')
        revalidatePath('/products')

        return successFormState('プロダクトを追加しました', '/admin/products')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function updateProduct(id: string, _prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseProductFormData(formData)
        const result = productSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                '入力内容を確認してください',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin
            .from('products')
            .update({ ...result.data, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            return errorFormState('プロダクトの更新に失敗しました')
        }

        revalidatePath('/admin/products')
        revalidatePath('/products')

        return successFormState('プロダクトを更新しました', '/admin/products')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return errorFormState(message)
    }
}

export async function deleteProduct(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin.from('products').delete().eq('id', id)

        if (error) {
            return { error: 'プロダクトの削除に失敗しました' }
        }

        revalidatePath('/admin/products')
        revalidatePath('/products')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}
