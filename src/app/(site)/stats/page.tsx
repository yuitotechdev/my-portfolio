import { WorksRepository } from '@/lib/repositories/works'
import { PostsRepository } from '@/lib/repositories/posts'
import { NewsRepository } from '@/lib/repositories/news'
import { Reveal, StaggerList } from '@/components/ui/motion'
import { BarChart3, FileText, Newspaper, FolderGit2 } from 'lucide-react'

export const metadata = {
    title: 'Stats - Portfolio',
    description: 'Site statistics.',
}

export default async function StatsPage() {
    const publicWorks = await WorksRepository.getAllPublic()
    const publicPosts = await PostsRepository.getAllPublic()
    const publicNews = await NewsRepository.getAllPublic()

    const stats = [
        { label: 'Public Works', value: publicWorks.length, icon: FolderGit2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Articles', value: publicPosts.length, icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'News Items', value: publicNews.length, icon: Newspaper, color: 'text-orange-500', bg: 'bg-orange-50' },
    ]

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Reveal>
                    <header className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight flex items-center gap-4">
                            <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-gray-900" />
                            Stats
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            Open metrics about this portfolio.
                        </p>
                    </header>
                </Reveal>

                <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </StaggerList>

                <Reveal delay={0.2}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Analytics</h3>
                        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200 text-gray-400">
                            Analytics Graph Placeholder (Connect Cloudflare/Vercel)
                        </div>
                    </div>
                </Reveal>
            </div>
        </main>
    )
}
