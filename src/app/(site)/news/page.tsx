import { NewsRepository } from '@/lib/repositories/news'
import { StaggerList, Reveal } from '@/components/ui/motion'
import Link from 'next/link'
import { format } from 'date-fns'

export const metadata = {
    title: 'News - Portfolio',
    description: 'Latest announcements and updates.',
}

export default async function NewsPage() {
    const newsList = await NewsRepository.getAllPublic()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-3xl mx-auto">
            <Reveal>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">News</h1>
                <p className="text-xl text-gray-600 mb-16">
                    Latest announcements and updates.
                </p>
            </Reveal>

            <StaggerList className="border-l border-gray-100 ml-3 space-y-12">
                {newsList.map((news) => (
                    <div key={news.id} className="relative pl-8 md:pl-12 group">
                        {/* Timeline dot */}
                        <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-gray-200 group-hover:bg-indigo-500 transition-colors" />

                        <Link href={`/news/${news.slug}`} className="block">
                            <div className="flex items-center mb-1">
                                {news.published_at && (
                                    <time className="text-sm text-gray-400 font-mono">
                                        {format(new Date(news.published_at), 'yyyy.MM.dd')}
                                    </time>
                                )}
                            </div>
                            <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                                {news.title}
                            </h2>
                            {news.content && (
                                <p className="text-gray-600">
                                    {news.content.slice(0, 120)}...
                                </p>
                            )}
                        </Link>
                    </div>
                ))}
            </StaggerList>

            {newsList.length === 0 && (
                <Reveal>
                    <div className="py-12 pl-8 text-gray-400">
                        No news yet.
                    </div>
                </Reveal>
            )}
        </main>
    )
}
