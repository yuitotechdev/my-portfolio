import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import Image from 'next/image'
import { deleteWork } from '@/app/actions/works'
import { DeleteButton } from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
    const { data: works } = await supabaseAdmin
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Works Management</h2>
                <Link
                    href="/admin/works/new"
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                    Add Work
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {works?.map((work) => (
                            <tr key={work.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {work.thumbnail_url && (
                                        <div className="h-10 w-16 relative">
                                            <Image
                                                src={work.thumbnail_url}
                                                alt={work.title}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{work.title}</div>
                                    <div className="text-sm text-gray-500">{work.slug}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${work.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {work.is_public ? 'Public' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4 items-center">
                                    <Link href={`/admin/works/${work.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                    <DeleteButton id={work.id} title={work.title} deleteAction={deleteWork} />
                                </td>
                            </tr>
                        ))}
                        {(!works || works.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    No works found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
