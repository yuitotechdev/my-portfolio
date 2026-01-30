import { PageTransition } from "@/components/layout/PageTransition"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-accent">
            {/* Ambient Paper Texture & Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden isolate">
                {/* Warm Light Spot (Top Left) */}
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_70%)] opacity-60 mix-blend-soft-light blur-3xl" />

                {/* Accent Warmth (Bottom Right) */}
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(138,90,60,0.08)_0%,rgba(138,90,60,0)_70%)] opacity-40 blur-3xl" />

                {/* Subtle Grain (Optional, using CSS noise if available, or just keeping it clean for now) */}
                <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>

            <div className="relative z-10">
                <PageTransition>
                    {children}
                </PageTransition>
            </div>
        </div>
    )
}
