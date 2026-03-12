'use client'

import { Work } from '@/lib/repositories/works'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { useMotion as useMotionContext } from '@/components/providers/MotionProvider'
import { useTransitionStore } from '@/stores/useTransitionStore'
import { useGlowStore } from '@/stores/useGlowStore'
import { useRef } from 'react'
import { useSoundEffect } from '@/hooks/useSoundEffect'

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export function WorkCard({ work }: { work: Work }) {
    const { preference } = useMotionContext()
    const isSafe = preference === 'safe' || preference === 'minimal'
    const router = useRouter()
    const { setProjectTitle } = useTransitionStore()
    const { setColor } = useGlowStore()
    const { playHover, playTransition } = useSoundEffect()

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const cardRef = useRef<HTMLDivElement>(null)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (isSafe) return
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseEnter = () => {
        playHover()
        if (isSafe) return
        // Generate dynamic color based on title (HSL)
        const hue = (work.title.length * 137.5) % 360
        setColor(`hsla(${hue}, 70%, 50%, 0.2)`)
    }

    const handleMouseLeave = () => {
        if (isSafe) return
        x.set(0)
        y.set(0)
        // Reset to default indigo-ish
        setColor('rgba(99, 102, 241, 0.15)')
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        playTransition()
        if (isSafe) return
        e.preventDefault()
        setProjectTitle(work.title)
        
        // Wipe animation takes 0.8s
        setTimeout(() => {
            router.push(`/works/${work.slug}`)
        }, 800)
    }

    // Scroll Parallax Effect
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    })
    const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
    const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])

    return (
        <motion.div variants={itemVariants} className="group" style={{ perspective: 1000 }} ref={cardRef}>
            <Link href={`/works/${work.slug}`} className="block h-full" onClick={handleClick} data-cursor="view">
                <motion.article 
                    className="h-full bg-card rounded-xl overflow-hidden shadow-sm border border-border transition-shadow hover:shadow-md flex flex-col luminous-border-on-dark relative"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX: isSafe ? 0 : rotateX,
                        rotateY: isSafe ? 0 : rotateY,
                        transformStyle: "preserve-3d" // for interior elements
                    }}
                >
                    <div 
                        className="relative aspect-video bg-muted overflow-hidden"
                        style={{ transform: isSafe ? "none" : "translateZ(30px)" }}
                    >
                        <motion.div className="w-full h-full" style={{ y: isSafe ? 0 : imageY }}>
                            {work.thumbnail_url ? (
                                    <Image
                                        src={work.thumbnail_url}
                                        alt={work.title}
                                        fill
                                        className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.15] group-hover:rotate-1 group-hover:brightness-110 group-hover:saturate-125 [transform-style:preserve-3d]"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                            ) : (
                                <div 
                                    className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                            hsl(${(work.title.length * 40) % 360}, 60%, var(--placeholder-lightness, 80%)), 
                                            hsl(${(work.title.length * 40 + 60) % 360}, 70%, var(--placeholder-lightness-2, 90%)))`
                                    }}
                                >
                                    <div className="text-white/50 transform -rotate-12 select-none pointer-events-none">
                                        <span className="text-6xl font-black opacity-20 uppercase tracking-tighter">
                                            {work.title.substring(0, 2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <motion.div 
                        className="p-6 flex-1 flex flex-col bg-card"
                        style={{ transform: isSafe ? "none" : "translateZ(40px)", y: isSafe ? 0 : textY }}
                    >
                        <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-foreground">
                            {work.title}
                        </h2>
                        {work.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                                {work.description}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {work.tech_stack?.slice(0, 3).map(tech => (
                                <span key={tech} className="text-[10px] font-black tracking-widest uppercase bg-muted/40 text-muted-foreground px-2 py-1 rounded-full border border-border/50">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </motion.article>
            </Link>
        </motion.div>
    )
}
