import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse p-6 md:p-12 max-w-7xl mx-auto">
            {/* Header / Hero Area */}
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 max-w-lg" /> {/* Title */}
                <Skeleton className="h-4 w-1/2 max-w-sm" />  {/* Subtitle */}
            </div>

            {/* Content Area - Simulates a grid or text block */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full rounded-xl" /> {/* Card Thumbnail */}
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>

            {/* Alternative Text Layout Simulation (if grid isn't relevant for some pages, this sits below or mixes in) */}
            <div className="space-y-2 pt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
            </div>
        </div>
    )
}
