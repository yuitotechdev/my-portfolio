import { deleteProduct } from '@/app/actions/products'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table'
import { ProductsRepository } from '@/lib/repositories/products'
import { Edit, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function AdminProductsPage() {
    const products = await ProductsRepository.getAllAdmin()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">プロダクト管理</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4 mr-2" />
                        新しく追加
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>プロダクト一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">順序</TableHead>
                                <TableHead>タイトル</TableHead>
                                <TableHead>価格表示</TableHead>
                                <TableHead>公開状態</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-mono text-gray-500">{product.order}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{product.title}</div>
                                        <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-indigo-500 flex items-center gap-1">
                                            {product.url} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>{product.price_display || '-'}</TableCell>
                                    <TableCell>
                                        {product.is_public ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                                公開中
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                                下書き
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <DeleteButton id={product.id} title={product.title} deleteAction={deleteProduct} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        プロダクトが見つかりません。
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
