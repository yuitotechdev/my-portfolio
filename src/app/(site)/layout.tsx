import { PageTransition } from "@/components/layout/PageTransition"
import { AmbientGlow } from "@/components/ui/AmbientGlow"

import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { CustomCursor } from "@/components/ui/CustomCursor"
import { ProjectWiper } from "@/components/layout/ProjectWiper"
import { GrainOverlay } from "@/components/ui/GrainOverlay"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <SmoothScroll>
            <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-accent">
                <CustomCursor />
                <ProjectWiper />
                <AmbientGlow />
                <GrainOverlay />

                <div className="relative z-10">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </div>
        </SmoothScroll>
    )
}
