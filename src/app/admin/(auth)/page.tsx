import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Settings, BarChart3, FileText, LayoutGrid, Monitor, Newspaper } from "lucide-react"

export default function AdminDashboard() {
    const items = [
        { title: "Works", icon: LayoutGrid, href: "/admin/works", desc: "Manage detailed portfolio works." },
        { title: "Posts", icon: FileText, href: "/admin/posts", desc: "Update blog content." },
        { title: "News", icon: Newspaper, href: "/admin/news", desc: "Post announcements." },
        { title: "Products", icon: Settings, href: "/admin/products", desc: "Manage products." },
        { title: "Devices", icon: Monitor, href: "/admin/devices", desc: "Update gear list." },
        { title: "Site Settings", icon: Settings, href: "/admin/settings", desc: "Profile, Backup, and Links." },
    ]

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-gray-500">Welcome back. Select an area to manage.</p>
                </div>
                <Link
                    href="/manual"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 bg-indigo-50 rounded-lg transition-colors"
                >
                    <BookOpen className="w-4 h-4" />
                    Open Operations Manual
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.title}
                                </CardTitle>
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    {item.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
                <div className="text-blue-500 mt-1">
                    <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-blue-900">Analytics Status</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Analytics are active on the public site. Check Vercel/Cloudflare dashboard for stats.
                    </p>
                </div>
            </div>
        </div>
    )
}
