'use client'

import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect } from 'react'
import BrandTable from './BrandTable'
import { brandsData } from './data'
import { ProductBrandType } from '@/types/brand.type'
import AddBrandModal from './AddBrandModal'

interface ProductBrandViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductBrandView = ({ onAddClick }: ProductBrandViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteBrandId, setDeleteBrandId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    const [selectedBrands, setSelectedBrands] = useState<ProductBrandType[]>([])

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    const handleBulkDelete = () => {
        if (selectedBrands.length > 0) {
            setIsBulkDelete(true)
            setDeleteBrandId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDeleteBrand = (brandId: string) => {
        setDeleteBrandId(brandId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedBrands.length > 0) {
            // ===========================
            // Delete brands logic here
            // ===========================
            console.log('Delete brands:', selectedBrands.map(b => b.id))
            // await deleteBrands(selectedBrands.map(b => b.id))
            setSelectedBrands([])
        } else if (deleteBrandId) {
            // ===========================
            // Delete brand logic here
            // ===========================
            console.log('Delete brand with id:', deleteBrandId)
            // await deleteBrand(deleteBrandId)
        }
        onDeleteModalClose()
    }

    const filterItems = [
        ...(selectedBrands.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Active', key: 'active' },
                { label: 'Inactive', key: 'inactive' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Status changed:', key)
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
                { label: 'Product Count (High to Low)', key: 'count_desc' },
                { label: 'Product Count (Low to High)', key: 'count_asc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
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
                    placeholder: 'Search by brand name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
            />

            {/* ================= TABLE ================= */}
            <BrandTable
                data={brandsData}
                selectedBrands={selectedBrands}
                onSelectionChange={setSelectedBrands}
                onDelete={handleDeleteBrand}
            />

            <Pagination
                currentPage={1}
                totalItems={100}
                itemsPerPage={25}
                onPageChange={() => { }}
                showingText="Brands"
            />

            <AddBrandModal isOpen={isAddModalOpen} onClose={onAddModalClose} />

            <DeleteModal
                title={isBulkDelete ? `brands (${selectedBrands.length})` : "brand"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductBrandView
