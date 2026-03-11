import { PageTransition } from "@/components/layout/PageTransition"
import { AmbientGlow } from "@/components/ui/AmbientGlow"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-accent">
            <AmbientGlow />

            <div className="relative z-10">
                <PageTransition>
                    {children}
                </PageTransition>
            </div>
        </div>
    )
}
