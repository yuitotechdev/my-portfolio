import { PostsRepository } from '@/lib/repositories/posts'
import { Reveal } from '@/components/ui/motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await PostsRepository.getBySlug(slug)
    if (!post) return { title: 'Not Found' }
    return {
        title: `${post.title} - Blog`,
        description: post.content?.slice(0, 160)
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await PostsRepository.getBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-3xl mx-auto">
            <Reveal>
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-12 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>
            </Reveal>

            <article>
                <Reveal delay={0.1}>
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 leading-tight">
                            {post.title}
                        </h1>
                        {post.published_at && (
                            <time className="text-gray-500 font-mono text-sm">
                                {format(new Date(post.published_at), 'MMMM d, yyyy')}
                            </time>
                        )}
                    </header>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="prose prose-lg prose-gray max-w-none hover:prose-a:text-indigo-600 prose-a:transition-colors">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </Reveal>
            </article>
        </main>
    )
}
