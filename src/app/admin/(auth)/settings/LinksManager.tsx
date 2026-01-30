'use client'

import { createLink, deleteLink } from '@/app/actions/profile'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LinkItem } from '@/lib/repositories/profile'
import { Loader2, Plus } from 'lucide-react'
import { useTransition, useRef } from 'react'
import { toast } from 'sonner'

export function LinksManager({ links }: { links: LinkItem[] }) {
    const [isPending, startTransition] = useTransition()
    const formRef = useRef<HTMLFormElement>(null)

    async function handleAdd(formData: FormData) {
        startTransition(async () => {
            try {
                await createLink(formData)
                toast.success('Link added')
                formRef.current?.reset()
            } catch {
                toast.error('Failed to add link')
            }
        })
    }

    return (
        <div className="space-y-8">
            {/* List */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Links</h3>
                {links.length === 0 && <p className="text-sm text-gray-400">No links added yet.</p>}

                <div className="space-y-2">
                    {links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded shadow-sm">
                                    {/* Icon placeholder or lucide icon dynamic render? Keep it simple text for now */}
                                    <span className="text-xs font-mono font-bold text-gray-400">{link.icon_name || 'LINK'}</span>
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{link.title}</div>
                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{link.url}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Order: {link.order}</span>
                                <DeleteButton id={link.id} title={link.title} deleteAction={deleteLink} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Form */}
            <div className="p-4 border rounded-lg bg-gray-50/50">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Link
                </h3>
                <form ref={formRef} action={handleAdd} className="grid gap-4 md:grid-cols-2 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="GitHub" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input id="url" name="url" placeholder="https://github.com/..." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
                        <Input id="icon_name" name="icon_name" placeholder="github" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order">Order</Label>
                        <Input id="order" name="order" type="number" defaultValue="0" />
                    </div>
                    <div className="md:col-span-2">
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Link
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
