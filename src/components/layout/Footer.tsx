import Link from 'next/link'
import { FOOTER_TEXT } from '@/config/i18n'

export function Footer() {
    return (
        <footer className="bg-muted/10 border-t border-border py-16 px-6 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="font-semibold tracking-tight" suppressHydrationWarning>
                    © {new Date().getFullYear()} Portfolio. All rights reserved.
                </div>

                <div className="flex items-center gap-8 font-medium">
                    <Link href="/stats" className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]">{FOOTER_TEXT.stats}</Link>
                    <Link href="/admin" className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]">{FOOTER_TEXT.admin}</Link>
                </div>
            </div>
        </footer>
    )
}
