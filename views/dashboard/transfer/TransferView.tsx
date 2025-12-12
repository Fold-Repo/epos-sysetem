'use client'

import { DashboardBreadCrumb, DashboardCard, FilterBar, Pagination, StackIcon, DeleteModal, useDisclosure } from '@/components'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import TransferTable from './TransferTable'
import { transfersData } from '@/data'
import { TransferType } from '@/types'

const TransferView = () => {
    
    const router = useRouter()
    const [selectedTransfers, setSelectedTransfers] = useState<TransferType[]>([])
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteTransferId, setDeleteTransferId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    const handleDelete = (transferId: string) => {
        setDeleteTransferId(transferId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = () => {
        if (isBulkDelete) {
            console.log('Delete transfers:', selectedTransfers.map(t => t.id))
            setSelectedTransfers([])
        } else {
            console.log('Delete transfer:', deleteTransferId)
        }
        onDeleteModalClose()
    }

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Sent', key: 'sent' },
                { label: 'Draft', key: 'draft' },
                { label: 'Approved', key: 'approved' },
                { label: 'Rejected', key: 'rejected' }
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
                { label: 'Reference (A-Z)', key: 'reference_asc' },
                { label: 'Reference (Z-A)', key: 'reference_desc' },
                { label: 'Grand Total (High to Low)', key: 'total_desc' },
                { label: 'Grand Total (Low to High)', key: 'total_asc' },
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
            label: 'Date',
            placeholder: 'Select date range'
        },
    ]
    
    return (
        <>
            <DashboardBreadCrumb
                title="Transfers"
                description="Manage your transfers here."
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
                            placeholder: 'Search by reference',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <TransferTable
                        data={transfersData}
                        selectedTransfers={selectedTransfers}
                        onSelectionChange={setSelectedTransfers}
                        onView={(transferId) => router.push(`/dashboard/transfers/${transferId}`)}
                        onEdit={(transferId) => router.push(`/dashboard/transfers/${transferId}/edit`)}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={1}
                        totalItems={100}
                        itemsPerPage={25}
                        onPageChange={(page) => {
                            console.log('Page changed:', page)
                        }}
                        showingText="Transfers"
                    />
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