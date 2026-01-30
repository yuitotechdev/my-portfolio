import { deleteDevice } from '@/app/actions/devices'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table'
import { DevicesRepository } from '@/lib/repositories/devices'
import { Edit, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDevicesPage() {
    const devices = await DevicesRepository.getAllAdmin()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
                <Button asChild>
                    <Link href="/admin/devices/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Device
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Devices</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell className="font-mono text-gray-500">{device.order}</TableCell>
                                    <TableCell className="font-medium text-indigo-600">{device.category}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{device.name}</div>
                                        {device.link_url && (
                                            <a href={device.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-indigo-500 flex items-center gap-1">
                                                Link <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {device.is_public ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                                Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                                Draft
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/devices/${device.id}`}>
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <DeleteButton id={device.id} title={device.name} deleteAction={deleteDevice} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {devices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No devices found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
