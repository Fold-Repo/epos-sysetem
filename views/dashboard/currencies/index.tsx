'use client'

import { DashboardBreadCrumb, DashboardCard, FilterBar, Pagination, DeleteModal } from '@/components'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { CurrencyType } from '@/types'
import CurrencyTable from './CurrencyTable'
import { currenciesData } from '@/data'
import CurrencyModal from './CurrencyModal'
import { useDisclosure } from '@heroui/react'

const CurrencyView = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteCurrencyId, setDeleteCurrencyId] = useState<string | undefined>(undefined)
    const [editingCurrency, setEditingCurrency] = useState<CurrencyType | undefined>(undefined)

    const confirmDelete = () => {
        console.log('Delete currency:', deleteCurrencyId)
        onDeleteModalClose()
    }

    return (
        <>
            <DashboardBreadCrumb
                title="Currencies"
                description="Manage your currencies here."
                endContent={
                    <Button 
                        onPress={() => {
                            setEditingCurrency(undefined)
                            onOpen()
                        }} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Currency
                    </Button>
                }
            />

            <div className="p-3 space-y-3">
                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by name or code',
                            className: 'w-full md:w-72'
                        }}
                    />

                    <CurrencyTable
                        data={currenciesData}
                        onEdit={(currency) => {
                            setEditingCurrency(currency)
                            onOpen()
                        }}
                        onDelete={(currencyId) => {
                            setDeleteCurrencyId(currencyId)
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
                        showingText="Currencies"
                    />
                </DashboardCard>
            </div>

            <CurrencyModal
                isOpen={isOpen}
                onClose={() => {
                    setEditingCurrency(undefined)
                    onClose()
                }}
                mode={editingCurrency ? 'edit' : 'add'}
                initialData={editingCurrency}
            />

            <DeleteModal
                title="currency"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />
        </>
    )
}

export default CurrencyView

