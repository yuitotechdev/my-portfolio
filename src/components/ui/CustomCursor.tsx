'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'
import { usePathname } from 'next/navigation'

export function CustomCursor() {
    const { preference } = useMotion()
    const isSafe = preference === 'safe' || preference === 'minimal'
    
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()
    
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const requestRef = useRef<number | null>(null)
    const mousePos = useRef({ x: -100, y: -100 })
    const dotPos = useRef({ x: -100, y: -100 })
    const ringPos = useRef({ x: -100, y: -100 })

    useEffect(() => {
        if (isSafe) return

        const updateMousePosition = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
            if (!isVisible) setIsVisible(true)

            // 【超重要】内部ドットだけは requestAnimationFrame を待たず、
            // イベントの直後に直接書き換えることで「物理的な遅延ゼロ」を実現
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
            }
        }

        const render = () => {
            // 外部リングは優雅さを出すため、あえて少し遅れて（Lerp 0.15）追従させる
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
            }

            requestRef.current = requestAnimationFrame(render)
        }
        
        const updateHoverState = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isClickable = target.closest('a, button, input, textarea, select, [role="button"]')
            setIsHovering(!!isClickable)
        }
        
        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', updateMousePosition)
        window.addEventListener('mouseover', updateHoverState)
        document.body.addEventListener('mouseleave', handleMouseLeave)
        document.body.addEventListener('mouseenter', handleMouseEnter)

        requestRef.current = requestAnimationFrame(render)

        document.body.classList.add('cursor-none-global')

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('mouseover', updateHoverState)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
            document.body.removeEventListener('mouseenter', handleMouseEnter)
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
            document.body.classList.remove('cursor-none-global')
        }
    }, [isSafe, isVisible])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHovering(false)
        }, 0)
        return () => clearTimeout(timer)
    }, [pathname])

    if (isSafe) return null

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {/* 外部リング: Lerpを効かせて優雅に、サイズ変更のみFramer Motionで管理 */}
            <div 
                ref={ringRef}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ opacity: isVisible ? 1 : 0 }}
            >
                <motion.div
                    className="rounded-full mix-blend-difference border border-white/40"
                    animate={{
                        width: isHovering ? 64 : 40,
                        height: isHovering ? 64 : 40,
                        backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)'
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                />
            </div>

            {/* 内部ドット: Lerp高速(ほぼ即時)で遅延をゼロに */}
            <div 
                ref={dotRef}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ opacity: isVisible ? 1 : 0 }}
            >
                <div className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
            </div>
        </div>
    )
}
