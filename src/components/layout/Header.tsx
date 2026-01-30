'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Works', href: '/works' },
    { name: 'Products', href: '/products' },
    { name: 'Devices', href: '/devices' },
    { name: 'News', href: '/news' },
    { name: 'Blog', href: '/blog' }, // Spec says /blog
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

// To match "Blog" in spec but "Posts" in implementation, I'll link to /posts but label "Blog".
// Ideally I should rename the route, but sticking to existing /posts for stability.

export function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
                scrolled ? "bg-white/80 backdrop-blur-md border-gray-100 py-3" : "bg-transparent py-5"
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
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-gray-100/50",
                                    isActive ? "text-indigo-600 bg-gray-50" : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
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
                            className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 md:hidden"
                        >
                            {navItems.map((item, idx) => (
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
