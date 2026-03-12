import { createDevice } from '@/app/actions/devices'
import { DeviceForm } from '../_components/DeviceForm'

export default function NewDevicePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">デバイスを追加</h1>
            <DeviceForm action={createDevice} />
        </div>
    )
}
