import EditProductView from '@/views/dashboard/products/edit'

interface EditProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params
    return <EditProductView productId={id} />
}

