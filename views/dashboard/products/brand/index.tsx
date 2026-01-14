'use client'

import { FilterBar, Pagination, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect, useMemo } from 'react'
import BrandTable from './BrandTable'
import { Brand } from '@/types/brand.type'
import AddBrandModal from './AddBrandModal'
import { useGetBrands, useDeleteBrand } from '@/services'
import { useQueryParams } from '@/hooks'

interface ProductBrandViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductBrandView = ({ onAddClick }: ProductBrandViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteBrandId, setDeleteBrandId] = useState<number | undefined>(undefined)
    const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 20
    const { data: brands, pagination, isLoading } = useGetBrands(currentPage, LIMIT)
    const deleteBrandMutation = useDeleteBrand()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingBrand(undefined)
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    // ==============================
    // Filtered brands
    // ==============================
    const filteredBrands = useMemo(() => {
        if (!searchValue.trim()) return brands
        
        const searchLower = searchValue.toLowerCase()
        return brands.filter(brand => 
            brand.name.toLowerCase().includes(searchLower) ||
            brand.short_name.toLowerCase().includes(searchLower)
        )
    }, [brands, searchValue])

    const handleDeleteBrand = (brandId: number) => {
        setDeleteBrandId(brandId)
        onDeleteModalOpen()
    }

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand)
        onAddModalOpen()
    }

    const confirmDelete = async () => {
        if (deleteBrandId) {
            return new Promise<void>((resolve) => {
                deleteBrandMutation.mutate(deleteBrandId, {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteBrandId(undefined)
                        resolve()
                    },
                    onError: () => {
                        resolve()
                    }
                })
            })
        }
    }

    return (
        <>
            {/* ================= FILTER BAR ================= */}
            <FilterBar
                searchInput={{
                    placeholder: 'Search by brand name or short name',
                    className: 'w-full md:w-72',
                    onSearch: (value) => setSearchValue(value)
                }}
            />

            {/* ================= TABLE ================= */}
            <BrandTable
                data={filteredBrands}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteBrand}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={pagination?.total || 0}
                itemsPerPage={LIMIT}
                onPageChange={(page) => {
                    updateQueryParams({ page: page.toString() })
                }}
                showingText="Brands"
            />

            <AddBrandModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setEditingBrand(undefined)
                    onAddModalClose()
                }}
                initialData={editingBrand}
            />

            <DeleteModal
                title="brand"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteBrandId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductBrandView
