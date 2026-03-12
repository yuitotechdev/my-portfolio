'use client'

import { deleteLink } from '@/app/actions/profile'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { useAdminFormAction } from '@/components/admin/useAdminFormAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type AdminFormAction } from '@/lib/admin-form-state'
import { LinkItem } from '@/lib/repositories/profile'
import { Loader2, Plus } from 'lucide-react'
import { useRef } from 'react'

export function LinksManager({
    links,
    action
}: {
    links: LinkItem[]
    action: AdminFormAction
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const { state, formAction, isPending } = useAdminFormAction(action, {
        onSuccess: () => {
            formRef.current?.reset()
        }
    })

    function handleAdd(formData: FormData) {
        formAction(formData)
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">現在のリンク</h3>
                {links.length === 0 && <p className="text-sm text-gray-400">まだリンクがありません。</p>}

                <div className="space-y-2">
                    {links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded bg-white p-2 shadow-sm">
                                    <span className="text-xs font-bold font-mono text-gray-400">{link.icon_name || 'LINK'}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{link.title}</div>
                                    <div className="max-w-[200px] truncate text-xs text-gray-400">{link.url}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">表示順 {link.order}</span>
                                <DeleteButton id={link.id} title={link.title} deleteAction={deleteLink} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border bg-gray-50/50 p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                    <Plus className="h-4 w-4" />
                    リンクを追加
                </h3>
                <form ref={formRef} action={handleAdd} className="grid items-end gap-4 md:grid-cols-2">
                    {state.status === 'error' && state.message && (
                        <p className="text-sm text-red-600 md:col-span-2">{state.message}</p>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">表示名</Label>
                        <Input id="title" name="title" placeholder="GitHub" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input id="url" name="url" placeholder="https://github.com/..." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="icon_name">アイコン名</Label>
                        <Input id="icon_name" name="icon_name" placeholder="github" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order">表示順</Label>
                        <Input id="order" name="order" type="number" defaultValue="0" />
                    </div>
                    <input type="hidden" name="is_active" value="on" />
                    <div className="md:col-span-2">
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            リンクを追加
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
