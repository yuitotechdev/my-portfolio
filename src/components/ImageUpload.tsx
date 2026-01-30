import { useState } from 'react'
import { uploadImageAction } from '@/app/actions/upload'

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
                return // User cancelled selection
            }

            const file = event.target.files[0]

            // Basic validation
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('File size must be less than 2MB')
            }

            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', bucket)

            // Server Action Call
            const publicUrl = await uploadImageAction(formData)

            setPreview(publicUrl)
            onUpload(publicUrl)
        } catch (err) {
            console.error(err)
            const message = err instanceof Error ? err.message : 'Upload failed'
            setError(message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {preview ? (
                    <div className="relative w-32 h-32 rounded overflow-hidden bg-gray-100 border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 border rounded text-gray-400">
                        No Image
                    </div>
                )}

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                    <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        id="file_input"
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <p className="mt-1 text-sm text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                    {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
            </div>
        </div>
    )
}
