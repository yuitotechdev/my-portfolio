import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Allow params to be passed
interface PageProps {
    params: Promise<{ slug: string }>
}

// Force dynamic if needed, or ISR. Using ISR for posts usually.
export const revalidate = 60

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params

    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <article className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm">
                {/* Header */}
                <header className="px-8 py-12 border-b">
                    <Link href="/posts" className="text-gray-500 hover:text-gray-900 text-sm mb-4 inline-block">&larr; Back to posts</Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    <time className="text-gray-500 text-sm">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                    </time>
                </header>

                {/* Content */}
                <div className="px-8 py-12 prose prose-lg max-w-none prose-indigo">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    )
}
