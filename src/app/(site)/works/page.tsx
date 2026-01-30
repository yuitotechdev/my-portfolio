import { WorksRepository } from '@/lib/repositories/works'
import { StaggerList, Reveal } from '@/components/ui/motion'
import { WorkCard } from './_components/WorkCard'

export const metadata = {
    title: 'Works - Portfolio',
    description: 'Selected works and projects.',
}

export default async function WorksPage() {
    const works = await WorksRepository.getAllPublic()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <Reveal>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Works</h1>
                <p className="text-xl text-gray-600 mb-16 max-w-2xl">
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
                    <div className="p-12 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No public works available yet.</p>
                    </div>
                </Reveal>
            )}
        </main>
    )
}
