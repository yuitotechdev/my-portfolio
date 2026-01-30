'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { parseProductFormData, productSchema } from '@/lib/validators'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
    }
}

export async function createProduct(formData: FormData) {
    await requireAdmin()

    const rawData = parseProductFormData(formData)
    const result = productSchema.safeParse(rawData)

    if (!result.success) {
        throw new Error(result.error.issues.map(e => e.message).join(', '))
    }

    const { error } = await supabaseAdmin.from('products').insert(result.data)

    if (error) throw new Error('Failed to create product')

    revalidatePath('/admin/products')
    revalidatePath('/products')
    redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
    await requireAdmin()

    const rawData = parseProductFormData(formData)
    const result = productSchema.safeParse(rawData)

    if (!result.success) {
        throw new Error(result.error.issues.map(e => e.message).join(', '))
    }

    const { error } = await supabaseAdmin
        .from('products')
        .update({ ...result.data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error('Failed to update product')

    revalidatePath('/admin/products')
    revalidatePath('/products')
    redirect('/admin/products')
}

export async function deleteProduct(id: string) {
    await requireAdmin()

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)

    if (error) throw new Error('Failed to delete product')

    revalidatePath('/admin/products')
    revalidatePath('/products')
}
