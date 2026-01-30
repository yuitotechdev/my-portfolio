import { DevicesRepository } from '@/lib/repositories/devices'
import { DeviceForm } from '../_components/DeviceForm'
import { notFound } from 'next/navigation'

export default async function EditDevicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const device = await DevicesRepository.getById(id)

    if (!device) notFound()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Device</h1>
            <DeviceForm device={device} />
        </div>
    )
}
