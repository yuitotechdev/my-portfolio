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
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    {state.status === 'error' && state.message && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}

                    <div className="flex items-center justify-between border-b pb-4">
                        <Label htmlFor="is_public" className="text-base">Public</Label>
                        <Switch id="is_public" name="is_public" defaultChecked={product?.is_public ?? true} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input id="title" name="title" defaultValue={product?.title} required placeholder="Product title" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={product?.description || ''}
                            placeholder="Short product description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="url">Product URL <span className="text-red-500">*</span></Label>
                            <Input id="url" name="url" defaultValue={product?.url} required placeholder="https://example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_display">Price Label</Label>
                            <Input id="price_display" name="price_display" defaultValue={product?.price_display || ''} placeholder="$10 / Free" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail_url">Thumbnail</Label>
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
                            <Label htmlFor="order">Order</Label>
                            <Input id="order" name="order" type="number" defaultValue={product?.order ?? 0} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEdit ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}
