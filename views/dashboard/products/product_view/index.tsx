import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect } from 'react'
import ProductTable from './ProductTable'
import { productsData } from './data'
import { ProductType } from '@/types'
import AddProductModal from './AddProductModal'
import ViewProductModal from './ViewProductModal'

interface ProductsListViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductsListView = ({ onAddClick }: ProductsListViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [viewProductId, setViewProductId] = useState<string | undefined>(undefined)
    const [deleteProductId, setDeleteProductId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    const handleView = (productId: string) => {
        setViewProductId(productId)
        onViewModalOpen()
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
            // Delete products logic here
            // ===========================
            // await deleteProducts(selectedProducts.map(p => p.id))
            setSelectedProducts([])
        } else if (deleteProductId) {
            console.log('Delete product with id:', deleteProductId)
            // ===========================
            // Delete product logic here
            // ===========================
            // await deleteProduct(deleteProductId)
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
                data={productsData}
                selectedProducts={selectedProducts}
                onSelectionChange={setSelectedProducts}
                onView={handleView}
                onDelete={handleDeleteProduct}
            />

            <Pagination
                currentPage={1}
                totalItems={100}
                itemsPerPage={25}
                onPageChange={() => { }}
                showingText="Products"
            />

            <AddProductModal isOpen={isAddModalOpen} onClose={onAddModalClose} />
            
            <ViewProductModal isOpen={isViewModalOpen} onClose={onViewModalClose} productId={viewProductId} />

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