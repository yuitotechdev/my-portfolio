'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { 
    Search, FolderGit2, FileText, Newspaper, Settings, 
    Monitor, LayoutGrid, LogOut, Home, ArrowRight 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AdminCommandPalette() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    // Listen for Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const runCommand = useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-[15vh] p-4 bg-zinc-950/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <Command className="p-2">
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <Search className="w-5 h-5 text-zinc-400" />
                                    <Command.Input 
                                        placeholder="Search anything... (Works, Posts, Settings)" 
                                        className="w-full bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                                    />
                                    <div className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase tracking-widest">ESC to close</div>
                                </div>

                                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                                    <Command.Empty className="px-4 py-8 text-center text-sm text-zinc-500">
                                        No results found.
                                    </Command.Empty>

                                    <Command.Group heading="Navigation" className="px-2 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        <CommandItem icon={Home} label="Dashboard" onSelect={() => runCommand(() => router.push('/admin'))} />
                                        <CommandItem icon={LayoutGrid} label="Manage Works" onSelect={() => runCommand(() => router.push('/admin/works'))} />
                                        <CommandItem icon={FileText} label="Manage Blog Posts" onSelect={() => runCommand(() => router.push('/admin/posts'))} />
                                        <CommandItem icon={Newspaper} label="Manage News" onSelect={() => runCommand(() => router.push('/admin/news'))} />
                                        <CommandItem icon={Monitor} label="Manage Devices" onSelect={() => runCommand(() => router.push('/admin/devices'))} />
                                    </Command.Group>

                                    <Command.Group heading="Settings" className="px-2 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        <CommandItem icon={Settings} label="Global Settings" onSelect={() => runCommand(() => router.push('/admin/settings'))} />
                                        <CommandItem icon={LogOut} label="Log Out" onSelect={() => runCommand(() => router.push('/api/auth/signout'))} />
                                    </Command.Group>
                                </Command.List>

                                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                                    <div className="text-[10px] text-zinc-400 font-medium">Pro-Tip: Use arrows to navigate</div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[10px] font-sans">Enter</kbd>
                                            <span className="text-[10px] text-zinc-400">to select</span>
                                        </div>
                                    </div>
                                </div>
                            </Command>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hint Button */}
            <button 
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-[90] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-3 hover:scale-105 transition-transform"
            >
                <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-[10px] font-sans text-zinc-500 font-bold">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-[10px] font-sans text-zinc-500 font-bold">K</kbd>
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quick Menu</span>
            </button>
        </>
    )
}

function CommandItem({ icon: Icon, label, onSelect }: { icon: any, label: string, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-indigo-500 aria-selected:text-white dark:aria-selected:bg-indigo-600 transition-all group"
        >
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-aria-selected:bg-white/20">
                <Icon size={16} />
            </div>
            <span className="text-sm font-medium">{label}</span>
            <ArrowRight size={14} className="ml-auto opacity-0 group-aria-selected:opacity-100 transition-opacity" />
        </Command.Item>
    )
}
