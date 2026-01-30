import { PostsRepository } from '@/lib/repositories/posts'
import { StaggerList, Reveal } from '@/components/ui/motion'
import Link from 'next/link'
import { format } from 'date-fns'

export const metadata = {
    title: 'Blog - Portfolio',
    description: 'Thoughts, learnings, and updates.',
}

export default async function BlogPage() {
    const posts = await PostsRepository.getAllPublic()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-3xl mx-auto">
            <Reveal>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Blog</h1>
                <p className="text-xl text-gray-600 mb-16">
                    A collection of thoughts, technical deep dives, and progress updates.
                </p>
            </Reveal>

            <StaggerList className="space-y-12">
                {posts.map((post) => (
                    <article key={post.id} className="group">
                        <Link href={`/blog/${post.slug}`} className="block">
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                                <h2 className="text-2xl font-bold group-hover:text-indigo-600 transition-colors">
                                    {post.title}
                                </h2>
                                {post.published_at && (
                                    <time className="text-sm text-gray-400 font-mono mt-1 md:mt-0 md:ml-4 shrink-0">
                                        {format(new Date(post.published_at), 'MMMM d, yyyy')}
                                    </time>
                                )}
                            </div>
                            <p className="text-gray-600 line-clamp-2 leading-relaxed">
                                {post.content?.slice(0, 200)}...
                            </p>
                        </Link>
                    </article>
                ))}
            </StaggerList>

            {posts.length === 0 && (
                <Reveal>
                    <div className="py-12 text-center border-t border-gray-100 mt-12">
                        <p className="text-gray-400">No posts yet.</p>
                    </div>
                </Reveal>
            )}
        </main>
    )
}
