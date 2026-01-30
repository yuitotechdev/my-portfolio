'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export function CopyButton({ text, label = 'Copy' }: { text: string, label?: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success('Copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Failed to copy')
        }
    }

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            className="flex items-center gap-2"
        >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : label}
        </Button>
    )
}
