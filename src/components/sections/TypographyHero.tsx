'use client'

import { motion, useSpring, useMotionValue } from 'framer-motion'
import { MOTION } from '@/config/motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { type Profile, type LinkItem as SocialLink } from '@/lib/repositories/profile'
import { useMotion as useMotionContext } from '@/components/providers/MotionProvider'

interface TypographyHeroProps {
    profile: Profile | null
    links: SocialLink[]
}

export function TypographyHero({ profile, links }: TypographyHeroProps) {
    const { preference } = useMotionContext()
    const isMinimal = preference === 'minimal'
    const isSafe = preference === 'safe' || isMinimal

    // Parallax & Mouse Interaction (High only)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth mouse spring
    const smoothX = useSpring(mouseX, MOTION.spring.smooth)
    const smoothY = useSpring(mouseY, MOTION.spring.smooth)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isSafe) return
        const { clientX, clientY, currentTarget } = e
        const { width, height, left, top } = currentTarget.getBoundingClientRect()
        const x = (clientX - left) / width - 0.5
        const y = (clientY - top) / height - 0.5
        mouseX.set(x * 20) // 20px tilt
        mouseY.set(y * 20)
    }

    const title = profile?.name || 'Creator'
    // Split title into characters for orchestration
    const chars = title.split('')

    // Container for Stagger
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const child = {
        hidden: {
            opacity: 0,
            y: 32, // More dramatic start
            rotateX: isSafe ? 0 : 45, // 3D rotate if safe
            filter: 'blur(12px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            transition: MOTION.spring.heavy
        }
    }

    return (
        <section
            className="min-h-[85vh] flex items-center justify-center px-6 md:px-12 bg-white relative overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Background Gradient (Subtle) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

            <motion.div
                className="max-w-5xl w-full relative z-10"
                initial="hidden"
                animate="visible"
                variants={container}
                style={{ x: isSafe ? 0 : smoothX, y: isSafe ? 0 : smoothY }}
            >
                {/* Title Orchestra */}
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 text-slate-900 leading-[0.9] select-none cursor-default mix-blend-multiply">
                    {chars.map((char, i) => (
                        <motion.span
                            key={i}
                            variants={child}
                            className="inline-block origin-bottom"
                            whileHover={!isSafe ? {
                                scale: 1.1,
                                rotate: (i % 2 === 0 ? 5 : -5),
                                color: "#4f46e5", // Indigo-600
                                transition: MOTION.spring.rapid
                            } : undefined}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h1>

                {/* Subtitle & Socials */}
                <motion.div variants={child} transition={MOTION.spring.smooth}>
                    <p className="text-xl md:text-3xl text-gray-500 font-light max-w-2xl mb-12 leading-relaxed tracking-wide">
                        {profile?.bio_short || 'Building digital experiences that feel alive.'}
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-6 justify-start">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-10 text-lg h-14 bg-slate-900 hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 hover:scale-105 active:scale-95 duration-200"
                        >
                            <Link href="/works">
                                View Selected Works <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>

                        <div className="flex gap-3 flex-wrap justify-center">
                            {links.map((link) => (
                                <motion.a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-gray-500 hover:text-slate-900 transition-colors bg-gray-50/50 border border-gray-100 rounded-full text-sm font-medium hover:bg-white hover:border-gray-300 backdrop-blur-sm"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {link.title}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
