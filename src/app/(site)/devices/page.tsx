import { Reveal, StaggerList } from '@/components/ui/motion'
import { COMMON_TEXT, PAGE_TITLES } from '@/config/i18n'
import { DevicesRepository } from '@/lib/repositories/devices'
import { ExternalLink, Monitor } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Gear - Portfolio',
    description: 'My gear and setup.'
}

export default async function DevicesPage() {
    const devices = await DevicesRepository.getAllPublic()

    const grouped = devices.reduce((acc, device) => {
        const category = device.category || 'Other'
        if (!acc[category]) acc[category] = []
        acc[category].push(device)
        return acc
    }, {} as Record<string, typeof devices>)

    const categories = Object.keys(grouped)

    return (
        <main className="min-h-screen bg-background px-6 py-24 md:px-12">
            <div className="mx-auto max-w-4xl">
                <Reveal>
                    <header className="mb-16">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{PAGE_TITLES.devices}</h1>
                        <p className="max-w-2xl text-xl text-muted-foreground">
                            The equipment I use to create.
                        </p>
                    </header>
                </Reveal>

                {categories.length > 0 ? (
                    <div className="space-y-16">
                        {categories.map((category, index) => (
                            <section key={category}>
                                <Reveal delay={index * 0.1}>
                                    <h2 className="mb-8 flex items-center gap-2 border-b border-border pb-2 text-2xl font-bold">
                                        <Monitor className="h-5 w-5 text-muted-foreground" />
                                        {category}
                                    </h2>
                                </Reveal>

                                <StaggerList className="grid grid-cols-1 gap-6">
                                    {grouped[category].map((device) => (
                                        <div
                                            key={device.id}
                                            className="flex flex-col gap-6 rounded-xl border border-border bg-muted/20 p-6 shadow-sm md:flex-row md:items-start"
                                        >
                                            {device.thumbnail_url && (
                                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted/40 md:w-48">
                                                    <Image
                                                        src={device.thumbnail_url}
                                                        alt={device.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <h3 className="text-xl font-bold text-foreground">{device.name}</h3>
                                                    {device.link_url && (
                                                        <a
                                                            href={device.link_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-400 hover:text-indigo-600"
                                                        >
                                                            <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                                                        </a>
                                                    )}
                                                </div>

                                                {device.purchase_reason && (
                                                    <div className="mb-3 inline-block rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm text-primary">
                                                        <span className="mr-1 font-bold">Why:</span>
                                                        {device.purchase_reason}
                                                    </div>
                                                )}

                                                <p className="whitespace-pre-wrap text-muted-foreground">{device.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </StaggerList>
                            </section>
                        ))}
                    </div>
                ) : (
                    <Reveal delay={0.2}>
                        <div className="py-24 text-center text-gray-400">
                            <Monitor className="mx-auto mb-4 h-12 w-12 opacity-20" />
                            <p>{COMMON_TEXT.no_data}</p>
                        </div>
                    </Reveal>
                )}
            </div>
        </main>
    )
}
