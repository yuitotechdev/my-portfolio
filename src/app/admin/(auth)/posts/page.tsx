import { deletePost } from '@/app/actions/posts'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table'
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
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                <Button asChild>
                    <Link href="/admin/posts/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Post
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts?.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell className="text-gray-500">{post.slug}</TableCell>
                                    <TableCell>
                                        {post.published_at ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                                Draft
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(post.created_at), 'yyyy-MM-dd')}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/posts/${post.id}`}>
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <DeleteButton id={post.id} title={post.title} deleteAction={deletePost} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {posts?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No posts found. Create your first post!
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
