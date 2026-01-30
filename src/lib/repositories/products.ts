import { supabasePublic as supabase } from '@/lib/supabase-client'

export type Product = {
    id: string
    title: string
    description: string | null
    url: string
    price_display: string | null
    thumbnail_url: string | null
    order: number
    is_public: boolean
    created_at: string
}

export const ProductsRepository = {
    async getAllPublic(): Promise<Product[]> {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_public', true)
            .order('order', { ascending: true })

        return (data as Product[]) || []
    },

    async getAllAdmin(): Promise<Product[]> {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('order', { ascending: true })

        return (data as Product[]) || []
    },

    async getById(id: string): Promise<Product | null> {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        return data as Product
    }
}
