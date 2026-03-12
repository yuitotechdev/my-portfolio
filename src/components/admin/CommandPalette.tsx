'use client'

import { useSoundEffect } from '@/hooks/useSoundEffect'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight,
    FileText,
    Home,
    LayoutGrid,
    LogOut,
    Monitor,
    Newspaper,
    Search,
    Settings,
    type LucideIcon
} from 'lucide-react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

const TEXT = {
    searchPlaceholder: '\u753b\u9762\u3092\u691c\u7d22...\uff08\u5236\u4f5c\u5b9f\u7e3e\u3001\u30d6\u30ed\u30b0\u3001\u8a2d\u5b9a\uff09',
    close: 'ESC\u3067\u9589\u3058\u308b',
    noResults: '\u4e00\u81f4\u3059\u308b\u9805\u76ee\u304c\u3042\u308a\u307e\u305b\u3093\u3002',
    navGroup: '\u79fb\u52d5',
    settingsGroup: '\u8a2d\u5b9a',
    dashboard: '\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9',
    works: '\u5236\u4f5c\u5b9f\u7e3e',
    posts: '\u30d6\u30ed\u30b0',
    news: '\u304a\u77e5\u3089\u305b',
    devices: '\u30c7\u30d0\u30a4\u30b9',
    globalSettings: '\u5168\u4f53\u8a2d\u5b9a',
    logout: '\u30ed\u30b0\u30a2\u30a6\u30c8',
    arrowHint: '\u77e2\u5370\u30ad\u30fc\u3067\u79fb\u52d5\u3067\u304d\u307e\u3059',
    enterHint: '\u3067\u958b\u304f',
    quickMenu: '\u30af\u30a4\u30c3\u30af\u30e1\u30cb\u30e5\u30fc'
}

export function AdminCommandPalette() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { playHover, playClick } = useSoundEffect()

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                setOpen((current) => !current)
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
                    <div className="fixed inset-0 z-[100000] flex items-start justify-center bg-zinc-950/40 p-4 pt-[15vh] backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <Command className="p-2">
                                <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                                    <Search className="h-5 w-5 text-zinc-400" />
                                    <Command.Input
                                        placeholder={TEXT.searchPlaceholder}
                                        className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                                    />
                                    <div className="rounded bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:bg-zinc-800">
                                        {TEXT.close}
                                    </div>
                                </div>

                                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                                    <Command.Empty className="px-4 py-8 text-center text-sm text-zinc-500">
                                        {TEXT.noResults}
                                    </Command.Empty>

                                    <Command.Group
                                        heading={TEXT.navGroup}
                                        className="px-2 pb-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                                    >
                                        <CommandItem icon={Home} label={TEXT.dashboard} onSelect={() => runCommand(() => router.push('/admin'))} playHover={playHover} playClick={playClick} />
                                        <CommandItem icon={LayoutGrid} label={TEXT.works} onSelect={() => runCommand(() => router.push('/admin/works'))} playHover={playHover} playClick={playClick} />
                                        <CommandItem icon={FileText} label={TEXT.posts} onSelect={() => runCommand(() => router.push('/admin/posts'))} playHover={playHover} playClick={playClick} />
                                        <CommandItem icon={Newspaper} label={TEXT.news} onSelect={() => runCommand(() => router.push('/admin/news'))} playHover={playHover} playClick={playClick} />
                                        <CommandItem icon={Monitor} label={TEXT.devices} onSelect={() => runCommand(() => router.push('/admin/devices'))} playHover={playHover} playClick={playClick} />
                                    </Command.Group>

                                    <Command.Group
                                        heading={TEXT.settingsGroup}
                                        className="px-2 pb-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                                    >
                                        <CommandItem icon={Settings} label={TEXT.globalSettings} onSelect={() => runCommand(() => router.push('/admin/settings'))} playHover={playHover} playClick={playClick} />
                                        <CommandItem icon={LogOut} label={TEXT.logout} onSelect={() => runCommand(() => router.push('/api/auth/signout'))} playHover={playHover} playClick={playClick} />
                                    </Command.Group>
                                </Command.List>

                                <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                                    <div className="text-[10px] font-medium text-zinc-400">{TEXT.arrowHint}</div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-sans dark:border-zinc-700 dark:bg-zinc-900">
                                                Enter
                                            </kbd>
                                            <span className="text-[10px] text-zinc-400">{TEXT.enterHint}</span>
                                        </div>
                                    </div>
                                </div>
                            </Command>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-lg transition-transform hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="flex items-center gap-1">
                    <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950">
                        Ctrl
                    </kbd>
                    <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950">
                        K
                    </kbd>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{TEXT.quickMenu}</span>
            </button>
        </>
    )
}

function CommandItem({
    icon: Icon,
    label,
    onSelect,
    playHover,
    playClick
}: {
    icon: LucideIcon
    label: string
    onSelect: () => void
    playHover: () => void
    playClick: () => void
}) {
    return (
        <Command.Item
            onSelect={() => {
                playClick()
                onSelect()
            }}
            className="group flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
            onMouseEnter={playHover}
        >
            <div className="rounded-lg bg-zinc-100 p-1.5 group-aria-selected:bg-white/20 dark:bg-zinc-800">
                <Icon size={16} />
            </div>
            <span className="text-sm font-medium">{label}</span>
            <ArrowRight size={14} className="ml-auto opacity-0 transition-opacity group-aria-selected:opacity-100" />
        </Command.Item>
    )
}
