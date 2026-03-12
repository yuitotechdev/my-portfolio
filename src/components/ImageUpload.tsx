'use client'

import { uploadCompressedImage } from '@/lib/client-image-upload'
import { useState } from 'react'

interface ImageUploadProps {
    bucket: string
    onUpload: (url: string) => void
    initialUrl?: string
}

export default function ImageUpload({ bucket, onUpload, initialUrl }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(initialUrl || null)
    const [error, setError] = useState<string | null>(null)

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            setError(null)

            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const rawFile = event.target.files[0]
            const publicUrl = await uploadCompressedImage(rawFile, bucket)
            setPreview(publicUrl)
            onUpload(publicUrl)
        } catch (err) {
            console.error(err)
            const message = err instanceof Error ? err.message : '画像のアップロードに失敗しました'
            setError(message)
        } finally {
            setUploading(false)
            event.target.value = ''
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {preview ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded border bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="アップロード画像のプレビュー"
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded border bg-gray-100 text-sm text-gray-400">
                        画像なし
                    </div>
                )}

                <div className="flex-1">
                    <label
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="file_input"
                    >
                        画像をアップロード
                    </label>
                    <input
                        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                        id="file_input"
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        アップロード時に自動で圧縮されます。JPEG形式に変換し、長辺1600px以内に調整します。
                    </p>
                    {uploading && <p className="mt-1 text-sm text-blue-500">アップロード中...</p>}
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    )
}
