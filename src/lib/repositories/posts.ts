import { supabasePublic as supabase } from '@/lib/supabase-client'

export type Post = {
    id: string
    title: string
    slug: string
    content: string
    published_at: string | null
    created_at: string
    updated_at: string
}

export const PostsRepository = {
    async getAllPublic(): Promise<Post[]> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .not('published_at', 'is', null)
            .order('published_at', { ascending: false })

        if (error) {
            console.error('Error fetching posts:', error)
            return []
        }

        return data as Post[]
    },

    async getBySlug(slug: string): Promise<Post | null> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .not('published_at', 'is', null)
            .single()

        if (error) {
            return null
        }

        return data as Post
    }
}
