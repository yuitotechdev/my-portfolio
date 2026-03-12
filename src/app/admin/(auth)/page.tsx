import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { 
    BookOpen, Settings, BarChart3, FileText, LayoutGrid, 
    Monitor, Newspaper, Activity, Zap, ShieldCheck, 
    AlertCircle, ArrowUpRight 
} from "lucide-react"

export default function AdminDashboard() {
    const items = [
        { title: "制作実績", icon: LayoutGrid, href: "/admin/works", desc: "実績詳細と並び順を管理します。" },
        { title: "ブログ投稿", icon: FileText, href: "/admin/posts", desc: "技術記事やコラムを更新します。" },
        { title: "お知らせ", icon: Newspaper, href: "/admin/news", desc: "活動ニュースを投稿します。" },
        { title: "プロダクト", icon: Settings, href: "/admin/products", desc: "公開プロダクト情報を管理。" },
        { title: "使用デバイス", icon: Monitor, href: "/admin/devices", desc: "デスクセットアップ機材の管理。" },
        { title: "サイト設定", icon: Settings, href: "/admin/settings", desc: "サイト全体の高度な構成。" },
    ]

    const healthMetrics = [
        { label: "Performance", value: "98", icon: Zap, color: "text-amber-500" },
        { label: "Stability", value: "100%", icon: Activity, color: "text-emerald-500" },
        { label: "SEO Status", value: "A+", icon: ShieldCheck, color: "text-indigo-500" },
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">ADMIN COCKPIT</h2>
                    <p className="text-zinc-500 mt-1 uppercase text-xs font-bold tracking-[0.2em]">Operational Dashboard</p>
                </div>
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-all shadow-xl"
                >
                    Visit Live Site
                    <ArrowUpRight className="w-3 h-3" />
                </Link>
            </header>

            {/* Health & Performance Dashboard (Idea 5) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {healthMetrics.map((m) => (
                    <div key={m.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-2">{m.label}</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black tabular-nums text-zinc-900 dark:text-zinc-100">{m.value}</span>
                                <span className={`${m.color} text-xs font-bold`}>OPTIMAL</span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 ${m.color}`}>
                            <m.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Link key={item.href} href={item.href} className="group">
                        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden bg-white dark:bg-zinc-900">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <item.icon className="h-6 w-6 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                                <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={14} className="text-zinc-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-lg font-black tracking-tight mb-2 group-hover:text-indigo-500 transition-colors">
                                    {item.title}
                                </CardTitle>
                                <p className="text-xs font-medium text-zinc-500 leading-relaxed capitalize">
                                    {item.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="bg-indigo-500 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter mb-4">Master Manual</h3>
                    <p className="max-w-md text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                        サイトの操作や構成について詳しく知りたい場合は、エンジニア向け公式マニュアルを参照してください。
                    </p>
                    <Link
                        href="/manual"
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-white text-indigo-600 font-black px-8 py-4 rounded-full hover:scale-105 transition-transform"
                    >
                        Read Documentation
                        <BookOpen size={18} />
                    </Link>
                </div>
                <div className="hidden lg:block relative z-10 opacity-20">
                    <LayoutGrid size={240} strokeWidth={1} />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-900/20 blur-[120px] rounded-full" />
            </div>
        </div>
    )
}
