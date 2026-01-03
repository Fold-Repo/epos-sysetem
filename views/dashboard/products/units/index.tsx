'use client'

import { FilterBar, Pagination, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect, useMemo } from 'react'
import UnitsTable from './UnitsTable'
import { Unit } from '@/types/unit.type'
import AddUnitModal from './AddUnitModal'
import { useGetUnits, useDeleteUnit } from '@/services'

interface ProductUnitsViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductUnitsView = ({ onAddClick }: ProductUnitsViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteUnitId, setDeleteUnitId] = useState<number | undefined>(undefined)
    const [editingUnit, setEditingUnit] = useState<Unit | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { data: units, isLoading } = useGetUnits()
    const deleteUnitMutation = useDeleteUnit()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingUnit(undefined)
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    // ==============================
    // Filtered units
    // ==============================
    const filteredUnits = useMemo(() => {
        if (!searchValue.trim()) return units
        
        const searchLower = searchValue.toLowerCase()
        return units.filter(unit => 
            unit.name.toLowerCase().includes(searchLower) ||
            unit.short_name.toLowerCase().includes(searchLower)
        )
    }, [units, searchValue])

    const handleDeleteUnit = (unitId: number) => {
        setDeleteUnitId(unitId)
        onDeleteModalOpen()
    }

    const handleEdit = (unit: Unit) => {
        setEditingUnit(unit)
        onAddModalOpen()
    }

    const confirmDelete = async () => {
        if (deleteUnitId) {
            return new Promise<void>((resolve) => {
                deleteUnitMutation.mutate(deleteUnitId, {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteUnitId(undefined)
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
                    placeholder: 'Search by unit name or short name',
                    className: 'w-full md:w-72',
                    onSearch: (value) => setSearchValue(value)
                }}
            />

            {/* ================= TABLE ================= */}
            <UnitsTable
                data={filteredUnits}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteUnit}
            />

            <Pagination
                currentPage={1}
                totalItems={filteredUnits?.length || 0}
                itemsPerPage={25}
                onPageChange={() => { }}
                showingText="Units"
            />

            <AddUnitModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setEditingUnit(undefined)
                    onAddModalClose()
                }}
                initialData={editingUnit}
            />

            <DeleteModal
                title="unit"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteUnitId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductUnitsView
