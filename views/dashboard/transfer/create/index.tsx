'use client'

import { DashboardBreadCrumb } from '@/components'
import TransferForm from '../TransferForm'
import { useGoBack } from '@/hooks'
import { CreateTransferPayload } from '@/types'
import { useCreateTransfer } from '@/services'
import { getErrorMessage } from '@/utils'

const CreateTransferView = () => {
    const goBack = useGoBack()

    const { mutateAsync: createTransfer, isPending } = useCreateTransfer()

    const handleSubmit = async (formData: CreateTransferPayload) => {
        try {
            await createTransfer(formData)
            goBack()
        } catch (error) {
            console.error(getErrorMessage(error))
        }
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
                    isLoading={isPending}
                />
            </div>
        </>
    )
}

export default CreateTransferView