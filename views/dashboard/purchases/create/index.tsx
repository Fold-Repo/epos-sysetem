'use client'

import { DashboardBreadCrumb } from '@/components'
import PurchaseForm from '../PurchaseForm'
import { useToast, useGoBack } from '@/hooks'
import { CreatePurchaseFormData, UpdatePurchaseFormData } from '@/types'
import { useCreatePurchase, transformPurchaseFormDataToPayload } from '@/services'
import { getErrorMessage } from '@/utils'

const CreatePurchaseView = () => {
    const goBack = useGoBack()

    const { mutateAsync: createPurchase, isPending } = useCreatePurchase()
    const { showError } = useToast()
    const handleSubmit = async (
        formData: CreatePurchaseFormData | UpdatePurchaseFormData
    ) => {
        const createData = formData as CreatePurchaseFormData

        try {

            const payload = transformPurchaseFormDataToPayload(createData)
            await createPurchase(payload)
            goBack()

        } catch (error) {
            showError(getErrorMessage(error))
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    { label: 'Create Purchase' }
                ]}
                title='Create Purchase'
            />

            <div className="p-3 space-y-2">
                <PurchaseForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create Purchase"
                    isLoading={isPending}
                />
            </div>
        </>
    )
}

export default CreatePurchaseView

