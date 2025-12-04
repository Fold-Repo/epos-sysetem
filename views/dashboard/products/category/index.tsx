'use client'

import { FilterBar, Pagination, StackIcon, TrashIcon, useDisclosure } from '@/components'
import { DeleteModal } from '@/components/modal'
import { useState, useEffect } from 'react'
import CategoryTable from './CategoryTable'
import { categoriesData } from './data'
import { ProductCategoryType } from '@/types/category.type'
import AddCategoryModal from './AddCategoryModal'

interface ProductCategoryViewProps {
    onAddClick?: (handler: () => void) => void
}

const ProductCategoryView = ({ onAddClick }: ProductCategoryViewProps) => {
    
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<ProductCategoryType[]>([])

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                onAddModalOpen()
            })
        }
    }, [onAddClick, onAddModalOpen])

    const handleBulkDelete = () => {
        if (selectedCategories.length > 0) {
            setIsBulkDelete(true)
            setDeleteCategoryId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDeleteCategory = (categoryId: string) => {
        setDeleteCategoryId(categoryId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedCategories.length > 0) {
            // ===========================
            // Delete categories logic here
            // ===========================
            // await deleteCategories(selectedCategories.map(c => c.id))
            setSelectedCategories([])
        } else if (deleteCategoryId) {
            // ===========================
            // Delete category logic here
            // ===========================
            // await deleteCategory(deleteCategoryId)
        }
    }

    const filterItems = [
        ...(selectedCategories.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Active', key: 'active' },
                { label: 'Inactive', key: 'inactive' }
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
                { label: 'Name (A-Z)', key: 'name_asc' },
                { label: 'Name (Z-A)', key: 'name_desc' },
                { label: 'Product Count (High to Low)', key: 'count_desc' },
                { label: 'Product Count (Low to High)', key: 'count_asc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Sort changed:', key)
            }
        }
    ]

    return (
        <>
            {/* ================= FILTER BAR ================= */}
            <FilterBar
                searchInput={{
                    placeholder: 'Search by category name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
            />

            {/* ================= TABLE ================= */}
            <CategoryTable
                data={categoriesData}
                selectedCategories={selectedCategories}
                onSelectionChange={setSelectedCategories}
                onDelete={handleDeleteCategory}
            />

            <Pagination
                currentPage={1}
                totalItems={100}
                itemsPerPage={25}
                onPageChange={() => { }}
                showingText="Categories"
            />

            <AddCategoryModal isOpen={isAddModalOpen} onClose={onAddModalClose} />

            <DeleteModal
                title={isBulkDelete ? `categories (${selectedCategories.length})` : "category"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default ProductCategoryView