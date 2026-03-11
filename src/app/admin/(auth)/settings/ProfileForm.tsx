'use client'

import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Profile } from '@/lib/repositories/profile'
import { Loader2 } from 'lucide-react'
import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import ImageUpload from '@/components/ImageUpload'

export function ProfileForm({ profile }: { profile: Profile | null }) {
    const [isPending, startTransition] = useTransition()
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')

    async function handleSubmit(formData: FormData) {
        formData.set('avatar_url', avatarUrl)
        startTransition(async () => {
            try {
                await updateProfile(formData)
                toast.success('プロフィールを更新しました')
            } catch {
                toast.error('プロフィールの更新に失敗しました')
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input id="name" name="name" defaultValue={profile?.name || ''} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar_url">アバター画像</Label>
                <ImageUpload 
                    bucket="avatars" 
                    initialUrl={avatarUrl} 
                    onUpload={(url) => setAvatarUrl(url)} 
                />
                <Input 
                    id="avatar_url" 
                    name="avatar_url" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="または直接URLを入力: https://..." 
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_short">略歴 (短) - ホームのヒーローセクション用</Label>
                <Input id="bio_short" name="bio_short" defaultValue={profile?.bio_short || ''} placeholder="Software Engineer / Designer" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_medium">略歴 (中) - 自己紹介の要約用</Label>
                <Textarea id="bio_medium" name="bio_medium" defaultValue={profile?.bio_medium || ''} className="h-24" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_long">略歴 (長) - 自己紹介ページ全文</Label>
                <Textarea id="bio_long" name="bio_long" defaultValue={profile?.bio_long || ''} className="h-48" />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    プロフィールを保存
                </Button>
            </div>
        </form>
    )
}
