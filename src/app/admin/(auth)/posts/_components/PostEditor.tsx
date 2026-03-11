'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Post {
    id?: string
    title: string
    slug: string
    content: string
    is_public: boolean
}

interface PostEditorProps {
    post?: Post
    action: (formData: FormData) => Promise<void>
}

export default function PostEditor({ post, action }: PostEditorProps) {
    const [content, setContent] = useState(post?.content || '')

    // Auto-generate slug from title if new post and slug is empty
    const [title, setTitle] = useState(post?.title || '')
    const [slug, setSlug] = useState(post?.slug || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        if (!post && !slug) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
    }

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsSubmitting(true)
            await action(formData)
            toast.success(post ? '記事を更新しました' : '記事を作成しました')
        } catch (error) {
            console.error(error)
            const message = error instanceof Error ? error.message : '記事の保存に失敗しました'
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 flex-1">
                    <input
                        type="text"
                        name="title"
                        placeholder="記事タイトル"
                        value={title}
                        onChange={handleTitleChange}
                        required
                        className="text-2xl font-bold border-none focus:ring-0 w-full placeholder-gray-300 bg-transparent"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <input
                            id="is_public"
                            name="is_public"
                            type="checkbox"
                            defaultChecked={post?.is_public}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 whitespace-nowrap">
                            公開する
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? '保存中...' : (post ? '更新する' : '作成する')}
                    </button>
                    <Link href="/admin/posts" className={`text-gray-500 hover:text-gray-700 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>キャンセル</Link>
                </div>
            </div>

            <div className="mb-4 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase">スラッグ (URLパス)</label>
                    <input
                        type="text"
                        name="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 px-3 py-2"
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-md md:hidden">
                    <button
                        type="button"
                        onClick={() => setViewMode('edit')}
                        className={`px-3 py-1 text-xs rounded ${viewMode === 'edit' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                    >
                        編集
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 text-xs rounded ${viewMode === 'preview' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                    >
                        プレビュー
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden border-t pt-4">
                {/* Editor */}
                <div className={cn("flex-1 flex flex-col", viewMode === 'preview' && "hidden md:flex")}>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">本文 (Markdown)</label>
                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 w-full p-4 border rounded-lg font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none leading-relaxed"
                        placeholder="考えを書き留めましょう..."
                    />
                </div>

                {/* Preview */}
                <div className={cn("flex-1 flex flex-col overflow-hidden", viewMode === 'edit' && "hidden md:flex")}>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">プレビュー</label>
                    <div className="flex-1 overflow-y-auto w-full p-8 border rounded-lg bg-white prose prose-sm sm:prose lg:prose-lg max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </form>
    )
}
