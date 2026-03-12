'use client'

import { createNews } from '@/app/actions/news'
import { useAdminFormAction } from '@/components/admin/useAdminFormAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewNewsPage() {
    const router = useRouter()
    const { state, formAction, isPending } = useAdminFormAction(createNews)

    function handleSubmit(formData: FormData) {
        formAction(formData)
    }

    const titleError = state.fieldErrors?.title?.[0]
    const slugError = state.fieldErrors?.slug?.[0]
    const contentError = state.fieldErrors?.content?.[0]

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
                        {state.status === 'error' && state.message && (
                            <p className="text-sm text-red-600">{state.message}</p>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="News title"
                                    required
                                    aria-invalid={!!titleError}
                                />
                                {titleError && <p className="text-sm text-red-600">{titleError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="news-slug"
                                    required
                                    aria-invalid={!!slugError}
                                />
                                {slugError && <p className="text-sm text-red-600">{slugError}</p>}
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
                            {contentError && <p className="text-sm text-red-600">{contentError}</p>}
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
