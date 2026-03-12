'use client'

import { motion } from 'framer-motion'

const TECHNOLOGIES = [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", 
    "Node.js", "Supabase", "PostgreSQL", "Zustand", "Three.js",
    "WebGL", "Prisma", "GSAP", "Radix UI", "Shader Lab"
]

export function TechMarquee() {
    return (
        <section className="py-20 overflow-hidden bg-muted/10 border-y border-border pointer-events-none select-none">
            <div className="flex whitespace-nowrap">
                <motion.div 
                    className="flex gap-20 items-center justify-around translate-x-0"
                    animate={{ x: [0, -1000] }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 30, 
                        ease: "linear" 
                    }}
                >
                    {/* Double the list to create seamless loop */}
                    {[...TECHNOLOGIES, ...TECHNOLOGIES].map((tech, i) => (
                        <span 
                            key={i} 
                            className="text-4xl md:text-6xl font-black text-muted-foreground/20 hover:text-indigo-600/40 transition-colors uppercase tracking-tighter"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
                <motion.div 
                    className="flex gap-20 items-center justify-around"
                    animate={{ x: [0, -1000] }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 30, 
                        ease: "linear" 
                    }}
                >
                    {[...TECHNOLOGIES, ...TECHNOLOGIES].map((tech, i) => (
                        <span 
                            key={i} 
                            className="text-4xl md:text-6xl font-black text-muted-foreground/20 uppercase tracking-tighter"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
