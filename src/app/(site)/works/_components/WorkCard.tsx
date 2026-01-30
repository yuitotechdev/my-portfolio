'use client'

import { Work } from '@/lib/repositories/works'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export function WorkCard({ work }: { work: Work }) {
    return (
        <motion.div variants={itemVariants} className="group">
            <Link href={`/works/${work.slug}`} className="block h-full">
                <article className="h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-md flex flex-col">
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        {work.thumbnail_url ? (
                            <Image
                                src={work.thumbnail_url}
                                alt={work.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                <span className="text-4xl">●</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                            {work.title}
                        </h2>
                        {work.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                                {work.description}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {work.tech_stack?.slice(0, 3).map(tech => (
                                <span key={tech} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    )
}
