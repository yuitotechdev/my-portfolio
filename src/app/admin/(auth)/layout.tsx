import React from 'react'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const adminEmail = process.env.ADMIN_EMAIL

    // STRICT SECURITY: Only allow exact email match to view Admin Dashboard
    if (!session?.user?.email || session.user.email !== adminEmail) {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar (Simple) */}
            <nav className="w-64 bg-white dark:bg-gray-800 border-r p-4 space-y-2 hidden md:block">
                <div className="font-bold text-xl mb-6 px-2">管理画面</div>

                <Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">ダッシュボード</Link>
                <Link href="/admin/works" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">WORKS_CONST</Link>
                <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">プロダクト</Link>
                <Link href="/admin/devices" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">使用デバイス</Link>
                <Link href="/admin/posts" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">ブログ投稿</Link>
                <Link href="/admin/news" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">お知らせ</Link>
                <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">設定</Link>
            </nav>

            <div className="fixed bottom-4 left-4 w-56 hidden md:block">
                <Link href="/api/auth/signout" className="block w-full text-center px-4 py-2 border rounded hover:bg-gray-50 text-sm">ログアウト</Link>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
            <Toaster />
        </div>
    )
}
