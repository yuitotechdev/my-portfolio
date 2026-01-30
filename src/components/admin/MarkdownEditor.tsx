'use client'

import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    label?: string
    name?: string
    required?: boolean
}

export function MarkdownEditor({ value, onChange, label = "Content", name, required }: MarkdownEditorProps) {
    const [tab, setTab] = useState<'write' | 'preview'>('write')

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
                    <button
                        type="button"
                        onClick={() => setTab('write')}
                        className={`px-3 py-1 rounded-md transition-colors ${tab === 'write' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('preview')}
                        className={`px-3 py-1 rounded-md transition-colors ${tab === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Preview
                    </button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden min-h-[400px] bg-white">
                {tab === 'write' ? (
                    <TextareaAutosize
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full p-4 focus:outline-none min-h-[400px] font-mono text-sm leading-relaxed resize-none"
                        placeholder="Write in Markdown..."
                        required={required}
                    />
                ) : (
                    <div className="prose prose-sm max-w-none p-6 bg-gray-50 min-h-[400px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {value}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 text-right">
                Markdown supported. tables, lists, code blocks enabled.
            </p>
        </div>
    )
}
