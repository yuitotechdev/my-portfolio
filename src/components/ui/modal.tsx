'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    variant?: 'default' | 'destructive'
}

export function Modal({ isOpen, onClose, title, description, children, variant = 'default' }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen) {
            if (!dialog.open) dialog.showModal()
        } else {
            if (dialog.open) dialog.close()
        }
    }, [isOpen])

    // Handle ESC key or click outside default behavior of dialog is good, but custom handling ensures state sync
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === dialogRef.current) onClose()
    }

    return (
        <dialog
            ref={dialogRef}
            className={cn(
                "backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 rounded-lg shadow-xl w-full max-w-md bg-white text-gray-900 open:animate-in open:fade-in open:zoom-in-95 backdrop:animate-in backdrop:fade-in",
                variant === 'destructive' && "border-red-500 border-2"
            )}
            onClose={onClose}
            onKeyDown={handleKeyDown}
            onClick={handleBackdropClick}
        >
            <div className="p-6">
                <h2 className={cn("text-xl font-bold mb-2", variant === 'destructive' && "text-red-600")}>{title}</h2>
                {description && <p className="text-sm text-gray-500 mb-6">{description}</p>}
                <div>{children}</div>
            </div>
        </dialog>
    )
}
