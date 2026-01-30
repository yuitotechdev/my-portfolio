'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        throw new Error('Unauthorized')
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

import { backupSchema } from '@/lib/backup-schema' // removed BackupData

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
    } catch { // removed e
        return { valid: false, counts: { works: 0, posts: 0, news: 0, profile: 0, links: 0 }, errors: ['Invalid JSON format'] }
    }

    const result = backupSchema.safeParse(data)

    if (!result.success) {
        return {
            valid: false,
            counts: { works: 0, posts: 0, news: 0, profile: 0, links: 0 },
            errors: result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`)
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
        throw new Error('Validation failed during execution')
    }

    const data = result.data

    const restoreTable = async (table: string, rows: Record<string, unknown>[]) => {
        if (!rows || rows.length === 0) return
        const { error } = await supabaseAdmin.from(table).upsert(rows)
        if (error) {
            console.error(`Error restoring ${table}:`, error)
            throw new Error(`Failed to restore ${table}`)
        }
    }

    // Restore sequentially
    await restoreTable('works', data.works || [])
    await restoreTable('posts', data.posts || [])
    await restoreTable('news', data.news || [])
    await restoreTable('profile', data.profile || [])
    await restoreTable('links', data.links || [])

    revalidatePath('/', 'layout')
}
