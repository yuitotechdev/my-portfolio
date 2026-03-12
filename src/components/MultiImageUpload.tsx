'use client'

import { uploadCompressedImage } from '@/lib/client-image-upload'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface MultiImageUploadProps {
    bucket: string
    value: string[]
    onChange: (urls: string[]) => void
}

export default function MultiImageUpload({ bucket, value, onChange }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files || files.length === 0) {
            return
        }

        try {
            setUploading(true)
            setError(null)

            const uploadedUrls: string[] = []
            for (const file of Array.from(files)) {
                const url = await uploadCompressedImage(file, bucket)
                uploadedUrls.push(url)
            }

            onChange([...value, ...uploadedUrls])
            event.target.value = ''
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : '画像のアップロードに失敗しました')
        } finally {
            setUploading(false)
        }
    }

    function handleRemove(index: number) {
        onChange(value.filter((_, currentIndex) => currentIndex !== index))
    }

    return (
        <div className="space-y-4">
            <label className="block">
                <span className="text-sm font-medium text-gray-900">機能紹介用の画像を追加</span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    disabled={uploading}
                    className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                />
            </label>

            <p className="text-xs text-gray-500">
                アップロード時に自動で圧縮されます。JPEG形式に変換し、長辺1600px以内に調整します。
            </p>

            {uploading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    画像をアップロードしています...
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            {value.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {value.map((url, index) => (
                        <div key={`${url}-${index}`} className="rounded-xl border bg-white p-3 shadow-sm">
                            <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`スクリーンショット ${index + 1}`} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="truncate text-xs text-gray-500">画像 {index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    削除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
