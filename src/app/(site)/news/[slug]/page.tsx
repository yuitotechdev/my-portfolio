import { NewsRepository } from '@/lib/repositories/news'
import { Reveal } from '@/components/ui/motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const news = await NewsRepository.getBySlug(slug)
    if (!news) return { title: 'Not Found' }
    return {
        title: `${news.title} - News`,
        description: news.content?.slice(0, 160)
    }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const news = await NewsRepository.getBySlug(slug)

    if (!news) {
        notFound()
    }

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-3xl mx-auto">
            <Reveal>
                <Link
                    href="/news"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-12 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to News
                </Link>
            </Reveal>

            <article>
                <Reveal delay={0.1}>
                    <header className="mb-8 border-b border-gray-100 pb-8">
                        {news.published_at && (
                            <time className="text-gray-400 font-mono text-sm mb-2 block">
                                {format(new Date(news.published_at), 'yyyy.MM.dd')}
                            </time>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            {news.title}
                        </h1>
                    </header>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="prose prose-gray max-w-none whitespace-pre-wrap">
                        {news.content}
                    </div>
                </Reveal>
            </article>
        </main>
    )
}
