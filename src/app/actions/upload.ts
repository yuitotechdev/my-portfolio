'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { auth } from '@/auth'

export async function uploadImageAction(formData: FormData) {
    try {
        const session = await auth()
        const adminEmail = process.env.ADMIN_EMAIL

        // Security Check: Only Admin can upload
        if (!session?.user?.email || session.user.email !== adminEmail) {
            return { error: 'Unauthorized' }
        }

        const file = formData.get('file') as File
        const bucket = formData.get('bucket') as string

        if (!file || !bucket) {
            return { error: 'File and bucket are required' }
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        // Convert File to ArrayBuffer for Supabase Admin Upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabaseAdmin.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: `Failed to upload image: ${uploadError.message}` }
        }

        const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath)
        return data.publicUrl
    } catch (err: unknown) {
        console.error('Upload Action Error:', err)
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        return { error: message }
    }
}
