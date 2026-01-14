import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect, useMemo } from 'react'
import ProductTable from './ProductTable'
import { ProductType } from '@/types'
import { useRouter } from 'next/navigation'
import { useGetProducts, useDeleteProduct, ProductQueryParams } from '@/services'
import { useQueryParams } from '@/hooks'
import { useAppSelector, selectCategories, selectBrands } from '@/store'

// ================================
// CONSTANTS
// ================================
const LIMIT = 20

const SORT_OPTIONS = [
    { label: 'Default', key: '' },
    { label: 'Name (A-Z)', key: 'name_asc' },
    { label: 'Name (Z-A)', key: 'name_desc' },
    { label: 'Price (Low to High)', key: 'price_asc' },
    { label: 'Price (High to Low)', key: 'price_desc' },
    { label: 'Newest First', key: 'newest' },
    { label: 'Oldest First', key: 'oldest' },
    { label: 'Stock (High to Low)', key: 'stock_desc' },
    { label: 'Stock (Low to High)', key: 'stock_asc' }
]

const STOCK_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Low Stock', key: 'low' },
]

interface ProductsListViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductsListView = ({ onAddClick }: ProductsListViewProps) => {
    
    const router = useRouter()
    const { searchParams, updateQueryParams } = useQueryParams()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteProductId, setDeleteProductId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    
    // ================================
    // GET CATEGORIES AND BRANDS FROM STATE
    // ================================
    const categories = useAppSelector(selectCategories)
    const brands = useAppSelector(selectBrands)
    
    // ================================
    // GET QUERY PARAMS FROM URL
    // ================================
    const queryParams: ProductQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        sort: searchParams.get('sort') || undefined,
        search: searchParams.get('search') || undefined,
        category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
        brand_id: searchParams.get('brand_id') ? Number(searchParams.get('brand_id')) : undefined,
        stock: searchParams.get('stock') || undefined
    }
    
    // ================================
    // FETCH PRODUCTS
    // ================================
    const { data, isLoading } = useGetProducts(queryParams)
    const products = data?.products || []
    const pagination = data?.pagination
    const deleteProductMutation = useDeleteProduct()
    
    // ================================
    // BUILD CATEGORY OPTIONS
    // ================================
    const categoryOptions = useMemo(() => {
        const options = [{ label: 'All', key: 'all' }]
        categories.forEach(cat => {
            options.push({ label: cat.category_name, key: String(cat.category_id) })
        })
        return options
    }, [categories])
    
    // ================================
    // BUILD BRAND OPTIONS
    // ================================
    const brandOptions = useMemo(() => {
        const options = [{ label: 'All', key: 'all' }]
        brands.forEach(brand => {
            options.push({ label: brand.name, key: String(brand.id) })
        })
        return options
    }, [brands])
    
    const handlePageChange = (page: number) => {
        updateQueryParams({ page })
    }

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                router.push('/dashboard/products/create')
            })
        }
    }, [onAddClick, router])
    
    // ================================
    // GET LABEL HELPERS
    // ================================
    const getCategoryLabel = () => {
        const categoryId = searchParams.get('category_id')
        if (!categoryId || categoryId === 'all') return 'Category: All'
        const category = categories.find(c => String(c.category_id) === categoryId)
        return category ? `Category: ${category.category_name}` : 'Category: All'
    }
    
    const getBrandLabel = () => {
        const brandId = searchParams.get('brand_id')
        if (!brandId || brandId === 'all') return 'Brand: All'
        const brand = brands.find(b => String(b.id) === brandId)
        return brand ? `Brand: ${brand.name}` : 'Brand: All'
    }
    
    const getStockLabel = () => {
        const stock = searchParams.get('stock')
        const current = STOCK_OPTIONS.find(o => o.key === stock)
        return current ? `Stock: ${current.label}` : 'Stock: All'
    }
    
    const getSortLabel = () => {
        const sort = searchParams.get('sort')
        const current = SORT_OPTIONS.find(o => o.key === sort)
        return current ? `Sort: ${current.label}` : 'Sort By'
    }

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

    // ================================
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
        ...(selectedProducts.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: getCategoryLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: categoryOptions,
            value: searchParams.get('category_id') || 'all',
            onChange: (key: string) => {
                updateQueryParams({ 
                    category_id: key === 'all' ? null : key,
                    page: 1
                })
            }
        },
        {
            type: 'dropdown' as const,
            label: getBrandLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: brandOptions,
            value: searchParams.get('brand_id') || 'all',
            onChange: (key: string) => {
                updateQueryParams({ 
                    brand_id: key === 'all' ? null : key,
                    page: 1
                })
            }
        },
        {
            type: 'dropdown' as const,
            label: getStockLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: STOCK_OPTIONS,
            value: searchParams.get('stock') || 'all',
            onChange: (key: string) => {
                updateQueryParams({ 
                    stock: key === 'all' ? null : key,
                    page: 1
                })
            }
        },
        {
            type: 'dropdown' as const,
            label: getSortLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: SORT_OPTIONS,
            value: searchParams.get('sort') || '',
            onChange: (key: string) => {
                updateQueryParams({ 
                    sort: key || null,
                    page: 1
                })
            }
        }
    ]

    return (
        <>

            {/* ================= FILTER BAR ================= */}
            <FilterBar
                searchInput={{
                    placeholder: 'Search by name or SKU',
                    className: 'w-full md:w-72',
                    onSearch: (value: string) => {
                        updateQueryParams({ 
                            search: value || null,
                            page: 1
                        })
                    }
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
                    currentPage={queryParams.page || 1}
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