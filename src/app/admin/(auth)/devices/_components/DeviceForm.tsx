'use client'

import { createDevice, updateDevice } from '@/app/actions/devices'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Device } from '@/lib/repositories/devices'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'

export function DeviceForm({ device }: { device?: Device }) {
    const isEdit = !!device
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                if (isEdit && device) {
                    await updateDevice(device.id, formData)
                    toast.success('Device updated')
                } else {
                    await createDevice(formData)
                    toast.success('Device created')
                }
            } catch (error) {
                toast.error('Failed to save device')
                console.error(error)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <Label htmlFor="is_public" className="text-base">Public Status</Label>
                        <Switch id="is_public" name="is_public" defaultChecked={device?.is_public ?? true} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                            <Input id="category" name="category" defaultValue={device?.category || ''} required placeholder="PC / Audio / Desk" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Device Name <span className="text-red-500">*</span></Label>
                            <Input id="name" name="name" defaultValue={device?.name} required placeholder="MacBook Pro M3" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purchase_reason">Why I bought it (Purchase Reason)</Label>
                        <Textarea id="purchase_reason" name="purchase_reason" defaultValue={device?.purchase_reason || ''} placeholder="Needed meaningful power..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Specs / Description</Label>
                        <Textarea id="description" name="description" defaultValue={device?.description || ''} placeholder="M3 Max, 64GB RAM..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="link_url">Product Link</Label>
                            <Input id="link_url" name="link_url" defaultValue={device?.link_url || ''} placeholder="https://amazon..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">Sort Order</Label>
                            <Input id="order" name="order" type="number" defaultValue={device?.order ?? 0} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEdit ? 'Update Device' : 'Create Device'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/devices">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}
