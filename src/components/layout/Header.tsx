'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

import { NAV_ITEMS } from '@/config/i18n'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { Magnetic } from '@/components/ui/Magnetic'

const navItems = NAV_ITEMS

// To match "Blog" in spec but "Posts" in implementation, I'll link to /posts but label "Blog".
// Ideally I should rename the route, but sticking to existing /posts for stability.

export function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, toggleTheme } = useMotion()
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                scrolled 
                    ? "top-4 mx-auto max-w-[90%] md:max-w-[800px] glass rounded-full py-2 shadow-2xl border border-white/10" 
                    : "top-0 py-6 bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Magnetic intensity={0.1}>
                    <Link href="/" className="text-xl font-bold tracking-tight z-50 relative group text-foreground">
                        <span className="group-hover:text-indigo-600 transition-colors">Port</span><ScrambleText text="folio." scrambleOnMount={false} scrambleOnHover={true} />
                    </Link>
                </Magnetic>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Magnetic key={item.href} intensity={0.15}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-bold transition-all hover:bg-muted/50",
                                        isActive ? "text-indigo-600 bg-card shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <ScrambleText text={item.name} scrambleOnMount={true} scrambleOnHover={true} />
                                </Link>
                            </Magnetic>
                        )
                    })}
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: 15 }}
                        className="ml-2 p-2 rounded-full hover:bg-muted/50 transition-colors text-foreground"
                        title="テーマを切り替え"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                        </motion.div>
                    </motion.button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden z-50 relative p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Nav Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-0 left-0 w-full h-screen bg-background flex flex-col items-center justify-center gap-8 md:hidden"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}
