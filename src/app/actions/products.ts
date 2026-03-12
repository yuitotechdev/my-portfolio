'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { parseProductFormData, productSchema } from '@/lib/validators'
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

export async function createProduct(_prevState: AdminFormState, formData: FormData) {
    try {
        await requireAdmin()

        const rawData = parseProductFormData(formData)
        const result = productSchema.safeParse(rawData)

        if (!result.success) {
            return errorFormState(
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin.from('products').insert(result.data)

        if (error) return errorFormState('Failed to create product')

        revalidatePath('/admin/products')
        revalidatePath('/products')

        return successFormState('Product created successfully', '/admin/products')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
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
                'Please check the form fields',
                zodIssuesToFieldErrors(result.error.issues)
            )
        }

        const { error } = await supabaseAdmin
            .from('products')
            .update({ ...result.data, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) return errorFormState('Failed to update product')

        revalidatePath('/admin/products')
        revalidatePath('/products')

        return successFormState('Product updated successfully', '/admin/products')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return errorFormState(message)
    }
}

export async function deleteProduct(id: string) {
    try {
        await requireAdmin()

        const { error } = await supabaseAdmin.from('products').delete().eq('id', id)

        if (error) return { error: 'Failed to delete product' }

        revalidatePath('/admin/products')
        revalidatePath('/products')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
