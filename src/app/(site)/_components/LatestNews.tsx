import { NewsRepository } from '@/lib/repositories/news'
import { Reveal, StaggerList } from '@/components/ui/motion'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { format } from 'date-fns'

export async function LatestNews() {
    const recentNews = (await NewsRepository.getAllPublic()).slice(0, 3)

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-3xl mx-auto">
                <Reveal>
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">News</h2>
                        <Link href="/news" className="text-sm font-medium hover:underline text-gray-600">
                            View all
                        </Link>
                    </div>
                </Reveal>

                <StaggerList className="space-y-8">
                    {recentNews.map((news) => (
                        <Link key={news.id} href={`/news/${news.slug}`} className="block group">
                            <article className="border-l-2 border-gray-100 pl-6 py-1 transition-colors hover:border-indigo-500">
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-1">
                                    {news.published_at && (
                                        <time className="font-mono">
                                            {format(new Date(news.published_at), 'yyyy.MM.dd')}
                                        </time>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {news.title}
                                </h3>
                            </article>
                        </Link>
                    ))}
                    {recentNews.length === 0 && (
                        <div className="text-gray-400 py-8">No updates yet.</div>
                    )}
                </StaggerList>
            </div>
        </section>
    )
}

export function LatestNewsSkeleton() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-5 w-16" />
                </div>

                <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="pl-6 border-l-2 border-gray-100 py-1 space-y-2">
                            <Skeleton className="h-4 w-24" /> {/* Date */}
                            <Skeleton className="h-6 w-3/4" /> {/* Title */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
