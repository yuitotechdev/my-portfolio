import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, LayoutGrid, Monitor, Newspaper, Settings } from 'lucide-react'
import Link from 'next/link'

const items = [
    {
        title: '制作実績',
        href: '/admin/works',
        icon: LayoutGrid,
        desc: '制作物の追加、編集、公開設定を管理します。'
    },
    {
        title: 'ブログ',
        href: '/admin/posts',
        icon: FileText,
        desc: 'ブログ記事の追加、編集、公開設定を管理します。'
    },
    {
        title: 'お知らせ',
        href: '/admin/news',
        icon: Newspaper,
        desc: 'サイト更新や告知のお知らせを管理します。'
    },
    {
        title: 'プロダクト',
        href: '/admin/products',
        icon: Settings,
        desc: '販売中のプロダクト情報を管理します。'
    },
    {
        title: 'デバイス',
        href: '/admin/devices',
        icon: Monitor,
        desc: '使用している機材やデバイス情報を管理します。'
    },
    {
        title: '設定',
        href: '/admin/settings',
        icon: BookOpen,
        desc: 'プロフィール、リンク、バックアップを管理します。'
    }
]

export default function AdminDashboard() {
    return (
        <div className="mx-auto max-w-7xl space-y-10">
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
                        管理ダッシュボード
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        公開中のコンテンツや設定をここから更新できます。
                    </p>
                </div>
                <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 dark:bg-white dark:text-black"
                >
                    公開サイトを見る
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <Link key={item.href} href={item.href} className="group">
                        <Card className="h-full overflow-hidden rounded-3xl border-zinc-200 bg-white transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <item.icon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="mb-2 text-lg font-black tracking-tight transition-colors group-hover:text-indigo-500">
                                    {item.title}
                                </CardTitle>
                                <p className="text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
