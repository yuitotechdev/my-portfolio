'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
    id: string
    title: string
    deleteAction: (id: string) => Promise<{ error?: string } | void | undefined>
}

export function DeleteButton({ id, title, deleteAction }: DeleteButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const result = await deleteAction(id)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(`${title} を削除しました`)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast.error('削除に失敗しました')
        } finally {
            setIsDeleting(false)
            setIsModalOpen(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-red-600 hover:text-red-900 font-medium"
            >
                削除
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`「${title}」を削除しますか？`}
                description="この操作は取り消せません。サーバーからこの項目が永久に削除されます。"
                variant="destructive"
            >
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting ? '削除中...' : '削除'}
                    </button>
                </div>
            </Modal>
        </>
    )
}
