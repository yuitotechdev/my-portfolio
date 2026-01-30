import { supabasePublic as supabase } from '@/lib/supabase-client'

export type Profile = {
    id: string
    name: string
    bio_short: string | null
    bio_medium: string | null
    bio_long: string | null
    avatar_url: string | null
    updated_at: string
}

export type LinkItem = {
    id: string
    title: string
    url: string
    icon_name: string | null
    order: number
}

export const ProfileRepository = {
    async getProfile(): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profile')
            .select('*')
            .single()

        if (error) {
            // It's possible profile doesn't exist yet
            return null
        }

        return data as Profile
    },

    async getLinks(): Promise<LinkItem[]> {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('order', { ascending: true })

        if (error) {
            console.error('Error fetching links:', error)
            return []
        }

        return data as LinkItem[]
    }
}
