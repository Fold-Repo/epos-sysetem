'use client'

import { DashboardBreadCrumb } from '@/components'
import QuotationForm from '../QuotationForm'
import { useGoBack } from '@/hooks'
import { CreateQuotationFormData, UpdateQuotationFormData } from '@/types'
import { useCreateQuotation, transformQuotationFormDataToPayload } from '@/services'
import { useRouter } from 'next/navigation'

const CreateQuotationView = () => {
    const goBack = useGoBack()
    const router = useRouter()
    const { mutate: createQuotation, isPending } = useCreateQuotation()

    const handleSubmit = (formData: CreateQuotationFormData | UpdateQuotationFormData) => {
        const payload = transformQuotationFormDataToPayload(formData as CreateQuotationFormData)
        
        createQuotation(payload, {
            onSuccess: () => {
                router.push('/dashboard/quotations')
            }
        })
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
                    isLoading={isPending}
                    submitButtonText="Create Quotation"
                />
            </div>
        </>
    )
}

export default CreateQuotationView
