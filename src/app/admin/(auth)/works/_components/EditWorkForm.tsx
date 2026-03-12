'use client'

import { createWork, updateWork } from '@/app/actions/works'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Work } from '@/lib/repositories/works'
import { Loader2, Eye, Layout, Globe, Github, Tag, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import ImageUpload from '@/components/ImageUpload'
import Image from 'next/image'

interface WorkWithPublic extends Work {
    is_public?: boolean
}

export default function EditWorkForm({ work, action }: { work?: WorkWithPublic, action?: (formData: FormData) => Promise<{ error?: string } | void | undefined> }) {
    const isEdit = !!work
    const [isPending, startTransition] = useTransition()
    const [thumbnailUrl, setThumbnailUrl] = useState(work?.thumbnail_url || '')
    const [isPreviewMode, setIsPreviewMode] = useState(false)

    // Form states for live preview
    const [title, setTitle] = useState(work?.title || '')
    const [description, setDescription] = useState(work?.description || '')
    const [techStack, setTechStack] = useState(work?.tech_stack?.join(', ') || '')

    async function handleSubmit(formData: FormData) {
        formData.set('thumbnail_url', thumbnailUrl)
        startTransition(async () => {
            try {
                if (action) {
                    const result = await action(formData)
                    if (result?.error) toast.error(result.error)
                    else toast.success(isEdit ? '実績を更新しました' : '実績を作成しました')
                } else {
                    if (isEdit && work) {
                        await updateWork(work.id, formData)
                        toast.success('実績を更新しました')
                    } else {
                        await createWork(formData)
                        toast.success('実績を作成しました')
                    }
                }
            } catch (error) {
                toast.error('保存に失敗しました')
            }
        })
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Editor Section */}
                <div className={`flex-1 transition-all duration-500 ${isPreviewMode ? 'md:w-1/2' : 'w-full'}`}>
                    <form action={handleSubmit} className="space-y-8">
                        <header className="flex items-center justify-between sticky top-0 z-20 bg-gray-100 dark:bg-zinc-950/80 backdrop-blur-md py-4">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild className="rounded-full">
                                    <Link href="/admin/works"><ArrowLeft size={20} /></Link>
                                </Button>
                                <h1 className="text-xl font-black tracking-tighter uppercase">{isEdit ? 'Edit Work' : 'New Project'}</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                    className="rounded-full font-bold px-4 border-zinc-300 dark:border-zinc-700"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
                                </Button>
                                <Button type="submit" size="sm" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-500/20">
                                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                    Deploy Changes
                                </Button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 gap-6">
                            <Card className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
                                <CardContent className="pt-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                            <div className="space-y-1">
                                                <Label htmlFor="is_public" className="text-sm font-black uppercase tracking-widest text-zinc-500">Public Status</Label>
                                                <p className="text-[10px] text-zinc-400 font-medium">Visible to site visitors</p>
                                            </div>
                                            <Switch id="is_public" name="is_public" defaultChecked={work?.is_public ?? true} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="slug" className="text-sm font-black uppercase tracking-widest text-zinc-500">Project Path (Slug)</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">/works/</span>
                                                <Input id="slug" name="slug" defaultValue={work?.slug} required className="pl-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-14" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="title" className="text-sm font-black uppercase tracking-widest text-zinc-500">Project Title</Label>
                                        <Input 
                                            id="title" 
                                            name="title" 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)}
                                            required 
                                            className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-14 text-lg font-bold" 
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="description" className="text-sm font-black uppercase tracking-widest text-zinc-500">Narrative Description</Label>
                                        <Textarea 
                                            id="description" 
                                            name="description" 
                                            value={description} 
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="rounded-3xl bg-zinc-50 dark:bg-zinc-950 border-none min-h-[160px] leading-relaxed p-6" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="deployment_url" className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Globe size={14} /> Live URL</Label>
                                            <Input id="deployment_url" name="deployment_url" type="url" defaultValue={work?.deployment_url || ''} className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-14" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="github_url" className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Github size={14} /> Source Code</Label>
                                            <Input id="github_url" name="github_url" type="url" defaultValue={work?.github_url || ''} className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-14" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="tech_stack" className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Tag size={14} /> Technology Stack</Label>
                                        <Input 
                                            id="tech_stack" 
                                            name="tech_stack" 
                                            value={techStack} 
                                            onChange={(e) => setTechStack(e.target.value)}
                                            className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-14" 
                                        />
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-black uppercase tracking-widest text-zinc-500">Visual Identity (Thumbnail)</Label>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                                                <Sparkles size={10} /> Media Intelligence Active
                                            </div>
                                        </div>
                                        <ImageUpload bucket="works" initialUrl={thumbnailUrl} onUpload={(url) => setThumbnailUrl(url)} />
                                        <Input 
                                            id="thumbnail_url" 
                                            name="thumbnail_url" 
                                            value={thumbnailUrl} 
                                            onChange={(e) => setThumbnailUrl(e.target.value)}
                                            className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-12 text-xs" 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </div>

                {/* Preview Section (Idea 3) */}
                {isPreviewMode && (
                    <div className="hidden md:block flex-1 sticky top-4 self-start">
                        <div className="bg-zinc-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-800 h-[calc(100vh-2rem)]">
                            <div className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                                </div>
                                <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Live Preview Mode</div>
                                <div />
                            </div>
                            <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                                {/* Simulated Work Detail Page */}
                                <div className="space-y-12 pb-20">
                                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 ring-1 ring-white/10">
                                        {thumbnailUrl ? (
                                            <Image src={thumbnailUrl} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest">No Thumbnail</div>
                                        )}
                                    </div>
                                    <div className="space-y-6">
                                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase">{title || 'Project Title'}</h1>
                                        <div className="flex flex-wrap gap-2">
                                            {techStack.split(',').map((tech, i) => tech.trim() && (
                                                <span key={i} className="text-[10px] font-black tracking-[0.2em] uppercase bg-white/5 text-white/40 px-3 py-1 rounded-full border border-white/5">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                                        {description || 'This is where your project narrative will appear. Start typing in the editor to see it update.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
