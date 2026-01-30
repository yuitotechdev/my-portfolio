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
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Works
                </Link>
            </Reveal>

            <article>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
                        {work.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {work.tech_stack?.map(tech => (
                            <span key={tech} className="text-sm border border-gray-200 px-3 py-1 rounded-full text-gray-700 font-medium">
                                {tech}
                            </span>
                        ))}
                    </div>
                </Reveal>

                <Reveal delay={0.2} className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-12 shadow-sm">
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
                            <div className="prose prose-lg prose-gray max-w-none">
                                <p className="lead text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {work.description}
                                </p>
                                {/* Future: Render rich content or markdown if added to schema */}
                            </div>
                        </Reveal>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <Reveal delay={0.4}>
                            <h3 className="uppercase text-xs font-bold text-gray-400 tracking-wider mb-4">Links</h3>
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
                                            className="flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium text-sm gap-2 hover:bg-gray-50"
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
