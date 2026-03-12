'use client'

import ImageUpload from '@/components/ImageUpload'
import { useAdminFormAction } from '@/components/admin/useAdminFormAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { type AdminFormAction } from '@/lib/admin-form-state'
import { Product } from '@/lib/repositories/products'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ProductForm({
    product,
    action
}: {
    product?: Product
    action: AdminFormAction
}) {
    const isEdit = !!product
    const [thumbnailUrl, setThumbnailUrl] = useState(product?.thumbnail_url || '')
    const { state, formAction, isPending } = useAdminFormAction(action)

    function handleSubmit(formData: FormData) {
        formData.set('thumbnail_url', thumbnailUrl)
        formAction(formData)
    }

    return (
        <form action={handleSubmit} className="max-w-2xl space-y-8">
            <Card>
                <CardContent className="space-y-6 pt-6">
                    {state.status === 'error' && state.message && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}

                    <div className="flex items-center justify-between border-b pb-4">
                        <Label htmlFor="is_public" className="text-base">
                            公開する
                        </Label>
                        <Switch id="is_public" name="is_public" defaultChecked={product?.is_public ?? true} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">タイトル <span className="text-red-500">*</span></Label>
                        <Input id="title" name="title" defaultValue={product?.title} required placeholder="商品名やサービス名" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">説明</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={product?.description || ''}
                            placeholder="プロダクトの概要を入力"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="url">公開URL <span className="text-red-500">*</span></Label>
                            <Input id="url" name="url" defaultValue={product?.url} required placeholder="https://example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_display">価格表示</Label>
                            <Input id="price_display" name="price_display" defaultValue={product?.price_display || ''} placeholder="¥1,000 / 無料" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail_url">サムネイル画像</Label>
                            <ImageUpload
                                bucket="products"
                                initialUrl={thumbnailUrl}
                                onUpload={(url) => setThumbnailUrl(url)}
                            />
                            <Input
                                id="thumbnail_url"
                                name="thumbnail_url"
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">表示順</Label>
                            <Input id="order" name="order" type="number" defaultValue={product?.order ?? 0} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? '更新する' : '追加する'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">キャンセル</Link>
                </Button>
            </div>
        </form>
    )
}
