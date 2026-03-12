'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TextareaAutosize from 'react-textarea-autosize'

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    label?: string
    name?: string
    required?: boolean
}

export function MarkdownEditor({
    value,
    onChange,
    label = '本文',
    name,
    required
}: MarkdownEditorProps) {
    const [tab, setTab] = useState<'write' | 'preview'>('write')

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex rounded-lg bg-gray-100 p-1 text-sm">
                    <button
                        type="button"
                        onClick={() => setTab('write')}
                        className={`px-3 py-1 rounded-md transition-colors ${
                            tab === 'write' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        編集
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('preview')}
                        className={`px-3 py-1 rounded-md transition-colors ${
                            tab === 'preview' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        プレビュー
                    </button>
                </div>
            </div>

            <div className="min-h-[400px] overflow-hidden rounded-lg border border-gray-200 bg-white">
                {tab === 'write' ? (
                    <TextareaAutosize
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-h-[400px] w-full resize-none p-4 font-mono text-sm leading-relaxed focus:outline-none"
                        placeholder="Markdownで入力してください"
                        required={required}
                    />
                ) : (
                    <div className="prose prose-sm min-h-[400px] max-w-none bg-gray-50 p-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {value}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
            <p className="text-right text-xs text-gray-500">
                Markdown対応。表、箇条書き、コードブロックも使えます。
            </p>
        </div>
    )
}
