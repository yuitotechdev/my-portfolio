import { deleteProduct } from '@/app/actions/products'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductsRepository } from '@/lib/repositories/products'
import { Edit, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminProductsPage() {
    const products = await ProductsRepository.getAllAdmin()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">プロダクト管理</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
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
                                <TableHead className="w-[50px]">順番</TableHead>
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
                                        <a
                                            href={product.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500"
                                        >
                                            {product.url}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>{product.price_display || '-'}</TableCell>
                                    <TableCell>
                                        {product.is_public ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                公開中
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                下書き
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteButton id={product.id} title={product.title} deleteAction={deleteProduct} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                        プロダクトがまだありません。
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
