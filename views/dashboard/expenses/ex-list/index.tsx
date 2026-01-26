'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure, DeleteModal } from '@/components'
import ExpensesListTable from './ExpensesListTable'
import ExpenseModal from './ExpenseModal'
import { Expense } from '@/types'
import { useState, useEffect, useMemo } from 'react'
import { useGetExpenses, useDeleteExpense } from '@/services'
import { useQueryParams } from '@/hooks'
import { useAppSelector, selectActiveExpenseCategories, selectStores } from '@/store'

interface ExpensesListViewProps {
    onAddClick?: (handler: () => void) => void
}

const ExpensesListView = ({ onAddClick }: ExpensesListViewProps) => {

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined)
    const [deleteExpenseId, setDeleteExpenseId] = useState<number | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 25
    
    // Get data from Redux state
    const activeCategories = useAppSelector(selectActiveExpenseCategories)
    const stores = useAppSelector(selectStores)
    
    // Fetch expenses
    const { data: expenses, pagination, isLoading } = useGetExpenses(currentPage, LIMIT, {
        category_id: selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchValue || undefined
    })
    const deleteExpenseMutation = useDeleteExpense()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingExpense(undefined)
                onModalOpen()
            })
        }
    }, [onAddClick, onModalOpen])

    const handleDeleteExpense = (expenseId: number) => {
        setDeleteExpenseId(expenseId)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (deleteExpenseId) {
            return new Promise<void>((resolve) => {
                deleteExpenseMutation.mutate(deleteExpenseId, {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteExpenseId(undefined)
                        resolve()
                    },
                    onError: () => {
                        resolve()
                    }
                })
            })
        }
    }

    const categoryFilterItems = useMemo(() => {
        const items = [{ label: 'All', key: 'all' }]
        activeCategories.forEach(cat => {
            items.push({ label: cat.name, key: String(cat.id) })
        })
        return items
    }, [activeCategories])

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: `Category: ${selectedCategory === 'all' ? 'All' : activeCategories.find(c => String(c.id) === selectedCategory)?.name || 'All'}`,
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: categoryFilterItems,
            value: selectedCategory,
            onChange: (key: string) => {
                setSelectedCategory(key)
                updateQueryParams({ page: '1' })
            }
        },
        {
            type: 'dropdown' as const,
            label: `Status: ${selectedStatus === 'all' ? 'All' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`,
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Pending', key: 'pending' },
                { label: 'Approved', key: 'approved' },
                { label: 'Rejected', key: 'rejected' }
            ],
            value: selectedStatus,
            onChange: (key: string) => {
                setSelectedStatus(key)
                updateQueryParams({ page: '1' })
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
            <DashboardCard bodyClassName='space-y-4'>
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by reference or title',
                        className: 'w-full md:w-72',
                        onSearch: (value) => {
                            setSearchValue(value)
                            updateQueryParams({ page: '1' })
                        }
                    }}
                    items={filterItems}
                />

                <ExpensesListTable
                    data={expenses}
                    isLoading={isLoading}
                    onEdit={(expense) => {
                        setEditingExpense(expense)
                        onModalOpen()
                    }}
                    onDelete={handleDeleteExpense}
                />

                <Pagination
                    currentPage={currentPage}
                    totalItems={pagination?.total || 0}
                    itemsPerPage={LIMIT}
                    onPageChange={(page) => {
                        updateQueryParams({ page: page.toString() })
                    }}
                    showingText="Expenses"
                />
            </DashboardCard>

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setEditingExpense(undefined)
                    onModalClose()
                }}
                mode={editingExpense ? 'edit' : 'add'}
                initialData={editingExpense}
            />

            <DeleteModal
                title="expense"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteExpenseId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ExpensesListView
