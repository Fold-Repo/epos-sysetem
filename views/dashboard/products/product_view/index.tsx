import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect } from 'react'
import ProductTable from './ProductTable'
import { ProductType } from '@/types'
import { useRouter } from 'next/navigation'
import { useGetProducts, useDeleteProduct } from '@/services'
import { useQueryParams } from '@/hooks'

interface ProductsListViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductsListView = ({ onAddClick }: ProductsListViewProps) => {
    const router = useRouter()
    const { searchParams, updateQueryParams } = useQueryParams()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteProductId, setDeleteProductId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 12
    
    const { data, isLoading } = useGetProducts(currentPage, LIMIT)
    const products = data?.products || []
    const pagination = data?.pagination
    const deleteProductMutation = useDeleteProduct()
    
    const handlePageChange = (page: number) => {
        updateQueryParams({ page: page.toString() })
    }

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                router.push('/dashboard/products/create')
            })
        }
    }, [onAddClick, router])

    const handleView = (productId: string) => {
        router.push(`/dashboard/products/${productId}`)
    }

    const handleEdit = (productId: string) => {
        router.push(`/dashboard/products/${productId}/edit`)
    }

    const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([])

    const handleBulkDelete = () => {
        if (selectedProducts.length > 0) {
            setIsBulkDelete(true)
            setDeleteProductId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDeleteProduct = (productId: string) => {
        setDeleteProductId(productId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedProducts.length > 0) {
            // ===========================
            // Bulk delete products
            // ===========================
            // TODO: Implement bulk delete if backend supports it
            // For now, delete one by one
            for (const product of selectedProducts) {
                await deleteProductMutation.mutateAsync(Number(product.id))
            }
            setSelectedProducts([])
            onDeleteModalClose()
        } else if (deleteProductId) {
            // ===========================
            // Delete single product
            // ===========================
            deleteProductMutation.mutate(Number(deleteProductId), {
                onSuccess: () => {
                    onDeleteModalClose()
                    setDeleteProductId(undefined)
                }
            })
        }
    }

    const filterItems = [
        ...(selectedProducts.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Electronics', key: 'electronics' },
                { label: 'Clothing', key: 'clothing' },
                { label: 'Food & Beverages', key: 'food_beverages' },
                { label: 'Home & Garden', key: 'home_garden' },
                { label: 'Sports', key: 'sports' },
                { label: 'Books', key: 'books' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Brand: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Brand A', key: 'brand_a' },
                { label: 'Brand B', key: 'brand_b' },
                { label: 'Brand C', key: 'brand_c' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Brand changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Stock Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'In Stock', key: 'in_stock' },
                { label: 'Out of Stock', key: 'out_of_stock' },
                { label: 'Low Stock', key: 'low_stock' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Stock status changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Package: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Single', key: 'single' },
                { label: 'Pack', key: 'pack' },
                { label: 'Box', key: 'box' },
                { label: 'Case', key: 'case' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Package changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Sort By: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'Name (A-Z)', key: 'name_asc' },
                { label: 'Name (Z-A)', key: 'name_desc' },
                { label: 'Price (Low to High)', key: 'price_asc' },
                { label: 'Price (High to Low)', key: 'price_desc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' },
                { label: 'Stock (High to Low)', key: 'stock_desc' },
                { label: 'Stock (Low to High)', key: 'stock_asc' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Sort changed:', key)
            }
        }
    ]

    return (
        <>

            {/* ================= FILTER BAR ================= */}
            <FilterBar
                searchInput={{
                    placeholder: 'Search by name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
            />

            {/* ================= TABLE ================= */}
            <ProductTable
                data={products}
                selectedProducts={selectedProducts}
                onSelectionChange={setSelectedProducts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
                isLoading={isLoading}
            />

            {pagination && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={pagination.total}
                    itemsPerPage={LIMIT}
                    onPageChange={handlePageChange}
                    showingText="Products"
                />
            )}

            <DeleteModal
                title={isBulkDelete ? `products (${selectedProducts.length})` : "product"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default ProductsListView