'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, StackIcon, DashboardCard, useDisclosure, TrashIcon } from '@/components'
import { DeleteModal } from '@/components/modal'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import TransferTable from './TransferTable'
import { TransferType } from '@/types'
import { useGetTransfers, TransferQueryParams, useDeleteTransfer } from '@/services'
import { useQueryParams } from '@/hooks'

// ================================
// CONSTANTS
// ================================
const LIMIT = 25

const SORT_OPTIONS = [
    { label: 'Newest First', key: 'newest' },
    { label: 'Oldest First', key: 'oldest' },
    { label: 'Date (Newest)', key: 'date_desc' },
    { label: 'Date (Oldest)', key: 'date_asc' }
]

const STATUS_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Pending', key: 'pending' },
    { label: 'Transferred', key: 'transferred' },
    { label: 'Received', key: 'received' },
    { label: 'Cancelled', key: 'cancelled' }
]

const TransferView = () => {
    
    const router = useRouter()
    const { searchParams, updateQueryParams } = useQueryParams()
    
    // ================================
    // GET QUERY PARAMS FROM URL
    // ================================
    const queryParams: TransferQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        sort: searchParams.get('sort') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    }
    
    // ================================
    // FETCH TRANSFERS
    // ================================
    const { data, isLoading } = useGetTransfers(queryParams)
    const { transfers, pagination } = data || {}
    
    // ================================
    // DELETE MUTATION
    // ================================
    const deleteTransferMutation = useDeleteTransfer()
    
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedTransfers, setSelectedTransfers] = useState<TransferType[]>([]);
    const [deleteTransferId, setDeleteTransferId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    const handleBulkDelete = () => {
        if (selectedTransfers.length > 0) {
            setIsBulkDelete(true)
            setDeleteTransferId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDelete = (transferId: string) => {
        setDeleteTransferId(transferId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedTransfers.length > 0) {
            const deletePromises = selectedTransfers
                .filter(t => t.transfer_id)
                .map(t => deleteTransferMutation.mutateAsync(t.transfer_id!))
            
            try {
                await Promise.all(deletePromises)
                setSelectedTransfers([])
            } catch (error) {
            }
        } else if (deleteTransferId) {
            try {
                await deleteTransferMutation.mutateAsync(Number(deleteTransferId))
            } catch (error) {
            }
        }
        onDeleteModalClose()
    }

    // ================================
    // GET LABEL FOR CURRENT FILTER VALUE
    // ================================
    const getStatusLabel = () => {
        const current = STATUS_OPTIONS.find(o => o.key === queryParams.status)
        return current ? `Status: ${current.label}` : 'Status: All'
    }

    const getSortLabel = () => {
        const current = SORT_OPTIONS.find(o => o.key === queryParams.sort)
        return current ? `Sort: ${current.label}` : 'Sort By'
    }

    // ================================
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
        ...(selectedTransfers.length > 0 ? [{
            type: 'button' as const,
            label: `Delete (${selectedTransfers.length})`,
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dateRange' as const,
            label: 'Date',
            startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
            endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
            onChange: (value: Date | { startDate: Date; endDate: Date }) => {
                if ('startDate' in value && 'endDate' in value) {
                    updateQueryParams({ 
                        startDate: value.startDate.toISOString().split('T')[0], 
                        endDate: value.endDate.toISOString().split('T')[0], 
                        page: 1 
                    })
                }
            }
        },
        {
            type: 'dropdown' as const,
            label: getStatusLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: STATUS_OPTIONS,
            value: queryParams.status || 'all',
            onChange: (key: string) => {
                updateQueryParams({ status: key === 'all' ? null : key, page: 1 })
            }
        },
        {
            type: 'dropdown' as const,
            label: getSortLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: SORT_OPTIONS,
            value: queryParams.sort || '',
            onChange: (key: string) => {
                updateQueryParams({ sort: key, page: 1 })
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Transfers"
                description="Manage your inventory transfers between stores. Add, edit, and delete transfers as needed."
                endContent={
                    <Button onPress={() => router.push('/dashboard/transfers/create')} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Transfer
                    </Button>
                }
            />

            <div className="p-3 space-y-3">
                <DashboardCard bodyClassName='space-y-4'>
                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search transfers',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({ search: value || null, page: 1 })
                            }
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <TransferTable
                        data={transfers ?? []}
                        selectedTransfers={selectedTransfers}
                        onSelectionChange={setSelectedTransfers}
                        onView={(transferId) => router.push(`/dashboard/transfers/${transferId}`)}
                        onEdit={(transferId) => router.push(`/dashboard/transfers/${transferId}/edit`)}
                        onDelete={handleDelete}
                        loading={isLoading}
                    />

                    {pagination && (
                        <Pagination
                            currentPage={typeof pagination.page === 'string' ? parseInt(pagination.page, 10) : pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={typeof pagination.limit === 'string' ? parseInt(pagination.limit, 10) : pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Transfers"
                        />
                    )}
                </DashboardCard>
            </div>

            <DeleteModal
                title={isBulkDelete ? `transfers (${selectedTransfers.length})` : "transfer"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default TransferView