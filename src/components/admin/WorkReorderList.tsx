'use client'

import { deleteWork, updateWorkOrder } from '@/app/actions/works'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Edit, Eye, EyeOff, GripVertical, Save } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface Work {
    id: string
    title: string
    slug: string
    thumbnail_url?: string
    is_public: boolean
    order?: number
}

interface Props {
    initialWorks: Work[]
}

export function WorkReorderList({ initialWorks }: Props) {
    const [works, setWorks] = useState(initialWorks)
    const [isPending, startTransition] = useTransition()
    const [hasChanges, setHasChanges] = useState(false)

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return
        }

        const items = Array.from(works)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setWorks(items)
        setHasChanges(true)
    }

    const handleSaveOrder = async () => {
        startTransition(async () => {
            try {
                const result = await updateWorkOrder(
                    works.map((work, index) => ({
                        id: work.id,
                        order: index
                    }))
                )

                if (result?.error) {
                    throw new Error(result.error)
                }

                setWorks((current) => current.map((work, index) => ({ ...work, order: index })))
                toast.success('並び順を保存しました')
                setHasChanges(false)
            } catch {
                toast.error('並び順の保存に失敗しました')
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black tracking-tight">制作実績の管理</h2>
                    {hasChanges && (
                        <Button
                            size="sm"
                            onClick={handleSaveOrder}
                            disabled={isPending}
                            className="rounded-full bg-indigo-600 px-6 text-white hover:bg-indigo-700"
                        >
                            {isPending ? '保存中...' : <><Save className="mr-2 h-4 w-4" />並び順を保存</>}
                        </Button>
                    )}
                </div>
                <Button asChild className="rounded-full bg-zinc-900 px-6 font-bold text-white dark:bg-white dark:text-black">
                    <Link href="/admin/works/new">制作実績を追加</Link>
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="works">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {works.map((work, index) => (
                                <Draggable key={work.id} draggableId={work.id} index={index}>
                                    {(draggableProvided, snapshot) => (
                                        <div
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            className={`flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow dark:border-zinc-800 dark:bg-zinc-900 ${
                                                snapshot.isDragging ? 'border-indigo-500 shadow-2xl' : ''
                                            }`}
                                        >
                                            <div
                                                {...draggableProvided.dragHandleProps}
                                                className="text-zinc-400 transition-colors hover:text-zinc-600"
                                            >
                                                <GripVertical size={20} />
                                            </div>

                                            <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                                {work.thumbnail_url ? (
                                                    <Image src={work.thumbnail_url} alt={work.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[8px] font-bold uppercase text-zinc-400">
                                                        画像なし
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="truncate font-bold text-zinc-900 dark:text-zinc-100">{work.title}</h3>
                                                    {work.is_public ? (
                                                        <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-emerald-500">
                                                            <Eye size={8} />
                                                            公開中
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 rounded bg-zinc-400/10 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-zinc-400">
                                                            <EyeOff size={8} />
                                                            下書き
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="truncate font-mono text-[10px] text-zinc-400">/works/{work.slug}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" asChild>
                                                    <Link href={`/admin/works/${work.id}`}>
                                                        <Edit size={16} />
                                                    </Link>
                                                </Button>
                                                <DeleteButton id={work.id} title={work.title} deleteAction={deleteWork} />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
