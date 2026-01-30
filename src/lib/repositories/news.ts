import { supabasePublic as supabase } from '@/lib/supabase-client'

export type News = {
    id: string
    title: string
    slug: string
    content: string | null
    published_at: string | null
    created_at: string
    updated_at: string
}

export const NewsRepository = {
    async getAllPublic(): Promise<News[]> {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .not('published_at', 'is', null)
            .order('published_at', { ascending: false })

        if (error) {
            console.error('Error fetching news:', error)
            return []
        }

        return data as News[]
    },

    async getBySlug(slug: string): Promise<News | null> {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('slug', slug)
            .not('published_at', 'is', null)
            .single()

        if (error) {
            return null
        }

        return data as News
    }
}
