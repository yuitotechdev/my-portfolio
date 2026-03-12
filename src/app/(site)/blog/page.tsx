import { PostsRepository } from '@/lib/repositories/posts'
import { StaggerList, Reveal } from '@/components/ui/motion'
import Link from 'next/link'
import { format } from 'date-fns'
import { PAGE_TITLES, COMMON_TEXT } from '@/config/i18n'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Blog - Portfolio',
    description: 'Thoughts, learnings, and updates.',
}

export default async function BlogPage() {
    const posts = await PostsRepository.getAllPublic()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-3xl mx-auto">
            <Reveal>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{PAGE_TITLES.blog}</h1>
                <p className="text-xl text-muted-foreground mb-16">
                    A collection of thoughts, technical deep dives, and progress updates.
                </p>
            </Reveal>

            <StaggerList className="space-y-12">
                {posts.map((post) => (
                    <article key={post.id} className="group">
                        <Link href={`/blog/${post.slug}`} className="block">
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                                {post.published_at && (
                                    <time className="text-sm text-muted-foreground font-mono mt-1 md:mt-0 md:ml-4 shrink-0">
                                        {format(new Date(post.published_at), 'MMMM d, yyyy')}
                                    </time>
                                )}
                            </div>
                            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                                {post.content?.slice(0, 200)}...
                            </p>
                        </Link>
                    </article>
                ))}
            </StaggerList>

            {posts.length === 0 && (
                <Reveal>
                    <div className="py-12 text-center border-t border-border mt-12">
                        <p className="text-muted-foreground">{COMMON_TEXT.no_data}</p>
                    </div>
                </Reveal>
            )}
        </main>
    )
}
