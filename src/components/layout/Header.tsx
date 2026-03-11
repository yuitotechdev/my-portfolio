'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

import { NAV_ITEMS } from '@/config/i18n'

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
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "glass py-3" : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tight z-50 relative group">
                    <span className="group-hover:text-indigo-600 transition-colors">Port</span>folio.
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                                    isActive ? "text-indigo-600 bg-gray-50 dark:bg-gray-900" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                )}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: 15 }}
                        className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
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
