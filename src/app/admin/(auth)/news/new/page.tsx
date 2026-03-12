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
                <Link href="/admin/news" className="rounded-full p-2 transition-colors hover:bg-gray-100">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">お知らせを追加</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>お知らせ情報</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        {state.status === 'error' && state.message && (
                            <p className="text-sm text-red-600">{state.message}</p>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">タイトル *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="お知らせタイトルを入力"
                                    required
                                    aria-invalid={!!titleError}
                                />
                                {titleError && <p className="text-sm text-red-600">{titleError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">URLスラッグ *</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="site-update"
                                    required
                                    aria-invalid={!!slugError}
                                />
                                <p className="text-xs text-gray-500">お知らせURLの末尾に使う半角英数字とハイフンの識別子です。</p>
                                {slugError && <p className="text-sm text-red-600">{slugError}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">本文</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="短いお知らせ本文を入力"
                                className="min-h-[150px]"
                            />
                            <p className="text-xs text-gray-500">告知や更新情報など、短めの文章に向いています。</p>
                            {contentError && <p className="text-sm text-red-600">{contentError}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="is_public" name="is_public" />
                            <Label htmlFor="is_public">保存後すぐに公開する</Label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                キャンセル
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                お知らせを追加
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
