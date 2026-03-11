'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'
import { usePathname } from 'next/navigation'

export function CustomCursor() {
    const { preference } = useMotion()
    const isSafe = preference === 'safe' || preference === 'minimal'
    
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()

    // 初期値を画面外にしておく
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)
    
    // スムーズなスプリング（少し遊びを持たせる）
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
    const x = useSpring(cursorX, springConfig)
    const y = useSpring(cursorY, springConfig)

    useEffect(() => {
        if (isSafe) return

        const updateMousePosition = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }
        
        // リンクやボタンをホバーしたときにカーソルを拡大する
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

        // デフォルトカーソルを隠す
        document.body.classList.add('cursor-none-global')

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('mouseover', updateHoverState)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
            document.body.removeEventListener('mouseenter', handleMouseEnter)
            document.body.classList.remove('cursor-none-global')
        }
    }, [cursorX, cursorY, isSafe, isVisible])

    // ページ遷移時にホバー状態をリセット
    useEffect(() => {
        if (isHovering) {
            setIsHovering(false)
        }
    }, [pathname, isHovering])

    if (isSafe) return null

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center mix-blend-difference"
            style={{
                x,
                y,
                opacity: isVisible ? 1 : 0,
                translateX: '-50%',
                translateY: '-50%',
            }}
            animate={{
                width: isHovering ? 64 : 16,
                height: isHovering ? 64 : 16,
                backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)'
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
        </motion.div>
    )
}
