import { WorksRepository } from '@/lib/repositories/works'
import { StaggerList, Reveal } from '@/components/ui/motion'
import { WorkCard } from './_components/WorkCard'
import { SoundTester } from './_components/SoundTester'
import { PAGE_TITLES, COMMON_TEXT } from '@/config/i18n'

export const metadata = {
    title: 'Works - Portfolio',
    description: 'Selected works and projects.',
}

export default async function WorksPage() {
    const works = await WorksRepository.getAllPublic()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <SoundTester />
            <Reveal>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{PAGE_TITLES.works}</h1>
                <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
                    Selected projects showing web application development,
                    design systems, and technical challenges.
                </p>
            </Reveal>

            <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {works.map((work) => (
                    <WorkCard key={work.id} work={work} />
                ))}
            </StaggerList>

            {works.length === 0 && (
                <Reveal>
                    <div className="p-12 text-center bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">{COMMON_TEXT.no_data}</p>
                    </div>
                </Reveal>
            )}
        </main>
    )
}
