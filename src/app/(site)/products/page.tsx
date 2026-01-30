import { ProductsRepository } from '@/lib/repositories/products'
import { Reveal, StaggerList } from '@/components/ui/motion'
import { ExternalLink, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
    title: 'Products - Portfolio',
    description: 'Digital products and resources.',
}

export default async function ProductsPage() {
    const products = await ProductsRepository.getAllPublic()

    return (
        <main className="min-h-screen py-24 px-6 md:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <Reveal>
                    <header className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Products</h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            Tools, templates, and resources I&apos;ve built.
                        </p>
                    </header>
                </Reveal>

                {products.length > 0 ? (
                    <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <a
                                key={product.id}
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    {product.thumbnail_url ? (
                                        <Image
                                            src={product.thumbnail_url}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                                            <ShoppingBag className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    {product.price_display && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm text-gray-900">
                                            {product.price_display}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 flex items-center gap-2">
                                        {product.title}
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                                    </h2>
                                    {product.description && (
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                            </a>
                        ))}
                    </StaggerList>
                ) : (
                    <Reveal delay={0.2}>
                        <div className="py-24 text-center text-gray-400">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No products available yet.</p>
                        </div>
                    </Reveal>
                )}
            </div>
        </main>
    )
}
