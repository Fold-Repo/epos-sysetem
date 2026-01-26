'use client'

import { DashboardBreadCrumb } from '@/components'
import PurchaseReturnForm from '../PurchaseReturnForm'
import { useToast, useQueryParams } from '@/hooks'
import { CreatePurchaseReturnPayload } from '@/types'
import { useCreatePurchaseReturn } from '@/services'
import { getErrorMessage } from '@/utils'
import { useRouter } from 'next/navigation'

const CreatePurchaseReturnView = () => {
    const router = useRouter()
    const { searchParams } = useQueryParams()
    const purchaseId = searchParams.get('purchase_id') || undefined

    const { mutateAsync: createPurchaseReturn, isPending } = useCreatePurchaseReturn()
    const { showError } = useToast()
    
    const handleSubmit = async (payload: CreatePurchaseReturnPayload) => {
        try {
            await createPurchaseReturn(payload)
            router.push('/dashboard/purchase-returns')
        } catch (error) {
            showError(getErrorMessage(error))
        }
    }

    const handleCancel = () => {
        router.push('/dashboard/purchase-returns')
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Purchase Returns', href: '/dashboard/purchase-returns' },
                    { label: 'Create Return' }
                ]}
                title='Create Purchase Return'
            />

            <div className="p-3 space-y-2">
                <PurchaseReturnForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isPending}
                    initialPurchaseId={purchaseId}
                />
            </div>
        </>
    )
}

export default CreatePurchaseReturnView
