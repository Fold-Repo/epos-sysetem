'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure } from '@/components'
import ExpensesListTable from './ExpensesListTable'
import ExpenseModal from './ExpenseModal'
import { expensesData } from '@/data'
import { ExpenseType } from '@/types'
import { useState, useEffect } from 'react'

interface ExpensesListViewProps {
    onAddClick?: (handler: () => void) => void
}

const ExpensesListView = ({ onAddClick }: ExpensesListViewProps) => {

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const [editingExpense, setEditingExpense] = useState<ExpenseType | undefined>(undefined)

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingExpense(undefined)
                onModalOpen()
            })
        }
    }, [onAddClick, onModalOpen])

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Office Supplies', key: 'office-supplies' },
                { label: 'Utilities', key: 'utilities' },
                { label: 'Travel', key: 'travel' },
                { label: 'Marketing', key: 'marketing' },
                { label: 'Maintenance', key: 'maintenance' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
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
                { label: 'Amount (High to Low)', key: 'amount_desc' },
                { label: 'Amount (Low to High)', key: 'amount_asc' },
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
                        placeholder: 'Search by reference or title',
                        className: 'w-full md:w-72'
                    }}
                    items={filterItems}
                />

                <ExpensesListTable
                    data={expensesData}
                    onEdit={(expense) => {
                        setEditingExpense(expense)
                        onModalOpen()
                    }}
                    onDelete={(expenseId) => {
                        console.log('Delete expense:', expenseId)
                    }}
                />

                <Pagination
                    currentPage={1}
                    totalItems={100}
                    itemsPerPage={25}
                    onPageChange={(page) => {
                        console.log('Page changed:', page)
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
        </>
    )
}

export default ExpensesListView
