'use client'

import { createPost } from '@/app/actions/posts'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function NewPostPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [content, setContent] = useState('')

    async function handleSubmit(formData: FormData) {
        formData.set('content', content) // Explicitly set content from state

        startTransition(async () => {
            try {
                await createPost(formData)
                toast.success('Post created successfully')
                // Redirect is handled by server action, but just in case
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to create post')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/posts" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" name="title" placeholder="Enter post title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input id="slug" name="slug" placeholder="post-url-slug" required />
                            </div>
                        </div>

                        <MarkdownEditor
                            value={content}
                            onChange={setContent}
                            required
                        />

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
                                Create Post
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
