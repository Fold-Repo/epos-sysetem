'use client'

import { DashboardBreadCrumb } from '@/components'
import PurchaseForm from '../PurchaseForm'
import { useToast, useGoBack } from '@/hooks'
import { CreatePurchaseFormData, UpdatePurchaseFormData } from '@/types'

const CreatePurchaseView = () => {
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()

    const handleSubmit = (formData: CreatePurchaseFormData | UpdatePurchaseFormData) => {
        const createData = formData as CreatePurchaseFormData
        console.log('Create purchase:', createData)
        showSuccess('Purchase created', 'Purchase created successfully.')
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
                />
            </div>
        </>
    )
}

export default CreatePurchaseView

