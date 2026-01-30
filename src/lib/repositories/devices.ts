import { supabasePublic as supabase } from '@/lib/supabase-client'

export type Device = {
    id: string
    name: string
    category: string | null
    description: string | null
    purchase_reason: string | null
    link_url: string | null
    order: number
    is_public: boolean
    created_at: string
}

export const DevicesRepository = {
    async getAllPublic(): Promise<Device[]> {
        const { data } = await supabase
            .from('devices')
            .select('*')
            .eq('is_public', true)
            .order('order', { ascending: true })

        return (data as Device[]) || []
    },

    async getAllAdmin(): Promise<Device[]> {
        const { data } = await supabase
            .from('devices')
            .select('*')
            .order('order', { ascending: true })

        return (data as Device[]) || []
    },

    async getById(id: string): Promise<Device | null> {
        const { data } = await supabase
            .from('devices')
            .select('*')
            .eq('id', id)
            .single()

        return data as Device
    }
}
