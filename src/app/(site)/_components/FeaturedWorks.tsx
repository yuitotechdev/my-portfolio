import { WorksRepository } from '@/lib/repositories/works'
import { Reveal, StaggerList } from '@/components/ui/motion'
import { WorkCard } from '@/app/(site)/works/_components/WorkCard'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export async function FeaturedWorks() {
    // Intentionally fast fetch, but Suspense will handle if slow
    const recentWorks = (await WorksRepository.getAllPublic()).slice(0, 3)

    return (
        <section className="py-24 px-6 md:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <Reveal>
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Featured Works</h2>
                        <Link href="/works" className="text-sm font-medium hover:underline text-gray-600">
                            View all
                        </Link>
                    </div>
                </Reveal>

                {recentWorks.length > 0 ? (
                    <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentWorks.map((work) => (
                            <WorkCard key={work.id} work={work} />
                        ))}
                    </StaggerList>
                ) : (
                    <div className="text-gray-400 py-12">No works published yet.</div>
                )}
            </div>
        </section>
    )
}

export function FeaturedWorksSkeleton() {
    return (
        <section className="py-24 px-6 md:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <Skeleton className="h-10 w-48" /> {/* Title */}
                    <Skeleton className="h-5 w-16" />  {/* View all */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full rounded-xl" /> {/* Thumbnail */}
                            <Skeleton className="h-6 w-3/4" /> {/* Title */}
                            <Skeleton className="h-4 w-full" /> {/* Tags */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
