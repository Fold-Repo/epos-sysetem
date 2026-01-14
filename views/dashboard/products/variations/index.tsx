'use client'

import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect, useMemo } from 'react'
import VariationsTable from './VariationsTable'
import { Variation } from '@/types/variation.type'
import AddVariationModal from './AddVariationModal'
import { useGetVariations, useDeleteVariation } from '@/services'
import { useQueryParams } from '@/hooks'

interface ProductVariationsViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductVariationsView = ({ onAddClick }: ProductVariationsViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteVariationId, setDeleteVariationId] = useState<number | undefined>(undefined)
    const [editingVariation, setEditingVariation] = useState<Variation | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 20
    const { data: variations, pagination, isLoading } = useGetVariations(currentPage, LIMIT)
    const deleteVariationMutation = useDeleteVariation()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingVariation(undefined)
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    // ==============================
    // Filtered variations
    // ==============================
    const filteredVariations = useMemo(() => {
        if (!searchValue.trim()) return variations
        
        const searchLower = searchValue.toLowerCase()
        return variations.filter(variation => 
            variation.name.toLowerCase().includes(searchLower) ||
            variation.options.some(option => 
                option.option.toLowerCase().includes(searchLower)
            )
        )
    }, [variations, searchValue])

    const handleDeleteVariation = (variationId: number) => {
        setDeleteVariationId(variationId)
        onDeleteModalOpen()
    }

    const handleEdit = (variation: Variation) => {
        setEditingVariation(variation)
        onAddModalOpen()
    }

    const confirmDelete = async () => {
        if (deleteVariationId) {
            return new Promise<void>((resolve) => {
                deleteVariationMutation.mutate(deleteVariationId, {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteVariationId(undefined)
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
                    placeholder: 'Search by variation name or option',
                    className: 'w-full md:w-72',
                    onSearch: (value) => setSearchValue(value)
                }}
            />

            {/* ================= TABLE ================= */}
            <VariationsTable
                data={filteredVariations}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteVariation}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={pagination?.total || 0}
                itemsPerPage={LIMIT}
                onPageChange={(page) => {
                    updateQueryParams({ page: page.toString() })
                }}
                showingText="Variations"
            />

            <AddVariationModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setEditingVariation(undefined)
                    onAddModalClose()
                }}
                initialData={editingVariation}
            />

            <DeleteModal
                title="variation"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteVariationId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductVariationsView
