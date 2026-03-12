import { supabaseAdmin } from '@/lib/supabase-admin'
import { WorkReorderList } from '@/components/admin/WorkReorderList'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
    const { data: works } = await supabaseAdmin
        .from('works')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-4xl mx-auto">
            <WorkReorderList initialWorks={works || []} />
        </div>
    )
}
