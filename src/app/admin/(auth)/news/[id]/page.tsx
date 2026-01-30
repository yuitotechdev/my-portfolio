import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import EditNewsForm from './EditNewsForm'

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { data: news } = await supabaseAdmin
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

    if (!news) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <EditNewsForm news={news} />
        </div>
    )
}
