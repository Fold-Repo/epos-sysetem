'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import { CreateTransferPayload, UpdateTransferPayload } from '@/types'
import { useParams } from 'next/navigation'
import TransferForm from '../TransferForm'
import { useGetTransferDetail, useUpdateTransfer } from '@/services'
import { useMemo } from 'react'

const EditTransferView = () => {

    const params = useParams()
    const transferId = params?.id as string
    const goBack = useGoBack()
    
    // ================================
    // FETCH TRANSFER DETAILS
    // ================================
    const { data: transfer, isLoading } = useGetTransferDetail(Number(transferId))
    const updateTransferMutation = useUpdateTransfer()

    // ================================
    // TRANSFORM TRANSFER DATA TO FORM INITIAL DATA
    // ================================
    const initialData = useMemo(() => {
        if (!transfer) return null

        return {
            from_store_id: transfer.from_store_id,
            to_store_id: transfer.to_store_id,
            product_id: transfer.product_id,
            quantity: transfer.quantity,
            variation_id: transfer.variation_id,
            status: transfer.status,
            notes: transfer.notes
        }
    }, [transfer])

    // ================================
    // HANDLE FORM SUBMIT
    // ================================
    const handleSubmit = (formData: CreateTransferPayload | UpdateTransferPayload) => {
        const payload: UpdateTransferPayload = {
            from_store_id: formData.from_store_id,
            to_store_id: formData.to_store_id,
            product_id: formData.product_id,
            quantity: formData.quantity,
            variation_id: formData.variation_id,
            status: formData.status,
            notes: formData.notes
        }
        
        updateTransferMutation.mutate(
            { id: Number(transferId), payload },
            {
                onSuccess: () => {
                    goBack()
                }
            }
        )
    }

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Transfers', href: '/dashboard/transfers' },
                        { label: 'Edit Transfer' }
                    ]}
                    title='Edit Transfer'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    if (!transfer || !initialData) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Transfers', href: '/dashboard/transfers' },
                        { label: 'Edit Transfer' }
                    ]}
                    title='Edit Transfer'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Transfer not found
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Transfers', href: '/dashboard/transfers' },
                    { label: `Transfer #${transfer.transfer_id}`, href: `/dashboard/transfers/${transferId}` },
                    { label: 'Edit' }
                ]}
                title='Edit Transfer'
            />

            <div className="p-3 space-y-2">
                <TransferForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    isLoading={updateTransferMutation.isPending}
                    submitButtonText="Update Transfer"
                />
            </div>
        </>
    )
}

export default EditTransferView