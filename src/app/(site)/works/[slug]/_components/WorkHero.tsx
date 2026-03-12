'use client'

import { Reveal } from '@/components/ui/motion'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface WorkHeroProps {
    id: string
    title: string
    thumbnailUrl: string | null
}

export function WorkHero({ id, title, thumbnailUrl }: WorkHeroProps) {
    return (
        <Reveal delay={0.2} className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-12 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
            <motion.div
                className="w-full h-full"
                layoutId={`work-thumb-${id}`}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-6xl">+</span>
                    </div>
                )}
            </motion.div>
        </Reveal>
    )
}
