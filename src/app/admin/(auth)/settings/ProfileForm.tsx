'use client'

import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Profile } from '@/lib/repositories/profile'
import { Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

export function ProfileForm({ profile }: { profile: Profile | null }) {
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await updateProfile(formData)
                toast.success('Profile updated')
            } catch {
                toast.error('Failed to update profile')
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={profile?.name || ''} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input id="avatar_url" name="avatar_url" defaultValue={profile?.avatar_url || ''} placeholder="https://..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_short">Bio (Short) - For Home Hero</Label>
                <Input id="bio_short" name="bio_short" defaultValue={profile?.bio_short || ''} placeholder="Software Engineer / Designer" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_medium">Bio (Medium) - For About Summary</Label>
                <Textarea id="bio_medium" name="bio_medium" defaultValue={profile?.bio_medium || ''} className="h-24" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio_long">Bio (Long) - Full About Page</Label>
                <Textarea id="bio_long" name="bio_long" defaultValue={profile?.bio_long || ''} className="h-48" />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Profile
                </Button>
            </div>
        </form>
    )
}
