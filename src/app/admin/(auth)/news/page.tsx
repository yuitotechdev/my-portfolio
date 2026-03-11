import { NewsList } from './_components/NewsList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminNewsPage() {
    const { data: newsList } = await supabaseAdmin
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">お知らせ管理</h1>
                <Button asChild>
                    <Link href="/admin/news/new">
                        <Plus className="w-4 h-4 mr-2" />
                        新しく追加
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>お知らせ一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <NewsList initialNews={newsList || []} />
                </CardContent>
            </Card>
        </div>
    )
}
// Rebuild trigger
