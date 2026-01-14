'use client'

import { FilterBar, Pagination, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect, useMemo } from 'react'
import CategoryTable from './CategoryTable'
import { Category } from '@/types/category.type'
import AddCategoryModal from './AddCategoryModal'
import { useGetCategories, useDeleteCategory } from '@/services'
import { useQueryParams } from '@/hooks'

interface ProductCategoryViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductCategoryView = ({ onAddClick }: ProductCategoryViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | undefined>(undefined)
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 20
    const { data: categories, pagination, isLoading } = useGetCategories(currentPage, LIMIT)
    const deleteCategoryMutation = useDeleteCategory()

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                setEditingCategory(undefined)
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    // ==============================
    // Filtered categories
    // ==============================
    const filteredCategories = useMemo(() => {
        if (!searchValue.trim()) return categories
        
        const searchLower = searchValue.toLowerCase()
        return categories.filter(category => 
            category.category_name.toLowerCase().includes(searchLower)
        )
    }, [categories, searchValue])

    const handleDeleteCategory = (categoryId: number) => {
        setDeleteCategoryId(categoryId)
        onDeleteModalOpen()
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        onAddModalOpen()
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
            {/* ================= FILTER BAR ================= */}
            <FilterBar
                searchInput={{
                    placeholder: 'Search by category name',
                    className: 'w-full md:w-72',
                    onSearch: (value) => setSearchValue(value)
                }}
            />

            {/* ================= TABLE ================= */}
            <CategoryTable
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
                showingText="Categories"
            />

            <AddCategoryModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setEditingCategory(undefined)
                    onAddModalClose()
                }}
                initialData={editingCategory}
            />

            <DeleteModal
                title="category"
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

export default ProductCategoryView