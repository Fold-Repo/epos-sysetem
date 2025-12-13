'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure, DeleteModal } from '@/components'
import SupplierTable from './SupplierTable'
import SupplierModal from './SupplierModal'
import { suppliersData } from '@/data'
import { SupplierType } from '@/types'
import { useState, useEffect } from 'react'

interface SuppliersViewProps {
    onAddClick?: (handler: () => void) => void
}

const SuppliersView = ({ onAddClick }: SuppliersViewProps) => {

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [editingSupplier, setEditingSupplier] = useState<SupplierType | undefined>(undefined)
    const [deleteSupplierId, setDeleteSupplierId] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingSupplier(undefined)
                onModalOpen()
            })
        }
    }, [onAddClick, onModalOpen])

    const confirmDelete = () => {
        console.log('Delete supplier:', deleteSupplierId)
        onDeleteModalClose()
        setDeleteSupplierId(undefined)
    }

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: 'Country: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'United States', key: 'us' },
                { label: 'United Kingdom', key: 'uk' },
                { label: 'Canada', key: 'ca' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Country changed:', key)
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
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Sort changed:', key)
            }
        },
        {
            type: 'dateRange' as const,
            label: 'Data',
            placeholder: 'Select date range'
        },
    ]

    return (
        <>
            <DashboardCard bodyClassName='space-y-4'>
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by name, email, or phone',
                        className: 'w-full md:w-72'
                    }}
                    items={filterItems}
                />

                <SupplierTable
                    data={suppliersData}
                    onEdit={(supplier) => {
                        setEditingSupplier(supplier)
                        onModalOpen()
                    }}
                    onDelete={(supplierId) => {
                        setDeleteSupplierId(supplierId)
                        onDeleteModalOpen()
                    }}
                />

                <Pagination
                    currentPage={1}
                    totalItems={100}
                    itemsPerPage={25}
                    onPageChange={(page) => {
                        console.log('Page changed:', page)
                    }}
                    showingText="Suppliers"
                />

            </DashboardCard>

            <SupplierModal
                isOpen={isModalOpen}
                onClose={() => {
                    setEditingSupplier(undefined)
                    onModalClose()
                }}
                mode={editingSupplier ? 'edit' : 'add'}
                initialData={editingSupplier}
            />

            <DeleteModal
                title="supplier"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteSupplierId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default SuppliersView