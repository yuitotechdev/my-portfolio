import { supabasePublic as supabase } from '@/lib/supabase-client'

export type Work = {
    id: string
    title: string
    slug: string
    description: string | null
    thumbnail_url: string | null
    screenshots: string[]
    tech_stack: string[]
    deployment_url: string | null
    github_url: string | null
    published_at: string | null
    order?: number
    created_at: string
}

export const WorksRepository = {
    async getAllPublic(): Promise<Work[]> {
        const { data, error } = await supabase
            .from('works')
            .select('*')
            .eq('is_public', true)
            .order('order', { ascending: true })
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching works:', error)
            return []
        }

        return (data as Work[]).map((work) => ({
            ...work,
            screenshots: work.screenshots || []
        }))
    },

    async getBySlug(slug: string): Promise<Work | null> {
        const { data, error } = await supabase
            .from('works')
            .select('*')
            .eq('slug', slug)
            .eq('is_public', true)
            .single()

        if (error) {
            return null
        }

        return {
            ...(data as Work),
            screenshots: (data as Work).screenshots || []
        }
    }
}
