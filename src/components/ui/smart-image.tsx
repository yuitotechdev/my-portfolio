'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { MOTION } from '@/config/motion'

interface SmartImageProps extends ImageProps {
    containerClassName?: string
}

export function SmartImage({
    src,
    alt,
    className,
    containerClassName,
    onLoad,
    ...props
}: SmartImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)

    return (
        <div className={cn("relative overflow-hidden bg-gray-100", containerClassName)}>
            <AnimatePresence>
                {!isLoaded && !isError && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={MOTION.fade}
                        className="absolute inset-0 z-10"
                    >
                        <Skeleton className="w-full h-full rounded-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            <Image
                src={src}
                alt={alt}
                className={cn(
                    "transition-opacity duration-500",
                    isLoaded ? "opacity-100" : "opacity-0",
                    className
                )}
                onLoad={(e) => {
                    setIsLoaded(true)
                    if (onLoad) onLoad(e)
                }}
                onError={() => setIsError(true)}
                {...props}
            />
        </div>
    )
}
