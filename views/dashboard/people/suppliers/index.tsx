'use client'

import { DashboardCard, FilterBar, Pagination, useDisclosure, DeleteModal } from '@/components'
import SupplierTable from './SupplierTable'
import SupplierModal from './SupplierModal'
import { Supplier } from '@/types/supplier.type'
import { useState, useEffect, useMemo } from 'react'
import { useGetSuppliers, useDeleteSupplier } from '@/services'
import { useQueryParams } from '@/hooks'

interface SuppliersViewProps {
    onAddClick?: (handler: () => void) => void
}

const SuppliersView = ({ onAddClick }: SuppliersViewProps) => {

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined)
    const [deleteSupplierId, setDeleteSupplierId] = useState<number | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 20
    const { data: suppliers, pagination, isLoading } = useGetSuppliers(currentPage, LIMIT)
    const deleteSupplierMutation = useDeleteSupplier()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingSupplier(undefined)
                onModalOpen()
            })
        }
    }, [onAddClick, onModalOpen])

    // ==============================
    // Filtered suppliers
    // ==============================
    const filteredSuppliers = useMemo(() => {
        if (!searchValue.trim()) return suppliers
        
        const searchLower = searchValue.toLowerCase()
        return suppliers.filter(supplier => 
            supplier.name.toLowerCase().includes(searchLower) ||
            supplier.email.toLowerCase().includes(searchLower) ||
            supplier.phone.toLowerCase().includes(searchLower) ||
            supplier.address.toLowerCase().includes(searchLower)
        )
    }, [suppliers, searchValue])

    const confirmDelete = async () => {
        if (deleteSupplierId) {
            return new Promise<void>((resolve) => {
                deleteSupplierMutation.mutate(deleteSupplierId, {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteSupplierId(undefined)
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
            <DashboardCard bodyClassName='space-y-4'>

                {/* ================= FILTER BAR ================= */}
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by name, email, phone, or address',
                        className: 'w-full md:w-72',
                        onSearch: (value) => setSearchValue(value)
                    }}
                />

                {/* ================= TABLE ================= */}
                <SupplierTable
                    data={filteredSuppliers}
                    isLoading={isLoading}
                    onEdit={(supplier) => {
                        setEditingSupplier(supplier)
                        onModalOpen()
                    }}
                    onDelete={(supplierId) => {
                        setDeleteSupplierId(supplierId)
                        onDeleteModalOpen()
                    }}
                />

                {/* ================= PAGINATION ================= */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={pagination?.total || 0}
                    itemsPerPage={LIMIT}
                    onPageChange={(page) => {
                        updateQueryParams({ page: page.toString() })
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