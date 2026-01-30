import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import EditPostForm from './EditPostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Pass minimal data to client component */}
            <EditPostForm post={post} />
        </div>
    )
}
