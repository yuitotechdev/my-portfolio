'use client'

import { createNews } from '@/app/actions/news'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function NewNewsPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await createNews(formData)
                toast.success('News created successfully')
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to create news')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/news" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">New News</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>News Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" name="title" placeholder="News title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input id="slug" name="slug" placeholder="news-slug" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Short content or description"
                                className="min-h-[150px]"
                            />
                            <p className="text-xs text-gray-500">Simple text for announcements.</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="is_public" name="is_public" />
                            <Label htmlFor="is_public">Publish immediately</Label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create News
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
