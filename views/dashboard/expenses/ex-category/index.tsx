'use client'

import { DashboardCard, FilterBar, Pagination, DeleteModal } from '@/components'
import { useEffect, useState, useMemo } from 'react'
import { ExpenseCategory } from '@/types'
import ExpensesCatTable from './ExpensesCatTable'
import ExpensesModal from './ExpensesModal'
import { useDisclosure } from '@heroui/react'
import { useGetExpenseCategories, useDeleteExpenseCategory } from '@/services'
import { useQueryParams } from '@/hooks'

interface ExpensesCategoryViewProps {
    onAddClick?: (handler: () => void) => void
}

const ExpensesCategoryView = ({ onAddClick }: ExpensesCategoryViewProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | undefined>(undefined)
    const [editingCategory, setEditingCategory] = useState<ExpenseCategory | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 25
    const { data: categories, pagination, isLoading } = useGetExpenseCategories(currentPage, LIMIT)
    const deleteCategoryMutation = useDeleteExpenseCategory()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingCategory(undefined)
                onOpen()
            })
        }
    }, [onAddClick, onOpen])

    // ==============================
    // Filtered categories
    // ==============================
    const filteredCategories = useMemo(() => {
        if (!searchValue.trim()) return categories
        
        const searchLower = searchValue.toLowerCase()
        return categories.filter(category => 
            category.name.toLowerCase().includes(searchLower)
        )
    }, [categories, searchValue])

    const handleDeleteCategory = (categoryId: number) => {
        setDeleteCategoryId(categoryId)
        onDeleteModalOpen()
    }

    const handleEdit = (category: ExpenseCategory) => {
        setEditingCategory(category)
        onOpen()
    }

    const confirmDelete = async () => {
        if (deleteCategoryId) {
            return new Promise<void>((resolve) => {
                deleteCategoryMutation.mutate(deleteCategoryId, {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteCategoryId(undefined)
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
                
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by category name',
                        className: 'w-full md:w-72',
                        onSearch: (value) => setSearchValue(value)
                    }}
                />

                <ExpensesCatTable
                    data={filteredCategories}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteCategory}
                />

                <Pagination
                    currentPage={currentPage}
                    totalItems={pagination?.total || 0}
                    itemsPerPage={LIMIT}
                    onPageChange={(page) => {
                        updateQueryParams({ page: page.toString() })
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
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteCategoryId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ExpensesCategoryView