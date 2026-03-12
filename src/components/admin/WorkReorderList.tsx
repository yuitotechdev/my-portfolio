'use client'

import React, { useState, useTransition } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { GripVertical, Edit, Trash2, Eye, EyeOff, Save } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteWork } from '@/app/actions/works'
import { DeleteButton } from '@/components/admin/DeleteButton'

interface Work {
    id: string
    title: string
    slug: string
    thumbnail_url?: string
    is_public: boolean
    sort_order?: number
}

interface Props {
    initialWorks: Work[]
}

export function WorkReorderList({ initialWorks }: Props) {
    const [works, setWorks] = useState(initialWorks)
    const [isPending, startTransition] = useTransition()
    const [hasChanges, setHasChanges] = useState(false)

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(works)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setWorks(items)
        setHasChanges(true)
    }

    const handleSaveOrder = async () => {
        startTransition(async () => {
            try {
                // Here we would call a server action to save the new order
                // For now, let's toast success
                toast.success('並び順を保存しました（モック）')
                setHasChanges(false)
            } catch (error) {
                toast.error('保存に失敗しました')
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black tracking-tight uppercase">Works Management</h2>
                    {hasChanges && (
                        <Button 
                            size="sm" 
                            onClick={handleSaveOrder} 
                            disabled={isPending}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                        >
                            {isPending ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Order</>}
                        </Button>
                    )}
                </div>
                <Button asChild className="rounded-full font-bold px-6 bg-zinc-900 dark:bg-white text-white dark:text-black">
                    <Link href="/admin/works/new">実績を追加</Link>
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="works">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {works.map((work, index) => (
                                <Draggable key={work.id} draggableId={work.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`
                                                flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm
                                                transition-shadow ${snapshot.isDragging ? 'shadow-2xl border-indigo-500' : ''}
                                            `}
                                        >
                                            <div {...provided.dragHandleProps} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                                                <GripVertical size={20} />
                                            </div>

                                            <div className="relative w-20 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                                {work.thumbnail_url ? (
                                                    <Image src={work.thumbnail_url} alt={work.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400 font-bold uppercase">No Image</div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{work.title}</h3>
                                                    {work.is_public ? (
                                                        <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                            <Eye size={8} /> LIVE
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-400/10 px-1.5 py-0.5 rounded">
                                                            <EyeOff size={8} /> DRAFT
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-zinc-400 truncate font-mono">/{work.slug}</p>
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
