'use client'

import { DashboardBreadCrumb } from '@/components'
import SaleReturnForm from '../SaleReturnForm'
import { useToast, useQueryParams } from '@/hooks'
import { CreateSaleReturnPayload } from '@/types'
import { useCreateSaleReturn } from '@/services'
import { getErrorMessage } from '@/utils'
import { useRouter } from 'next/navigation'

const CreateSaleReturnView = () => {
    const router = useRouter()
    const { searchParams } = useQueryParams()
    const saleId = searchParams.get('sale_id') || undefined

    const { mutateAsync: createSaleReturn, isPending } = useCreateSaleReturn()
    const { showError } = useToast()
    
    const handleSubmit = async (payload: CreateSaleReturnPayload) => {
        try {
            await createSaleReturn(payload)
            router.push('/dashboard/sale-returns')
        } catch (error) {
            showError(getErrorMessage(error))
        }
    }

    const handleCancel = () => {
        router.push('/dashboard/sale-returns')
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Sales Returns', href: '/dashboard/sale-returns' },
                    { label: 'Create Return' }
                ]}
                title='Create Sales Return'
            />

            <div className="p-3 space-y-2">
                <SaleReturnForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isPending}
                    initialSaleId={saleId}
                />
            </div>
        </>
    )
}

export default CreateSaleReturnView
