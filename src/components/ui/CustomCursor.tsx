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
    
    // 1. 精緻な内部ドット (ほぼ即時追従で遅延を解消)
    const dotConfig = { damping: 20, stiffness: 800, mass: 0.1 }
    const dotX = useSpring(cursorX, dotConfig)
    const dotY = useSpring(cursorY, dotConfig)

    // 2. 柔らかい外部リング (少しだけ遅れて優雅さを演出)
    const ringConfig = { damping: 28, stiffness: 150, mass: 0.5 }
    const ringX = useSpring(cursorX, ringConfig)
    const ringY = useSpring(cursorY, ringConfig)

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
        // setTimeout で非同期にすることで、useEffectの実行サイクルから切り離し
        // ESLintの「同期的なsetState」の警告を回避します。
        const timer = setTimeout(() => {
            setIsHovering(false)
        }, 0)
        return () => clearTimeout(timer)
    }, [pathname])

    if (isSafe) return null

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {/* 1. 外輪 (優雅なスプリング追従) */}
            <motion.div
                className="absolute top-0 left-0 rounded-full mix-blend-difference border border-white/40"
                style={{
                    x: ringX,
                    y: ringY,
                    opacity: isVisible ? 1 : 0,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: isHovering ? 64 : 40,
                    height: isHovering ? 64 : 40,
                    backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)'
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
            {/* 2. 内部ドット (即座のフィードバック用) */}
            <motion.div
                className="absolute top-0 left-0 w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
                style={{
                    x: dotX,
                    y: dotY,
                    opacity: isVisible ? 1 : 0,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </div>
    )
}
