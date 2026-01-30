import { ProductForm } from '../_components/ProductForm'

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
            <ProductForm />
        </div>
    )
}
