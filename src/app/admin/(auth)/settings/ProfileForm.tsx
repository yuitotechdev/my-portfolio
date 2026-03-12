'use client'

import ImageUpload from '@/components/ImageUpload'
import { useAdminFormAction } from '@/components/admin/useAdminFormAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type AdminFormAction } from '@/lib/admin-form-state'
import { Profile } from '@/lib/repositories/profile'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function ProfileForm({
    profile,
    action
}: {
    profile: Profile | null
    action: AdminFormAction
}) {
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const { state, formAction, isPending } = useAdminFormAction(action)

    function handleSubmit(formData: FormData) {
        formData.set('avatar_url', avatarUrl)
        formAction(formData)
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {state.status === 'error' && state.message && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input id="name" name="name" defaultValue={profile?.name || ''} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar_url">プロフィール画像</Label>
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
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_short">短い紹介文</Label>
                <Input id="bio_short" name="bio_short" defaultValue={profile?.bio_short || ''} placeholder="ソフトウェアエンジニア / デザイナー" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_medium">中くらいの紹介文</Label>
                <Textarea id="bio_medium" name="bio_medium" defaultValue={profile?.bio_medium || ''} className="h-24" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_long">長い紹介文</Label>
                <Textarea id="bio_long" name="bio_long" defaultValue={profile?.bio_long || ''} className="h-48" />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    プロフィールを保存
                </Button>
            </div>
        </form>
    )
}
