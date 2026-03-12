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
        <div className="max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">設定</h1>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>プロフィール</CardTitle>
                        <CardDescription>公開サイトに表示するプロフィール情報を更新します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm profile={profile} action={updateProfile} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>外部リンク</CardTitle>
                        <CardDescription>サイトに表示するSNSや外部リンクを管理します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LinksManager links={links} action={createLink} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>バックアップ</CardTitle>
                        <CardDescription>コンテンツデータの書き出しと取り込みを行います。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BackupManager />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
