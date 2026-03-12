import { createLink, updateProfile } from '@/app/actions/profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileRepository } from '@/lib/repositories/profile'
import { BackupManager } from './BackupManager'
import { LinksManager } from './LinksManager'
import { ProfileForm } from './ProfileForm'

export default async function SettingsPage() {
    const profile = await ProfileRepository.getProfile()
    const links = await ProfileRepository.getLinks()

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update the public profile shown on the site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm profile={profile} action={updateProfile} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                        <CardDescription>Manage the links shown on the site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LinksManager links={links} action={createLink} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Backup</CardTitle>
                        <CardDescription>Export or import your content data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BackupManager />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
