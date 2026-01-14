'use client'

import { DashboardBreadCrumb } from '@/components'
import AdjustmentForm from '../AdjustmentForm'
import { useGoBack } from '@/hooks'
import { CreateAdjustmentFormData } from '@/types'
import { useCreateAdjustment, transformAdjustmentFormDataToPayload } from '@/services'
import { getErrorMessage } from '@/utils'

const CreateAdjustmentView = () => {
    const goBack = useGoBack()

    const { mutateAsync: createAdjustment, isPending } = useCreateAdjustment()

    const handleSubmit = async (formData: CreateAdjustmentFormData) => {
        try {
            const payload = transformAdjustmentFormDataToPayload(formData)
            await createAdjustment(payload)
            goBack()
        } catch (error) {
            console.error(getErrorMessage(error))
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Adjustments', href: '/dashboard/adjustments' },
                    { label: 'Create Adjustment' }
                ]}
                title='Create Adjustment'
            />

            <div className="p-3 space-y-2">
                <AdjustmentForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create Adjustment"
                    isLoading={isPending}
                />
            </div>
        </>
    )
}

export default CreateAdjustmentView
