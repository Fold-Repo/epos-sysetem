import ProductDetailsView from '@/views/dashboard/products/product_view/ProductDetailsView'

interface ProductDetailsPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params
    return <ProductDetailsView productId={id} />
}

