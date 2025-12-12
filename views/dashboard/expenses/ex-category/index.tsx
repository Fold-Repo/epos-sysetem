'use client'

import { DashboardCard, FilterBar, Pagination, DeleteModal } from '@/components'
import { useEffect, useState } from 'react'
import { ExpenseCategoryType } from '@/types'
import ExpensesCatTable from './ExpensesCatTable'
import { expenseCategoriesData } from '@/data'
import ExpensesModal from './ExpensesModal'
import { useDisclosure } from '@heroui/react'

interface ExpensesCategoryViewProps {
    onAddClick?: (handler: () => void) => void
}

const ExpensesCategoryView = ({ onAddClick }: ExpensesCategoryViewProps) => {

    useEffect(() => {
        onAddClick?.(onOpen)
    }, [onAddClick])

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | undefined>(undefined)
    const [editingCategory, setEditingCategory] = useState<ExpenseCategoryType | undefined>(undefined)

    const confirmDelete = () => {
        console.log('Delete expense category:', deleteCategoryId)
        onDeleteModalClose()
    }

    return (
        <>
            <DashboardCard bodyClassName='space-y-4'>
                
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by category name',
                        className: 'w-full md:w-72'
                    }}
                />

                <ExpensesCatTable
                    data={expenseCategoriesData}
                    onEdit={(category) => {
                        setEditingCategory(category)
                        onOpen()
                    }}
                    onDelete={(categoryId) => {
                        setDeleteCategoryId(categoryId)
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
                    showingText="Expenses Categories"
                />
            </DashboardCard>

            <ExpensesModal
                isOpen={isOpen}
                onClose={() => {
                    setEditingCategory(undefined)
                    onClose()
                }}
                mode={editingCategory ? 'edit' : 'add'}
                initialData={editingCategory}
            />

            <DeleteModal
                title="expense category"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ExpensesCategoryView