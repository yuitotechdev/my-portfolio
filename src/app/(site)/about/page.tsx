import { ProfileRepository } from '@/lib/repositories/profile'
import { Reveal } from '@/components/ui/motion'
import Image from 'next/image'

export const metadata = {
    title: 'About - Portfolio',
    description: 'About the creator.',
}

export default async function AboutPage() {
    const profile = await ProfileRepository.getProfile()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-3xl mx-auto">
            <Reveal>
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">About</h1>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {profile?.avatar_url && (
                            <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden bg-gray-100">
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.name || 'Avatar'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{profile?.name || 'Creator'}</h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {profile?.bio_medium || profile?.bio_short}
                            </p>
                        </div>
                    </div>
                </header>
            </Reveal>

            <Reveal delay={0.2}>
                <section className="prose prose-lg prose-gray max-w-none whitespace-pre-wrap text-gray-700">
                    {profile?.bio_long ? profile.bio_long : (
                        <p className="text-gray-400 italic">No details added yet.</p>
                    )}
                </section>
            </Reveal>
        </main>
    )
}
