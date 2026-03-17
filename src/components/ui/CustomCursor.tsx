'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'
import { Eye, Play, Plus } from 'lucide-react'

export type CursorType = 'default' | 'view' | 'play' | 'link' | 'text' | 'plus'

export function CustomCursor() {
    const { preference, theme } = useMotion()
    const isSafe = preference === 'safe' || preference === 'minimal'
    
    const [cursorType, setCursorType] = useState<CursorType>('default')
    const [isVisible, setIsVisible] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const movingTimer = useRef<NodeJS.Timeout | null>(null)
    
    // Refs for direct DOM manipulation (Zero lag)
    const containerRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)
    
    const mousePos = useRef({ x: -100, y: -100 })
    const ringPos = useRef({ x: -100, y: -100 })
    const requestRef = useRef<number | null>(null)

    // Stretch effect state
    const [scaleX, setScaleX] = useState(1)
    const [skew, setSkew] = useState(0)

    const updateCursorType = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement
        const clickable = target.closest('a, button, [role="button"]')
        const textInput = target.closest('p, h1, h2, h3, span, input, textarea, blockquote')
        const viewArea = target.closest('[data-cursor="view"]')
        const playArea = target.closest('[data-cursor="play"]')
        const plusArea = target.closest('[data-cursor="plus"]')

        if (viewArea) setCursorType('view')
        else if (playArea) setCursorType('play')
        else if (plusArea) setCursorType('plus')
        else if (clickable) setCursorType('link')
        else if (textInput) setCursorType('text')
        else setCursorType('default')
    }, [])

    useEffect(() => {
        if (isSafe) return

        const updateMousePosition = (e: MouseEvent) => {
            const { clientX, clientY } = e
            
            // Handle Movement State
            setIsMoving(true)
            if (movingTimer.current) clearTimeout(movingTimer.current)
            movingTimer.current = setTimeout(() => setIsMoving(false), 600)

            // Calculate velocity for stretch effect
            const dx = clientX - mousePos.current.x
            const dy = clientY - mousePos.current.y
            const velocity = Math.sqrt(dx * dx + dy * dy)
            const stretch = Math.min(velocity * 0.015, 0.5)
            
            mousePos.current = { x: clientX, y: clientY }
            if (!isVisible) setIsVisible(true)

            // Dynamic scaling based on speed
            setScaleX(1 + stretch)
            setSkew(dx * 0.1)

            // Direct Dot Update (Zero Lag)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
            }
        }

        const render = () => {
            // Smooth Ring Follow (Lerp 0.12)
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12

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
            if (movingTimer.current) clearTimeout(movingTimer.current)
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
            document.body.classList.remove('cursor-none-global')
        }
    }, [isSafe, isVisible, updateCursorType])

    if (isSafe) return null

    return (
        <div ref={containerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {/* 外部リング: 背景反転レンズ + 物理ストレッチ */}
            <div 
                ref={ringRef}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform flex items-center justify-center pointer-events-none"
                style={{ 
                    opacity: isVisible 
                        ? (cursorType === 'text' ? (isMoving ? 1 : 0) : 1) 
                        : 0,
                    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <motion.div
                    className="flex items-center justify-center transition-colors duration-500"
                    animate={{
                        width: (cursorType === 'default' || cursorType === 'text') ? 40 : 90,
                        height: (cursorType === 'default' || cursorType === 'text') ? 40 : 90,
                        scaleX: cursorType === 'text' ? 1 : scaleX,
                        rotate: skew,
                        backgroundColor: (cursorType === 'view' || cursorType === 'play' || cursorType === 'plus') 
                            ? (theme === 'dark' ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)') 
                            : 'rgba(255,255,255,0)',
                        borderWidth: 1.5,
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                        backdropFilter: (cursorType === 'link' || cursorType === 'default' || cursorType === 'text') ? 'invert(1)' : 'none',
                        borderRadius: '50%',
                        scale: (cursorType === 'text' && !isMoving) ? 0.8 : 1
                    }}
                    transition={{ 
                        type: 'spring', 
                        damping: 25, 
                        stiffness: 350, 
                        mass: 0.5,
                        scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    }}
                >
                    <AnimatePresence mode="wait">
                        {cursorType === 'view' && (
                            <motion.div key="view" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                                <Eye className={theme === 'dark' ? 'text-black' : 'text-white'} size={24} />
                            </motion.div>
                        )}
                        {cursorType === 'play' && (
                            <motion.div key="play" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                                <Play className={`${theme === 'dark' ? 'text-black' : 'text-white'} fill-current`} size={24} />
                            </motion.div>
                        )}
                        {cursorType === 'plus' && (
                            <motion.div key="plus" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                                <Plus className={theme === 'dark' ? 'text-black' : 'text-white'} size= {32} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* 内部ドット: 最小限の存在感 */}
            <div 
                ref={dotRef}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ 
                    opacity: isVisible 
                        ? (cursorType === 'text' ? (isMoving ? 1 : 0) : 1) 
                        : 0,
                    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <motion.div 
                    className="w-1 h-1 bg-current rounded-full"
                    style={{ 
                        backgroundColor: theme === 'dark' ? 'white' : 'black',
                        mixBlendMode: 'difference' 
                    }}
                    animate={{ 
                        scale: (cursorType === 'default' || cursorType === 'link') ? 1 : 0,
                        opacity: (cursorType === 'view' || cursorType === 'play' || cursorType === 'text') ? 0 : 1
                    }}
                />
            </div>
        </div>
    )
}
