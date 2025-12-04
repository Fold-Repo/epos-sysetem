'use client'

import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect } from 'react'
import UnitsTable from './UnitsTable'
import { unitsData } from './data'
import { ProductUnitType } from '@/types/unit.type'
import AddUnitModal from './AddUnitModal'

interface ProductUnitsViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductUnitsView = ({ onAddClick }: ProductUnitsViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteUnitId, setDeleteUnitId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    const [selectedUnits, setSelectedUnits] = useState<ProductUnitType[]>([])

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    const handleBulkDelete = () => {
        if (selectedUnits.length > 0) {
            setIsBulkDelete(true)
            setDeleteUnitId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDeleteUnit = (unitId: string) => {
        setDeleteUnitId(unitId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedUnits.length > 0) {
            // ===========================
            // Delete units logic here
            // ===========================
            console.log('Delete units:', selectedUnits.map(u => u.id))
            // await deleteUnits(selectedUnits.map(u => u.id))
            setSelectedUnits([])
        } else if (deleteUnitId) {
            // ===========================
            // Delete unit logic here
            // ===========================
            console.log('Delete unit with id:', deleteUnitId)
            // await deleteUnit(deleteUnitId)
        }
        onDeleteModalClose()
    }

    const filterItems = [
        ...(selectedUnits.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: 'Sort By: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'Name (A-Z)', key: 'name_asc' },
                { label: 'Name (Z-A)', key: 'name_desc' },
                { label: 'Base Name (A-Z)', key: 'base_asc' },
                { label: 'Base Name (Z-A)', key: 'base_desc' },
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
                    placeholder: 'Search by unit name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
            />

            {/* ================= TABLE ================= */}
            <UnitsTable
                data={unitsData}
                selectedUnits={selectedUnits}
                onSelectionChange={setSelectedUnits}
                onDelete={handleDeleteUnit}
            />

            <Pagination
                currentPage={1}
                totalItems={100}
                itemsPerPage={25}
                onPageChange={() => { }}
                showingText="Units"
            />

            <AddUnitModal isOpen={isAddModalOpen} onClose={onAddModalClose} />

            <DeleteModal
                title={isBulkDelete ? `units (${selectedUnits.length})` : "unit"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductUnitsView
