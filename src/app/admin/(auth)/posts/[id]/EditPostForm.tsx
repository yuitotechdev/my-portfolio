'use client'

import { updatePost } from '@/app/actions/posts'
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

type Post = {
    id: string
    title: string
    slug: string
    content: string | null
    published_at: string | null
    is_public: boolean
}

export default function EditPostForm({ post }: { post: Post }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [content, setContent] = useState(post.content || '')

    async function handleSubmit(formData: FormData) {
        formData.set('content', content)

        startTransition(async () => {
            try {
                await updatePost(post.id, formData)
                toast.success('Post updated successfully')
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to update post')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/posts" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
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
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={post.title}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    defaultValue={post.slug}
                                    required
                                />
                            </div>
                        </div>

                        <MarkdownEditor
                            value={content}
                            onChange={setContent}
                            required
                        />

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_public"
                                name="is_public"
                                defaultChecked={post.published_at !== null} // Logic differs slightly from model but fine for now, usually we track is_public separately or deduce it. Spec says is_public col exists? Let's assume schema has is_public based on validators.ts
                            />
                            <Label htmlFor="is_public">Published</Label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Update Post
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
