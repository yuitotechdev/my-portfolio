'use client'

import { Reveal } from '@/components/ui/motion'
import { Mail } from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'
import { useState, useEffect } from 'react'
import { PAGE_TITLES } from '@/config/i18n'

export default function ContactPage() {
    const [email, setEmail] = useState('')

    useEffect(() => {
        // Obfuscation to prevent scrapers
        const user = 'yuito.techdev'
        const domain = 'gmail.com'
        // Delay slightly to ensure client mount
        const timer = setTimeout(() => {
            setEmail(`${user}@${domain}`)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 max-w-2xl mx-auto flex flex-col justify-center text-center">
            <Reveal>
                <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                        <Mail className="w-8 h-8 text-foreground" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{PAGE_TITLES.contact}</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    Interested in working together or have a question?
                    <br />
                    Feel free to reach out directly.
                </p>

                <div className="space-y-6">
                    {email ? (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                            <div className="text-2xl font-mono font-medium text-foreground bg-muted/50 px-6 py-3 rounded-xl border border-dashed border-border">
                                {email}
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href={`mailto:${email}`}
                                    className="inline-flex items-center justify-center px-8 py-2.5 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-colors"
                                >
                                    Open Mail App
                                </a>
                                <CopyButton text={email} label="Copy Address" />
                            </div>
                        </div>
                    ) : (
                        <div className="h-24 flex items-center justify-center">
                            <span className="inline-block w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin"></span>
                        </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-8">
                        Response time: Usually within 1-2 business days.
                    </p>
                </div>
            </Reveal>
        </main>
    )
}
