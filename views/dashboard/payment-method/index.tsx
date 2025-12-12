'use client'

import { DashboardBreadCrumb, DashboardCard, FilterBar, Pagination, 
    DeleteModal } from '@/components'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { PaymentMethodType } from '@/types'
import PaymentMethodTable from './PaymentMethodTable'
import { paymentMethodsData } from '@/data'
import PaymentMdtModal from './PaymentMdtModal'
import { useDisclosure } from '@heroui/react'

const PaymentMtdView = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deletePaymentMethodId, setDeletePaymentMethodId] = useState<string | undefined>(undefined)
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodType | undefined>(undefined)

    const confirmDelete = () => {
        console.log('Delete payment method:', deletePaymentMethodId)
        onDeleteModalClose()
    }

    const handleStatusChange = (paymentMethodId: string, status: 'active' | 'inactive') => {
        console.log('Status changed for payment method:', paymentMethodId, 'to', status)
    }

    return (
        <>
            <DashboardBreadCrumb
                title="Payment Methods"
                description="Manage your payment methods here."
                endContent={
                    <Button 
                        onPress={() => onOpen()} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Payment Method
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

                    <PaymentMethodTable
                        data={paymentMethodsData}
                        onEdit={(paymentMethod) => {
                            setEditingPaymentMethod(paymentMethod)
                            onOpen()
                        }}
                        onDelete={(paymentMethodId) => {
                            setDeletePaymentMethodId(paymentMethodId)
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
                        showingText="Payment Methods"
                    />

                </DashboardCard>
            </div>

            <PaymentMdtModal
                isOpen={isOpen}
                onClose={onClose}
                mode={editingPaymentMethod ? 'edit' : 'add'}
                initialData={editingPaymentMethod}
            />

            <DeleteModal
                title="payment method"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default PaymentMtdView