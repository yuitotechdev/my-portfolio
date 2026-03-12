import { DevicesRepository } from '@/lib/repositories/devices'
import { Reveal, StaggerList } from '@/components/ui/motion'
import { ExternalLink, Monitor } from 'lucide-react'
import { PAGE_TITLES, COMMON_TEXT } from '@/config/i18n'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Gear - Portfolio',
    description: 'My gear and setup.',
}

export default async function DevicesPage() {
    const devices = await DevicesRepository.getAllPublic()

    // Group by category
    const grouped = devices.reduce((acc, device) => {
        const cat = device.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(device)
        return acc
    }, {} as Record<string, typeof devices>)

    const categories = Object.keys(grouped)

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 bg-background">
            <div className="max-w-4xl mx-auto">
                <Reveal>
                    <header className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{PAGE_TITLES.devices}</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            The equipment I use to create.
                        </p>
                    </header>
                </Reveal>

                {categories.length > 0 ? (
                    <div className="space-y-16">
                        {categories.map((category, idx) => (
                            <section key={category}>
                                <Reveal delay={idx * 0.1}>
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b pb-2 border-border">
                                        <Monitor className="w-5 h-5 text-muted-foreground" />
                                        {category}
                                    </h2>
                                </Reveal>

                                <StaggerList className="grid grid-cols-1 gap-6">
                                    {grouped[category].map((device) => (
                                        <div
                                            key={device.id}
                                            className="bg-muted/20 rounded-xl p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 md:items-start"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-foreground">{device.name}</h3>
                                                    {device.link_url && (
                                                        <a
                                                            href={device.link_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-400 hover:text-indigo-600"
                                                        >
                                                            <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                                                        </a>
                                                    )}
                                                </div>

                                                {device.purchase_reason && (
                                                    <div className="mb-3 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-lg inline-block border border-primary/20">
                                                        <span className="font-bold mr-1">Why:</span> {device.purchase_reason}
                                                    </div>
                                                )}

                                                <p className="text-muted-foreground whitespace-pre-wrap">{device.description}</p>
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
                            <Monitor className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>{COMMON_TEXT.no_data}</p>
                        </div>
                    </Reveal>
                )}
            </div>
        </main>
    )
}
