'use server'

import { auth } from '@/auth'
import { backupSchema } from '@/lib/backup-schema'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('管理者のみ操作できます')
    }
}

export async function exportData() {
    await requireAdmin()

    const [
        { data: works },
        { data: posts },
        { data: news },
        { data: profile },
        { data: links }
    ] = await Promise.all([
        supabaseAdmin.from('works').select('*'),
        supabaseAdmin.from('posts').select('*'),
        supabaseAdmin.from('news').select('*'),
        supabaseAdmin.from('profile').select('*'),
        supabaseAdmin.from('links').select('*')
    ])

    return {
        works,
        posts,
        news,
        profile,
        links,
        exported_at: new Date().toISOString()
    }
}

export type ImportSummary = {
    valid: boolean
    counts: {
        works: number
        posts: number
        news: number
        profile: number
        links: number
    }
    errors?: string[]
}

export async function validateImport(jsonContent: string): Promise<ImportSummary> {
    await requireAdmin()

    let data
    try {
        data = JSON.parse(jsonContent)
    } catch {
        return {
            valid: false,
            counts: { works: 0, posts: 0, news: 0, profile: 0, links: 0 },
            errors: ['JSONの形式が不正です']
        }
    }

    const result = backupSchema.safeParse(data)

    if (!result.success) {
        return {
            valid: false,
            counts: { works: 0, posts: 0, news: 0, profile: 0, links: 0 },
            errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        }
    }

    const validData = result.data

    return {
        valid: true,
        counts: {
            works: validData.works?.length || 0,
            posts: validData.posts?.length || 0,
            news: validData.news?.length || 0,
            profile: validData.profile?.length || 0,
            links: validData.links?.length || 0
        }
    }
}

export async function executeImport(jsonContent: string) {
    await requireAdmin()

    const result = backupSchema.safeParse(JSON.parse(jsonContent))
    if (!result.success) {
        throw new Error('取り込み前の検証に失敗しました')
    }

    const data = result.data

    const restoreTable = async (table: string, rows: Record<string, unknown>[]) => {
        if (!rows || rows.length === 0) {
            return
        }

        const { error } = await supabaseAdmin.from(table).upsert(rows)
        if (error) {
            console.error(`Error restoring ${table}:`, error)
            throw new Error(`${table} の復元に失敗しました`)
        }
    }

    await restoreTable('works', data.works || [])
    await restoreTable('posts', data.posts || [])
    await restoreTable('news', data.news || [])
    await restoreTable('profile', data.profile || [])
    await restoreTable('links', data.links || [])

    revalidatePath('/', 'layout')
}
