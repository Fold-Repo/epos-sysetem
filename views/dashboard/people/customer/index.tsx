'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure, DeleteModal } from '@/components'
import CustomerTable from './CustomerTable'
import CustomerModal from './CustomerModal'
import { customersData } from '@/data'
import { CustomerType } from '@/types'
import { useState, useEffect } from 'react'

interface CustomerViewProps {
    onAddClick?: (handler: () => void) => void
}

const CustomerView = ({ onAddClick }: CustomerViewProps) => {

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [editingCustomer, setEditingCustomer] = useState<CustomerType | undefined>(undefined)
    const [deleteCustomerId, setDeleteCustomerId] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingCustomer(undefined)
                onModalOpen()
            })
        }
    }, [onAddClick, onModalOpen])

    const confirmDelete = () => {
        console.log('Delete customer:', deleteCustomerId)
        onDeleteModalClose()
        setDeleteCustomerId(undefined)
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

                <CustomerTable
                    data={customersData}
                    onEdit={(customer) => {
                        setEditingCustomer(customer)
                        onModalOpen()
                    }}
                    onDelete={(customerId) => {
                        setDeleteCustomerId(customerId)
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
                    showingText="Customers"
                />
            </DashboardCard>

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => {
                    setEditingCustomer(undefined)
                    onModalClose()
                }}
                mode={editingCustomer ? 'edit' : 'add'}
                initialData={editingCustomer}
            />

            <DeleteModal
                title="customer"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteCustomerId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default CustomerView