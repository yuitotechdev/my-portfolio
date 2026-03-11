'use client'

import { useState, useEffect, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'

interface ScrambleTextProps {
    text: string
    className?: string
    scrambleOnMount?: boolean
    scrambleOnHover?: boolean
}

// スクランブルに使う記号群（Awwwards受賞サイトでよく使われるサイバー風）
const CHARS = '!<>-_\\\\/[]{}—=+*^?#________'

export function ScrambleText({ 
    text, 
    className = "", 
    scrambleOnMount = true, 
    scrambleOnHover = true 
}: ScrambleTextProps) {
    const { preference } = useMotion()
    const isSafe = preference === 'safe' || preference === 'minimal'

    const [displayText, setDisplayText] = useState(isSafe ? text : '')
    const [isScrambling, setIsScrambling] = useState(false)
    const frameRef = useRef<number>(0)
    const queueRef = useRef<{ from: string, to: string, start: number, end: number, char?: string }[]>([])

    const scramble = () => {
        if (isSafe || isScrambling) return
        setIsScrambling(true)

        let frame = 0
        const queue: { from: string, to: string, start: number, end: number, char?: string }[] = []
        
        // 元の文字ごとにランダムなタイミングでデコードを開始・終了する
        for (let i = 0; i < text.length; i++) {
            const from = displayText[i] || ''
            const to = text[i]
            const start = Math.floor(Math.random() * 20)
            const end = start + Math.floor(Math.random() * 20)
            queue.push({ from, to, start, end })
        }
        
        queueRef.current = queue

        const update = () => {
            let pureOutput = ''
            let completeCount = 0
            
            for (let i = 0, n = queueRef.current.length; i < n; i++) {
                const { from, to, start, end } = queueRef.current[i]
                let { char } = queueRef.current[i]
                
                if (frame >= end) {
                    completeCount++
                    pureOutput += to
                } else if (frame >= start) {
                    // アニメーション中の文字はランダムに切り替える
                    if (!char || Math.random() < 0.28) {
                        char = CHARS[Math.floor(Math.random() * CHARS.length)]
                        queueRef.current[i].char = char
                    }
                    pureOutput += char
                } else {
                    pureOutput += from
                }
            }
            
            setDisplayText(pureOutput)
            
            if (completeCount === queueRef.current.length) {
                cancelAnimationFrame(frameRef.current)
                setIsScrambling(false)
            } else {
                frame++
                frameRef.current = requestAnimationFrame(update)
            }
        }
        
        frameRef.current = requestAnimationFrame(update)
    }

    useEffect(() => {
        if (scrambleOnMount && !isSafe) {
            scramble()
        } else if (!isSafe && displayText === '') {
             setDisplayText(text)
        }
        return () => cancelAnimationFrame(frameRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <span 
            className={`inline-block whitespace-pre-wrap ${className}`}
            onMouseEnter={scrambleOnHover ? scramble : undefined}
        >
            {isSafe ? text : displayText}
        </span>
    )
}
