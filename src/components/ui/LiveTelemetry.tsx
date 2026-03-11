'use client'

import { useEffect, useState } from 'react'
import { Clock, MapPin, GitCommit } from 'lucide-react'

export function LiveTelemetry() {
    const [time, setTime] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true)
        }, 0)
        
        const interval = setInterval(() => {
            const now = new Date()
            setTime(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }, 1000)
        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [])

    if (!mounted) return null

    return (
        <div className="flex flex-wrap gap-8 py-12 border-t border-border mt-24">
            {/* 案10: 生きているデータ - 現在時刻 */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-500">
                    <Clock size={16} />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Local Time</div>
                    <div className="text-sm font-mono tracking-tighter tabular-nums font-bold">{time} JST</div>
                </div>
            </div>

            {/* 案10: 生きているデータ - 位置情報 */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                    <MapPin size={16} />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Base</div>
                    <div className="text-sm font-bold tracking-tight">Tokyo, Japan</div>
                </div>
            </div>

            {/* 案10: 生きているデータ - 作業状況 (疑似) */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
                    <GitCommit size={16} />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <div className="text-sm font-bold tracking-tight">Open for collaboration</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
