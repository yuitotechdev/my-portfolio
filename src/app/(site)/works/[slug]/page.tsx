import { WorksRepository } from '@/lib/repositories/works'
import { Reveal, MotionButton } from '@/components/ui/motion'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'

// Spec: /works/[slug] Works詳細

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const work = await WorksRepository.getBySlug(slug)
    if (!work) return { title: 'Not Found' }
    return {
        title: `${work.title} - Works`,
        description: work.description?.slice(0, 160)
    }
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const work = await WorksRepository.getBySlug(slug)

    if (!work) {
        notFound()
    }

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
            <Reveal>
                <Link
                    href="/works"
                    className="inline-flex items-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Works
                </Link>
            </Reveal>

            <article>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground">
                        {work.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {work.tech_stack?.map(tech => (
                            <span key={tech} className="text-sm border border-border px-3 py-1 rounded-full text-foreground bg-muted/10 font-medium">
                                {tech}
                            </span>
                        ))}
                    </div>
                </Reveal>

                <Reveal delay={0.2} className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-12 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                    {work.thumbnail_url ? (
                        <Image
                            src={work.thumbnail_url}
                            alt={work.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <span className="text-6xl">●</span>
                        </div>
                    )}
                </Reveal>

                <div className="grid md:grid-cols-4 gap-12">
                    <div className="md:col-span-3">
                        <Reveal delay={0.3}>
                            <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
                                <p className="lead text-xl text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {work.description}
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <Reveal delay={0.4}>
                            <h3 className="uppercase text-[10px] font-black text-zinc-400 dark:text-zinc-500 tracking-[0.2em] mb-4">Metadata</h3>
                            <div className="flex flex-col gap-3">
                                {work.deployment_url && (
                                    <MotionButton>
                                        <a
                                            href={work.deployment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full bg-gray-900 text-white px-4 py-3 rounded-lg font-medium text-sm gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Live Demo
                                        </a>
                                    </MotionButton>
                                )}

                                {work.github_url && (
                                    <MotionButton>
                                        <a
                                            href={work.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full bg-card border border-border text-foreground px-4 py-3 rounded-lg font-bold text-sm gap-2 hover:bg-muted/50 transition-colors shadow-sm"
                                        >
                                            <Github className="w-4 h-4" />
                                            Source Code
                                        </a>
                                    </MotionButton>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>

            </article>
        </main>
    )
}
