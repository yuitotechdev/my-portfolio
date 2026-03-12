import { updateProduct } from '@/app/actions/products'
import { ProductsRepository } from '@/lib/repositories/products'
import { notFound } from 'next/navigation'
import { ProductForm } from '../_components/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await ProductsRepository.getById(id)

    if (!product) {
        notFound()
    }

    const updateAction = updateProduct.bind(null, product.id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">プロダクトを編集</h1>
            <ProductForm product={product} action={updateAction} />
        </div>
    )
}
