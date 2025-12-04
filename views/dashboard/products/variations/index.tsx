'use client'

import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect } from 'react'
import VariationsTable from './VariationsTable'
import { variationsData } from './data'
import { ProductVariationType } from '@/types/variation.type'
import AddVariationModal from './AddVariationModal'

interface ProductVariationsViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductVariationsView = ({ onAddClick }: ProductVariationsViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteVariationId, setDeleteVariationId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    const [selectedVariations, setSelectedVariations] = useState<ProductVariationType[]>([])

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    const handleBulkDelete = () => {
        if (selectedVariations.length > 0) {
            setIsBulkDelete(true)
            setDeleteVariationId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDeleteVariation = (variationId: string) => {
        setDeleteVariationId(variationId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedVariations.length > 0) {
            // ===========================
            // Delete variations logic here
            // ===========================
            console.log('Delete variations:', selectedVariations.map(v => v.id))
            // await deleteVariations(selectedVariations.map(v => v.id))
            setSelectedVariations([])
        } else if (deleteVariationId) {
            // ===========================
            // Delete variation logic here
            // ===========================
            console.log('Delete variation with id:', deleteVariationId)
            // await deleteVariation(deleteVariationId)
        }
        onDeleteModalClose()
    }

    const filterItems = [
        ...(selectedVariations.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: 'Type: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Color', key: 'Color' },
                { label: 'Size', key: 'Size' },
                { label: 'Other', key: 'Other' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Type changed:', key)
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
                { label: 'Type (A-Z)', key: 'type_asc' },
                { label: 'Type (Z-A)', key: 'type_desc' },
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
                    placeholder: 'Search by variation name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
            />

            {/* ================= TABLE ================= */}
            <VariationsTable
                data={variationsData}
                selectedVariations={selectedVariations}
                onSelectionChange={setSelectedVariations}
                onDelete={handleDeleteVariation}
            />

            <Pagination
                currentPage={1}
                totalItems={100}
                itemsPerPage={25}
                onPageChange={() => { }}
                showingText="Variations"
            />

            <AddVariationModal isOpen={isAddModalOpen} onClose={onAddModalClose} />

            <DeleteModal
                title={isBulkDelete ? `variations (${selectedVariations.length})` : "variation"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductVariationsView
