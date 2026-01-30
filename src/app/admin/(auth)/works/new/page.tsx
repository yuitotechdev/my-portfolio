import { createWork } from '@/app/actions/works'
import EditWorkForm from '../_components/EditWorkForm'

export default function NewWorkPage() {
    return (
        <div className="h-full">
            <EditWorkForm action={createWork} />
        </div>
    )
}
