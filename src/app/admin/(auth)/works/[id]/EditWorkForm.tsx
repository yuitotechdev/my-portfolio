'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import Link from 'next/link'
import { toast } from 'sonner'

interface Work {
    id?: string
    title: string
    slug: string
    description: string
    thumbnail_url: string
    tech_stack: string[]
    deployment_url: string
    github_url: string
    is_public: boolean
}

interface EditWorkFormProps {
    work?: Work
    action: (formData: FormData) => Promise<void>
}

export default function EditWorkForm({ work, action }: EditWorkFormProps) {
    const [thumbnailUrl, setThumbnailUrl] = useState(work?.thumbnail_url || '')
    const [title, setTitle] = useState(work?.title || '')
    const [slug, setSlug] = useState(work?.slug || '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Auto-generate slug from title if new work and slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        if (!work && !slug) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
    }

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsSubmitting(true)
            await action(formData)
            toast.success(work ? 'Work updated successfully' : 'Work created successfully')
        } catch (error) {
            console.error(error)
            const message = error instanceof Error ? error.message : 'Failed to save work'
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center border-b pb-6">
                <h1 className="text-3xl font-bold">{work ? 'Edit Work' : 'New Work'}</h1>
                <div className="flex items-center gap-4">
                    <Link href="/admin/works" className={`text-gray-500 hover:text-gray-900 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>Cancel</Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Work'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Image */}
                <div className="md:col-span-1 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                    <ImageUpload
                        bucket="works"
                        initialUrl={thumbnailUrl}
                        onUpload={(url) => setThumbnailUrl(url)}
                    />
                    <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_public"
                                defaultChecked={work?.is_public}
                                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-gray-900 font-medium">Publish immediately</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            If unchecked, this work will be saved as a draft.
                        </p>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-50 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={work?.description}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                        <input
                            type="text"
                            name="tech_stack"
                            defaultValue={work?.tech_stack.join(', ')}
                            placeholder="Next.js, TypeScript, Supabase"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deployment URL</label>
                            <input
                                type="url"
                                name="deployment_url"
                                defaultValue={work?.deployment_url}
                                placeholder="https://..."
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                            <input
                                type="url"
                                name="github_url"
                                defaultValue={work?.github_url}
                                placeholder="https://github.com/..."
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
