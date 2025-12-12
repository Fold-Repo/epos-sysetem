'use client'

import { DashboardBreadCrumb } from '@/components'
import TransferForm from '../TransferForm'
import { useToast, useGoBack } from '@/hooks'
import { CreateTransferFormData, UpdateTransferFormData } from '@/types'

const CreateTransferView = () => {
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()

    const handleSubmit = (formData: CreateTransferFormData | UpdateTransferFormData) => {
        const createData = formData as CreateTransferFormData
        console.log('Create transfer:', createData)
        showSuccess('Transfer created', 'Transfer created successfully.')
        // router.push('/dashboard/transfers')
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Transfers', href: '/dashboard/transfers' },
                    { label: 'Create Transfer' }
                ]}
                title='Create Transfer'
            />

            <div className="p-3 space-y-2">
                <TransferForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create Transfer"
                />
            </div>
        </>
    )
}

export default CreateTransferView

