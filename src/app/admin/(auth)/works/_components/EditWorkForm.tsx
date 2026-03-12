'use client'

import ImageUpload from '@/components/ImageUpload'
import MultiImageUpload from '@/components/MultiImageUpload'
import { useAdminFormAction } from '@/components/admin/useAdminFormAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { type AdminFormAction } from '@/lib/admin-form-state'
import { Work } from '@/lib/repositories/works'
import { ArrowLeft, Eye, Github, Globe, Loader2, Sparkles, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface WorkWithPublic extends Work {
    is_public?: boolean
}

export default function EditWorkForm({
    work,
    action
}: {
    work?: WorkWithPublic
    action: AdminFormAction
}) {
    const isEdit = !!work
    const [thumbnailUrl, setThumbnailUrl] = useState(work?.thumbnail_url || '')
    const [screenshots, setScreenshots] = useState<string[]>(work?.screenshots || [])
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [title, setTitle] = useState(work?.title || '')
    const [description, setDescription] = useState(work?.description || '')
    const [techStack, setTechStack] = useState(work?.tech_stack?.join(', ') || '')
    const { state, formAction, isPending } = useAdminFormAction(action)

    function handleSubmit(formData: FormData) {
        formData.set('thumbnail_url', thumbnailUrl)
        formData.set('screenshots', JSON.stringify(screenshots))
        formAction(formData)
    }

    return (
        <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col gap-8 md:flex-row">
                <div className={`flex-1 transition-all duration-500 ${isPreviewMode ? 'md:w-1/2' : 'w-full'}`}>
                    <form action={handleSubmit} className="space-y-8">
                        <header className="sticky top-0 z-20 flex items-center justify-between bg-gray-100 py-4 backdrop-blur-md dark:bg-zinc-950/80">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild className="rounded-full">
                                    <Link href="/admin/works">
                                        <ArrowLeft size={20} />
                                    </Link>
                                </Button>
                                <h1 className="text-xl font-black tracking-tighter">
                                    {isEdit ? '制作実績を編集' : '制作実績を追加'}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                    className="rounded-full border-zinc-300 px-4 font-bold dark:border-zinc-700"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    {isPreviewMode ? 'プレビューを閉じる' : 'プレビューを見る'}
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isPending}
                                    className="rounded-full bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
                                >
                                    {isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    {isEdit ? '更新する' : '追加する'}
                                </Button>
                            </div>
                        </header>

                        {state.status === 'error' && state.message && (
                            <p className="text-sm text-red-600">{state.message}</p>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            <Card className="overflow-hidden rounded-[2rem] border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                <CardContent className="space-y-8 pt-8">
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <div className="flex items-center justify-between rounded-3xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                                            <div className="space-y-1">
                                                <Label htmlFor="is_public" className="text-sm font-black tracking-widest text-zinc-500">
                                                    公開設定
                                                </Label>
                                                <p className="text-[10px] font-medium text-zinc-400">
                                                    オンにすると公開ページに表示されます。
                                                </p>
                                            </div>
                                            <Switch id="is_public" name="is_public" defaultChecked={work?.is_public ?? true} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="slug" className="text-sm font-black tracking-widest text-zinc-500">
                                                URLスラッグ
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                                                    /works/
                                                </span>
                                                <Input
                                                    id="slug"
                                                    name="slug"
                                                    defaultValue={work?.slug}
                                                    required
                                                    className="h-14 rounded-2xl border-none bg-zinc-50 pl-16 dark:bg-zinc-950"
                                                />
                                            </div>
                                            <p className="text-xs text-zinc-500">
                                                公開URLの末尾に使う、半角英数字とハイフンの識別子です。
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="title" className="text-sm font-black tracking-widest text-zinc-500">
                                            タイトル
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="h-14 rounded-2xl border-none bg-zinc-50 text-lg font-bold dark:bg-zinc-950"
                                            placeholder="制作実績のタイトル"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="description" className="text-sm font-black tracking-widest text-zinc-500">
                                            説明
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="min-h-[160px] rounded-3xl border-none bg-zinc-50 p-6 leading-relaxed dark:bg-zinc-950"
                                            placeholder="制作物の概要や狙いを入力"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <Label htmlFor="deployment_url" className="flex items-center gap-2 text-sm font-black tracking-widest text-zinc-500">
                                                <Globe size={14} />
                                                公開URL
                                            </Label>
                                            <Input
                                                id="deployment_url"
                                                name="deployment_url"
                                                type="url"
                                                defaultValue={work?.deployment_url || ''}
                                                className="h-14 rounded-2xl border-none bg-zinc-50 dark:bg-zinc-950"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="github_url" className="flex items-center gap-2 text-sm font-black tracking-widest text-zinc-500">
                                                <Github size={14} />
                                                GitHub URL
                                            </Label>
                                            <Input
                                                id="github_url"
                                                name="github_url"
                                                type="url"
                                                defaultValue={work?.github_url || ''}
                                                className="h-14 rounded-2xl border-none bg-zinc-50 dark:bg-zinc-950"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="tech_stack" className="flex items-center gap-2 text-sm font-black tracking-widest text-zinc-500">
                                            <Tag size={14} />
                                            技術スタック
                                        </Label>
                                        <Input
                                            id="tech_stack"
                                            name="tech_stack"
                                            value={techStack}
                                            onChange={(e) => setTechStack(e.target.value)}
                                            className="h-14 rounded-2xl border-none bg-zinc-50 dark:bg-zinc-950"
                                            placeholder="Next.js, TypeScript, Supabase"
                                        />
                                        <p className="text-xs text-zinc-500">カンマ区切りで入力してください。</p>
                                    </div>

                                    <div className="space-y-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                                        <Label className="text-sm font-black tracking-widest text-zinc-500">
                                            メイン画像
                                        </Label>
                                        <ImageUpload bucket="works" initialUrl={thumbnailUrl} onUpload={(url) => setThumbnailUrl(url)} />
                                        <Input
                                            id="thumbnail_url"
                                            name="thumbnail_url"
                                            value={thumbnailUrl}
                                            onChange={(e) => setThumbnailUrl(e.target.value)}
                                            className="h-12 rounded-2xl border-none bg-zinc-50 text-xs dark:bg-zinc-950"
                                        />
                                    </div>

                                    <div className="space-y-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                                        <Label className="text-sm font-black tracking-widest text-zinc-500">
                                            機能紹介画像
                                        </Label>
                                        <MultiImageUpload bucket="works" value={screenshots} onChange={setScreenshots} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </div>

                {isPreviewMode && (
                    <div className="sticky top-4 hidden flex-1 self-start md:block">
                        <div className="h-[calc(100vh-2rem)] overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-950 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-amber-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-emerald-500/20" />
                                </div>
                                <div className="text-[10px] font-black tracking-widest text-zinc-500">プレビュー</div>
                                <div />
                            </div>
                            <div className="custom-scrollbar h-full overflow-y-auto p-8">
                                <div className="space-y-12 pb-20">
                                    {thumbnailUrl && (
                                        <div className="relative aspect-video overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-white/10">
                                            <Image src={thumbnailUrl} alt="作品プレビュー" fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="space-y-6">
                                        <h1 className="text-5xl font-black tracking-tighter text-white">
                                            {title || '制作実績タイトル'}
                                        </h1>
                                        <div className="flex flex-wrap gap-2">
                                            {techStack.split(',').map((tech, index) => tech.trim() && (
                                                <span
                                                    key={`${tech}-${index}`}
                                                    className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-white/40"
                                                >
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xl font-medium leading-relaxed text-zinc-400">
                                        {description || 'ここに制作実績の説明が表示されます。'}
                                    </p>

                                    {screenshots.length > 0 && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {screenshots.map((url, index) => (
                                                <div
                                                    key={`${url}-${index}`}
                                                    className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10"
                                                >
                                                    <Image src={url} alt={`スクリーンショット ${index + 1}`} fill className="object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
