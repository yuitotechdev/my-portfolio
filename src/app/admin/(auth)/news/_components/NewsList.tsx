'use client'

import { deleteMultipleNews, deleteNews } from '@/app/actions/news'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { News } from '@/lib/repositories/news'
import { format } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export function NewsList({ initialNews }: { initialNews: News[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isDeleting, setIsDeleting] = useState(false)

    const toggleSelectAll = () => {
        if (selectedIds.length === initialNews.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(initialNews.map((item) => item.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => (
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        ))
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            return
        }

        if (!confirm(`${selectedIds.length}件のお知らせを削除しますか？`)) {
            return
        }

        setIsDeleting(true)
        try {
            const result = await deleteMultipleNews(selectedIds)
            if (result?.error) {
                throw new Error(result.error)
            }

            toast.success(`${selectedIds.length}件のお知らせを削除しました`)
            setSelectedIds([])
        } catch {
            toast.error('削除に失敗しました')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="animate-in slide-in-from-top-2 flex items-center gap-4 rounded-lg border border-indigo-100 bg-indigo-50 p-2">
                    <span className="ml-2 text-sm font-medium text-indigo-900">
                        {selectedIds.length}件を選択中
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        選択した項目を削除
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
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                        公開中
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                        下書き
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>{format(new Date(news.created_at), 'yyyy-MM-dd')}</TableCell>
                            <TableCell className="space-x-2 text-right">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/admin/news/${news.id}`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <DeleteButton id={news.id} title={news.title} deleteAction={deleteNews} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialNews.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                まだお知らせがありません。
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
