'use client'

import { useMotion } from "@/components/providers/MotionProvider"
import { Button } from "@/components/ui/button"
import { Zap, Shield, Battery } from "lucide-react"
import { cn } from "@/lib/utils"

export function MotionToggle() {
    const { preference, setPreference } = useMotion()

    const cyclePreference = () => {
        if (preference === 'high') setPreference('safe')
        else if (preference === 'safe') setPreference('minimal')
        else setPreference('high')
    }

    const options = [
        { value: 'high', label: 'High', icon: Zap, desc: 'Full Motion' },
        { value: 'safe', label: 'Safe', icon: Shield, desc: 'No Parallax/Scale' },
        { value: 'minimal', label: 'Minimal', icon: Battery, desc: 'Fade Only' },
    ]

    const currentOption = options.find(o => o.value === preference) || options[0]
    const Icon = currentOption.icon

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Expansion logic can be added, for now simple cycler */}
            <Button
                variant="outline"
                size="sm"
                onClick={cyclePreference}
                className={cn(
                    "flex items-center gap-2 bg-background/80 backdrop-blur-md border-gray-200 shadow-sm hover:bg-gray-100 transition-all",
                    preference === 'high' && "text-indigo-600 border-indigo-100",
                    preference === 'safe' && "text-emerald-600 border-emerald-100",
                    preference === 'minimal' && "text-gray-500 border-gray-200"
                )}
                title={`Motion Mode: ${currentOption.label} - ${currentOption.desc}`}
            >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{currentOption.label}</span>
            </Button>
        </div>
    )
}
