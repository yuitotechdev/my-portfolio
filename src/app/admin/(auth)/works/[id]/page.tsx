import { updateWork } from '@/app/actions/works'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import EditWorkForm from '../_components/EditWorkForm'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditWorkPage({ params }: PageProps) {
    const { id } = await params

    const { data: work } = await supabaseAdmin
        .from('works')
        .select('*')
        .eq('id', id)
        .single()

    if (!work) {
        notFound()
    }

    const updateAction = updateWork.bind(null, work.id)

    return (
        <div className="h-full">
            <EditWorkForm work={work} action={updateAction} />
        </div>
    )
}
