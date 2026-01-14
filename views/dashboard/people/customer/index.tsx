'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure, DeleteModal } from '@/components'
import CustomerTable from './CustomerTable'
import CustomerModal from './CustomerModal'
import { CustomerType, CustomerQueryParams } from '@/types'
import { useState, useEffect } from 'react'
import { useGetCustomers, useDeleteCustomer } from '@/services'
import { useQueryParams } from '@/hooks'
import { useAppDispatch } from '@/store/hooks'
import { fetchCustomers } from '@/store/slice'

// ================================
// CONSTANTS
// ================================
const LIMIT = 25

const SORT_OPTIONS = [
    { label: 'Newest First', key: 'newest' },
    { label: 'Oldest First', key: 'oldest' },
    { label: 'Name (A-Z)', key: 'name_asc' },
    { label: 'Name (Z-A)', key: 'name_desc' },
    { label: 'City (A-Z)', key: 'city_asc' },
    { label: 'City (Z-A)', key: 'city_desc' }
]

interface CustomerViewProps {
    onAddClick?: (handler: () => void) => void
}

const CustomerView = ({ onAddClick }: CustomerViewProps) => {

    const dispatch = useAppDispatch()
    const { searchParams, updateQueryParams } = useQueryParams()
    
    // ================================
    // GET QUERY PARAMS FROM URL
    // ================================
    const queryParams: CustomerQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        sort: searchParams.get('sort') || undefined
    }
    
    // ================================
    // FETCH CUSTOMERS
    // ================================
    const { data, isLoading } = useGetCustomers(queryParams)
    const { customers, pagination } = data || {}

    // ================================
    // DELETE MUTATION
    // ================================
    const deleteCustomerMutation = useDeleteCustomer()

    // ================================
    // MODAL STATE
    // ================================
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [editingCustomer, setEditingCustomer] = useState<CustomerType | undefined>(undefined)
    const [deleteCustomerId, setDeleteCustomerId] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingCustomer(undefined)
                onModalOpen()
            })
        }
    }, [onAddClick, onModalOpen])

    // ================================
    // DELETE HANDLERS
    // ================================
    const handleDelete = (customerId: string) => {
        setDeleteCustomerId(Number(customerId))
        onDeleteModalOpen()
    }

    const confirmDelete = () => {
        if (deleteCustomerId) {
            deleteCustomerMutation.mutate(deleteCustomerId, {
                onSuccess: () => {
                    dispatch(fetchCustomers())
                }
            })
        }
        onDeleteModalClose()
        setDeleteCustomerId(undefined)
    }

    // ================================
    // GET LABEL FOR CURRENT FILTER VALUE
    // ================================
    const getSortLabel = () => {
        const current = SORT_OPTIONS.find(o => o.key === queryParams.sort)
        return current ? `Sort: ${current.label}` : 'Sort By'
    }

    // ================================
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
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
            <DashboardCard bodyClassName='space-y-4'>
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by name, email, or phone',
                        className: 'w-full md:w-72',
                        onSearch: (value: string) => {
                            updateQueryParams({ search: value || null, page: 1 })
                        }
                    }}
                    items={filterItems}
                />

                <CustomerTable
                    data={customers ?? []}
                    loading={isLoading}
                    onEdit={(customer) => {
                        setEditingCustomer(customer)
                        onModalOpen()
                    }}
                    onDelete={handleDelete}
                />

                {pagination && (
                    <Pagination
                        currentPage={pagination.page}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={(page) => {
                            updateQueryParams({ page })
                        }}
                        showingText="Customers"
                    />
                )}
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
