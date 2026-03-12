import { auth } from '@/auth'
import { AdminCommandPalette } from '@/components/admin/CommandPalette'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { Toaster } from 'sonner'

const NAV_ITEMS = [
    { href: '/admin', label: 'ダッシュボード' },
    { href: '/admin/works', label: '制作実績' },
    { href: '/admin/products', label: 'プロダクト' },
    { href: '/admin/devices', label: 'デバイス' },
    { href: '/admin/posts', label: 'ブログ' },
    { href: '/admin/news', label: 'お知らせ' },
    { href: '/admin/settings', label: '設定' }
]

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!session?.user?.email || session.user.email !== adminEmail) {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="hidden w-64 space-y-2 border-r bg-white p-4 md:block dark:bg-gray-800">
                <div className="mb-6 px-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">管理画面</div>

                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        {item.label}
                    </Link>
                ))}

                <div className="pt-6">
                    <Link
                        href="/api/auth/signout"
                        className="block w-full rounded-lg border bg-white px-4 py-2 text-center text-sm font-bold transition-all hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                        ログアウト
                    </Link>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-8">{children}</main>
            <Toaster />
            <AdminCommandPalette />
        </div>
    )
}
