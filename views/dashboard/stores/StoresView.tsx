'use client'

import { DashboardBreadCrumb, DashboardCard, FilterBar, Pagination, DeleteModal, useDisclosure } from '@/components'
import { Button } from '@heroui/react'
import { useState, useMemo } from 'react'
import { StoreType } from '@/types'
import StoreTable from './StoreTable'
import StoreModal from './StoreModal'
import { useGetStores, useDeleteStore } from '@/services'
import { useQueryParams } from '@/hooks'

const StoresView = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteStoreId, setDeleteStoreId] = useState<string | undefined>(undefined)
    const [editingStore, setEditingStore] = useState<StoreType | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const { searchParams, updateQueryParams } = useQueryParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const LIMIT = 20
    const { data: stores, pagination, isLoading } = useGetStores(currentPage, LIMIT)
    const deleteStoreMutation = useDeleteStore()

    // ==============================
    // Filtered stores
    // ==============================
    const filteredStores = useMemo(() => {
        if (!searchValue.trim()) return stores
        
        const searchLower = searchValue.toLowerCase()
        return stores.filter(store => 
            store.name.toLowerCase().includes(searchLower)
        )
    }, [stores, searchValue])

    const confirmDelete = async () => {
        if (deleteStoreId) {
            return new Promise<void>((resolve) => {
                deleteStoreMutation.mutate(Number(deleteStoreId), {
                    onSuccess: () => {
                        onDeleteModalClose()
                        setDeleteStoreId(undefined)
                        resolve()
                    },
                    onError: () => {
                        resolve()
                    }
                })
            })
        }
    }

    const handleStatusChange = (storeId: string, status: 'active' | 'inactive') => {
        console.log('Status changed for store:', storeId, 'to', status)
    }

    const handleAdd = () => {
        setEditingStore(undefined)
        onOpen()
    }

    const handleEdit = (store: StoreType) => {
        setEditingStore(store)
        onOpen()
    }

    return (
        <>
            <DashboardBreadCrumb
                title="Stores"
                description="Manage your stores here."
                endContent={
                    <Button 
                        onPress={handleAdd} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Store
                    </Button>
                }
            />

            <div className="p-3 space-y-3">
                
                <DashboardCard bodyClassName='space-y-4'>

                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by name',
                            className: 'w-full md:w-72',
                            onSearch: (value) => setSearchValue(value)
                        }}
                    />

                    <StoreTable
                        data={filteredStores}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={(storeId) => {
                            setDeleteStoreId(storeId)
                            onDeleteModalOpen()
                        }}
                        onStatusChange={handleStatusChange}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={pagination?.total || 0}
                        itemsPerPage={LIMIT}
                        onPageChange={(page) => {
                            updateQueryParams({ page: page.toString() })
                        }}
                        showingText="Stores"
                    />

                </DashboardCard>
            </div>

            <StoreModal
                isOpen={isOpen}
                onClose={() => {
                    setEditingStore(undefined)
                    onClose()
                }}
                mode={editingStore ? 'edit' : 'add'}
                initialData={editingStore}
            />

            <DeleteModal
                title="store"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteStoreId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default StoresView

