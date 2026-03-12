import { deletePost } from '@/app/actions/posts'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import { Edit, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPostsPage() {
    const { data: posts } = await supabaseAdmin
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">ブログ管理</h1>
                <Button asChild>
                    <Link href="/admin/posts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        新しい記事を追加
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>記事一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>タイトル</TableHead>
                                <TableHead>URLスラッグ</TableHead>
                                <TableHead>公開状態</TableHead>
                                <TableHead>作成日</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts?.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell className="text-gray-500">{post.slug}</TableCell>
                                    <TableCell>
                                        {post.published_at ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                公開中
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                下書き
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{format(new Date(post.created_at), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/posts/${post.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteButton id={post.id} title={post.title} deleteAction={deletePost} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {posts?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                        まだ記事がありません。新しい記事を追加してください。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
