import { ProfileRepository } from '@/lib/repositories/profile'
import { ProfileForm } from './ProfileForm'
import { LinksManager } from './LinksManager'
import { BackupManager } from './BackupManager' // I will create this next from the old page code
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Assuming shadcn tabs or I will implement basic HTML tabs if missing? 
// Checking task.md Scaffold step "Scaffold & Startup" - did we install shadcn components? "npm run dev" verified startup.
// Usually shadcn is installed component by component. I don't recall installing tabs.
// I'll stick to simple HTML/Button tabs within the client component or just stack them in the server component.
// Stacking is safest and easiest for now.

export default async function SettingsPage() {
    const profile = await ProfileRepository.getProfile()
    const links = await ProfileRepository.getLinks()

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="grid gap-8">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your public profile details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm profile={profile} />
                    </CardContent>
                </Card>

                {/* Links Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                        <CardDescription>Manage links displayed on your site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LinksManager links={links} />
                    </CardContent>
                </Card>

                {/* Backup Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                        <CardDescription>Export or import your database content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BackupManager />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
