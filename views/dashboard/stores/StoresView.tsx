'use client'

import { DashboardBreadCrumb, DashboardCard, FilterBar, Pagination, DeleteModal, useDisclosure } from '@/components'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { StoreType } from '@/types'
import StoreTable from './StoreTable'
import { storesData } from '@/data'
import StoreModal from './StoreModal'

const StoresView = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteStoreId, setDeleteStoreId] = useState<string | undefined>(undefined)
    const [editingStore, setEditingStore] = useState<StoreType | undefined>(undefined)

    const confirmDelete = () => {
        console.log('Delete store:', deleteStoreId)
        onDeleteModalClose()
        setDeleteStoreId(undefined)
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
                            className: 'w-full md:w-72'
                        }}
                    />

                    <StoreTable
                        data={storesData}
                        onEdit={handleEdit}
                        onDelete={(storeId) => {
                            setDeleteStoreId(storeId)
                            onDeleteModalOpen()
                        }}
                        onStatusChange={handleStatusChange}
                    />

                    <Pagination
                        currentPage={1}
                        totalItems={100}
                        itemsPerPage={25}
                        onPageChange={(page) => {
                            console.log('Page changed:', page)
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

