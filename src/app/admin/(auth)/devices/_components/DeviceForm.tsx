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
import { Device } from '@/lib/repositories/devices'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function DeviceForm({
    device,
    action
}: {
    device?: Device
    action: AdminFormAction
}) {
    const isEdit = !!device
    const [thumbnailUrl, setThumbnailUrl] = useState(device?.thumbnail_url || '')
    const { state, formAction, isPending } = useAdminFormAction(action)

    function handleSubmit(formData: FormData) {
        formData.set('thumbnail_url', thumbnailUrl)
        formAction(formData)
    }

    return (
        <form action={handleSubmit} className="max-w-3xl space-y-8">
            <Card>
                <CardContent className="space-y-6 pt-6">
                    {state.status === 'error' && state.message && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}

                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <Label htmlFor="is_public" className="text-base">公開する</Label>
                            <p className="text-sm text-gray-500">チェックを入れると公開ページに表示されます。</p>
                        </div>
                        <Switch id="is_public" name="is_public" defaultChecked={device?.is_public ?? true} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">カテゴリ <span className="text-red-500">*</span></Label>
                            <Input id="category" name="category" defaultValue={device?.category || ''} required placeholder="PC / Audio / Desk" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">デバイス名 <span className="text-red-500">*</span></Label>
                            <Input id="name" name="name" defaultValue={device?.name} required placeholder="MacBook Pro M3" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail_url">画像</Label>
                        <ImageUpload
                            bucket="devices"
                            initialUrl={thumbnailUrl}
                            onUpload={(url) => setThumbnailUrl(url)}
                        />
                        <Input
                            id="thumbnail_url"
                            name="thumbnail_url"
                            value={thumbnailUrl}
                            onChange={(event) => setThumbnailUrl(event.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purchase_reason">導入理由</Label>
                        <Textarea
                            id="purchase_reason"
                            name="purchase_reason"
                            defaultValue={device?.purchase_reason || ''}
                            placeholder="なぜこのデバイスを使っているか"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">説明</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={device?.description || ''}
                            placeholder="用途や特徴のメモ"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="link_url">参考リンク</Label>
                            <Input id="link_url" name="link_url" defaultValue={device?.link_url || ''} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">表示順</Label>
                            <Input id="order" name="order" type="number" defaultValue={device?.order ?? 0} />
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
                    <Link href="/admin/devices">キャンセル</Link>
                </Button>
            </div>
        </form>
    )
}
