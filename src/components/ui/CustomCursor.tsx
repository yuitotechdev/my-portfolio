'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'
import { usePathname } from 'next/navigation'
import { Eye, Play, ArrowRight, MousePointer2 } from 'lucide-react'

export type CursorType = 'default' | 'view' | 'play' | 'link' | 'text'

export function CustomCursor() {
    const { preference } = useMotion()
    const isSafe = preference === 'safe' || preference === 'minimal'
    
    const [cursorType, setCursorType] = useState<CursorType>('default')
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()
    
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const requestRef = useRef<number | null>(null)
    const mousePos = useRef({ x: -100, y: -100 })
    const ringPos = useRef({ x: -100, y: -100 })

    const updateCursorType = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement
        const clickable = target.closest('a, button, [role="button"]')
        const textInput = target.closest('input, textarea, [contenteditable="true"]')
        const viewArea = target.closest('[data-cursor="view"]')
        const playArea = target.closest('[data-cursor="play"]')

        if (viewArea) setCursorType('view')
        else if (playArea) setCursorType('play')
        else if (clickable) setCursorType('link')
        else if (textInput) setCursorType('text')
        else setCursorType('default')
    }, [])

    useEffect(() => {
        if (isSafe) return

        const updateMousePosition = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
            if (!isVisible) setIsVisible(true)

            // 内部ドットは物理遅延ゼロ
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
            }
            updateCursorType(e)
        }

        const render = () => {
            // 外部リングの柔らかな追従 (Lerp 0.15)
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
            }

            requestRef.current = requestAnimationFrame(render)
        }
        
        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', updateMousePosition)
        window.addEventListener('mouseover', updateCursorType)
        document.body.addEventListener('mouseleave', handleMouseLeave)
        document.body.addEventListener('mouseenter', handleMouseEnter)

        requestRef.current = requestAnimationFrame(render)
        document.body.classList.add('cursor-none-global')

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('mouseover', updateCursorType)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
            document.body.removeEventListener('mouseenter', handleMouseEnter)
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
            document.body.classList.remove('cursor-none-global')
        }
    }, [isSafe, isVisible, updateCursorType])

    useEffect(() => {
        const timer = setTimeout(() => {
            setCursorType('default')
        }, 0)
        return () => clearTimeout(timer)
    }, [pathname])

    if (isSafe) return null

    const renderCursorContent = () => {
        switch (cursorType) {
            case 'view': return <Eye className="w-6 h-6 text-black" />
            case 'play': return <Play className="w-6 h-6 text-black fill-current" />
            case 'link': return null // Default ring expands
            default: return null
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {/* 外部リング: 状態に応じて形状変化 (案8) */}
            <div 
                ref={ringRef}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform flex items-center justify-center"
                style={{ opacity: isVisible ? 1 : 0 }}
            >
                <motion.div
                    className="rounded-full mix-blend-difference border border-white/40 flex items-center justify-center overflow-hidden"
                    animate={{
                        width: cursorType === 'default' ? 40 : (cursorType === 'text' ? 4 : 80),
                        height: cursorType === 'default' ? 40 : (cursorType === 'text' ? 24 : 80),
                        backgroundColor: (cursorType === 'view' || cursorType === 'play') ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
                        borderRadius: cursorType === 'text' ? '2px' : '50%',
                        mixBlendMode: (cursorType === 'view' || cursorType === 'play') ? 'normal' : 'difference'
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {renderCursorContent()}
                </motion.div>
                
                {/* 案8: ラベル表示 (VIEW / EXPLORE 等) */}
                <AnimatePresence>
                    {(cursorType === 'view' || cursorType === 'play') && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute mt-24 text-[10px] font-bold tracking-[0.2em] text-white uppercase whitespace-nowrap bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm"
                        >
                            {cursorType === 'view' ? 'View Project' : 'Play Video'}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* 内部ドット: 加速同期 */}
            <div 
                ref={dotRef}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ opacity: isVisible ? 1 : 0 }}
            >
                <motion.div 
                    className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
                    animate={{ scale: cursorType === 'default' ? 1 : 0 }}
                />
            </div>
        </div>
    )
}
