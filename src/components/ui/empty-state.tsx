import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EmptyStateProps {
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
    className?: string
}

export function EmptyState({ title, description, actionLabel, actionHref, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "surface-panel flex flex-col items-center justify-center p-12 text-center min-h-[400px]",
            className
        )}>
            <div className="rounded-full bg-accent/10 p-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/20" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-foreground mb-2">
                {title}
            </h3>
            <p className="text-muted text-sm max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Button asChild variant="outline" className="border-border-warm hover:bg-accent/5 hover:text-accent transition-colors">
                    <Link href={actionHref}>
                        {actionLabel}
                    </Link>
                </Button>
            )}
        </div>
    )
}
