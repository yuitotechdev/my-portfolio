import { ProductsRepository } from '@/lib/repositories/products'
import { ProductForm } from '../_components/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await ProductsRepository.getById(id)

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <ProductForm product={product} />
        </div>
    )
}
