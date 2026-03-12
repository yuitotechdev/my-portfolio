'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { auth } from '@/auth'

export async function uploadImageAction(formData: FormData) {
    try {
        const session = await auth()
        const adminEmail = process.env.ADMIN_EMAIL
        const allowedBuckets = ['works', 'products', 'devices', 'avatars']

        if (!session?.user?.email || session.user.email !== adminEmail) {
            return { error: '管理者のみアップロードできます' }
        }

        const file = formData.get('file') as File
        const bucket = formData.get('bucket') as string

        if (!file || !bucket) {
            return { error: '画像ファイルと保存先が必要です' }
        }

        if (!allowedBuckets.includes(bucket)) {
            return { error: '保存先の指定が不正です' }
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

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
            return { error: `画像のアップロードに失敗しました: ${uploadError.message}` }
        }

        const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath)
        return data.publicUrl
    } catch (err: unknown) {
        console.error('Upload Action Error:', err)
        const message = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        return { error: message }
    }
}
