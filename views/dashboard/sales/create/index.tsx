'use client'

import { DashboardBreadCrumb } from '@/components'
import SalesForm from '../SalesForm'
import { useToast, useGoBack } from '@/hooks'
import { CreateSaleFormData, UpdateSaleFormData } from '@/types'

const CreateSaleView = () => {
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()

    const handleSubmit = (formData: CreateSaleFormData | UpdateSaleFormData) => {
        const createData = formData as CreateSaleFormData
        console.log('Create sale:', createData)
        showSuccess('Sale created', 'Sale created successfully.')
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    { label: 'Create Sale' }
                ]}
                title='Create Sale'
            />

            <div className="p-3 space-y-2">
                <SalesForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create Sale"
                />
            </div>
        </>
    )
}

export default CreateSaleView

