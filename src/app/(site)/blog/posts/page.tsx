import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

export const revalidate = 60

export default async function PostsPage() {
    const { data: posts } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('is_public', true)
        .order('published_at', { ascending: false })

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <header className="mb-12 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Posts</h1>
                <p className="mt-2 text-lg text-gray-600">Thoughts, updates, and articles.</p>
                <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">&larr; Back home</Link>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                {posts?.map((post) => (
                    <article key={post.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Link href={`/posts/${post.slug}`}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-indigo-600">{post.title}</h2>
                        </Link>
                        <div className="text-sm text-gray-500 mb-4">
                            {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                        </div>
                        {/* Simple excerpt (first 150 chars) */}
                        <p className="text-gray-600 line-clamp-3">
                            {post.content.slice(0, 150)}...
                        </p>
                        <Link href={`/posts/${post.slug}`} className="text-indigo-600 hover:underline text-sm font-medium mt-4 inline-block">
                            Read more &rarr;
                        </Link>
                    </article>
                ))}
                {(!posts || posts.length === 0) && (
                    <div className="text-center py-20 text-gray-500">
                        No posts found.
                    </div>
                )}
            </div>
        </div>
    )
}
