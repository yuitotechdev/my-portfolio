'use client'

import { createWork, updateWork } from '@/app/actions/works'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Work } from '@/lib/repositories/works'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { SmartImage } from '@/components/ui/smart-image'

// Extend Work type for form props if needed, or cast handling
interface WorkWithPublic extends Work {
    is_public?: boolean
}

export default function EditWorkForm({ work, action }: { work?: WorkWithPublic, action?: (formData: FormData) => Promise<{ error?: string } | void | undefined> }) {
    const isEdit = !!work
    const [isPending, startTransition] = useTransition()

    // Handle action manually if not passed (for create vs update distinction wrapper?)
    // Actually the pages pass 'action' prop bound with ID for update, or just creating.
    // Spec: new/page.tsx passes createWork. [id]/page.tsx passes updateWork.bind(id).

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                if (action) {
                    const result = await action(formData)
                    if (result?.error) {
                        toast.error(result.error)
                    } else {
                        toast.success(isEdit ? 'Work updated' : 'Work created')
                    }
                } else {
                    // Fallback if action prop not used correctly
                    if (isEdit && work) {
                        await updateWork(work.id, formData)
                        toast.success('Work updated')
                    } else {
                        await createWork(formData)
                        toast.success('Work created')
                    }
                }
            } catch (error) {
                toast.error('Failed to save work')
                console.error(error)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit Work' : 'New Work'}</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/works">Cancel</Link>
                    </Button>
                    <Button type="submit" size="sm" disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    {/* Status & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between border rounded-lg p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_public" className="text-base">Public Status</Label>
                                <p className="text-xs text-muted-foreground">Visible on public site</p>
                            </div>
                            <Switch id="is_public" name="is_public" defaultChecked={work?.is_public ?? true} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL path)</Label>
                            <Input id="slug" name="slug" defaultValue={work?.slug} required placeholder="my-project-name" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input id="title" name="title" defaultValue={work?.title} required placeholder="Project Title" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={work?.description || ''} placeholder="Project summary..." className="h-32" />
                    </div>

                    {/* URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deployment_url">Deployment URL</Label>
                            <Input id="deployment_url" name="deployment_url" type="url" defaultValue={work?.deployment_url || ''} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github_url">GitHub URL</Label>
                            <Input id="github_url" name="github_url" type="url" defaultValue={work?.github_url || ''} placeholder="https://github.com/..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tech_stack">Tech Stack (Comma separated)</Label>
                        <Input id="tech_stack" name="tech_stack" defaultValue={work?.tech_stack?.join(', ') || ''} placeholder="Next.js, Tailwind, Supabase" />
                    </div>

                    {/* Image */}
                    <div className="space-y-4 pt-4 border-t">
                        <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                        <div className="flex gap-4 items-start">
                            <Input id="thumbnail_url" name="thumbnail_url" defaultValue={work?.thumbnail_url || ''} placeholder="https://..." className="flex-1" />
                        </div>
                        {work?.thumbnail_url && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-gray-100">
                                <SmartImage
                                    src={work.thumbnail_url}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
