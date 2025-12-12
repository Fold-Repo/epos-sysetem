'use client'

import { DashboardBreadCrumb } from '@/components'
import QuotationForm from '../QuotationForm'
import { useToast, useGoBack } from '@/hooks'
import { CreateQuotationFormData, UpdateQuotationFormData } from '@/types'

const CreateQuotationView = () => {
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()

    const handleSubmit = (formData: CreateQuotationFormData | UpdateQuotationFormData) => {
        // Type guard: in create mode, formData will always be CreateQuotationFormData
        const createData = formData as CreateQuotationFormData
        console.log('Create quotation:', createData)
        showSuccess('Quotation created', 'Quotation created successfully.')
        // router.push('/dashboard/quotations')
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Quotations', href: '/dashboard/quotations' },
                    { label: 'Create Quotation' }
                ]}
                title='Create Quotation'
            />

            <div className="p-3 space-y-2">
                <QuotationForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create Quotation"
                />
            </div>
        </>
    )
}

export default CreateQuotationView
