'use client'

import { useState } from 'react'
import { deleteNews, deleteMultipleNews } from '@/app/actions/news'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'
import { type News } from '@/lib/repositories/news'
import Link from 'next/link'
import { toast } from 'sonner'

export function NewsList({ initialNews }: { initialNews: News[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isDeleting, setIsDeleting] = useState(false)

    const toggleSelectAll = () => {
        if (selectedIds.length === initialNews.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(initialNews.map(n => n.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        if (!confirm(`${selectedIds.length}件の項目を削除してもよろしいですか？`)) return

        setIsDeleting(true)
        try {
            await deleteMultipleNews(selectedIds)
            toast.success(`${selectedIds.length}件の項目を削除しました`)
        } catch {
            toast.error('削除に失敗しました')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-4 p-2 bg-indigo-50 border border-indigo-100 rounded-lg animate-in slide-in-from-top-2">
                    <span className="text-sm font-medium text-indigo-900 ml-2">
                        {selectedIds.length} 個選択中
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        一括削除
                    </Button>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={selectedIds.length === initialNews.length && initialNews.length > 0}
                                onChange={toggleSelectAll}
                            />
                        </TableHead>
                        <TableHead>タイトル</TableHead>
                        <TableHead>公開状態</TableHead>
                        <TableHead>作成日</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialNews.map((news) => (
                        <TableRow key={news.id} className={selectedIds.includes(news.id) ? 'bg-indigo-50/30' : ''}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={selectedIds.includes(news.id)}
                                    onChange={() => toggleSelect(news.id)}
                                />
                            </TableCell>
                            <TableCell className="font-medium">{news.title}</TableCell>
                            <TableCell>
                                {news.published_at ? (
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                        公開済み
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                        下書き
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                {format(new Date(news.created_at), 'yyyy-MM-dd')}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/admin/news/${news.id}`}>
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <DeleteButton id={news.id} title={news.title} deleteAction={deleteNews} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialNews.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                お知らせが見つかりません。
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
