'use client'

import { ReactLenis } from 'lenis/react'
import { useMotion } from '@/components/providers/MotionProvider'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const { preference } = useMotion()
    
    // モーションを減らす設定の場合はLenisを無効化
    if (preference === 'minimal') {
        return <>{children}</>
    }

    // Awwwardsに多い、慣性が少し重めで心地よい設定
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    )
}
