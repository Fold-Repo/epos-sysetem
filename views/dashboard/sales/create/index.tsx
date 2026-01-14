'use client'

import { DashboardBreadCrumb } from '@/components'
import SalesForm from '../SalesForm'
import { useGoBack } from '@/hooks'
import { CreateSaleFormData, UpdateSaleFormData } from '@/types'
import { useCreateSale, transformSaleFormDataToPayload, useGetQuotationDetail } from '@/services'
import { getErrorMessage } from '@/utils'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const CreateSaleView = () => {
    const goBack = useGoBack()
    const searchParams = useSearchParams()
    const quotationId = searchParams.get('from_quotation')

    const { mutateAsync: createSale, isPending } = useCreateSale()
    const { data: quotation, isLoading: isLoadingQuotation } = useGetQuotationDetail(
        quotationId ? Number(quotationId) : 0
    )

    // ================================
    // TRANSFORM QUOTATION TO SALE INITIAL DATA
    // ================================
    const initialData = useMemo(() => {
        
        if (!quotation || !quotationId) return undefined

        const items = quotation.items.map((item, index) => {
            const itemName = item.variation
                ? `${item.product.name} - ${item.variation.type}: ${item.variation.value}`
                : item.product.name

            return {
                id: `item-${item.id}-${index}`,
                productId: String(item.product.id),
                name: itemName,
                code: item.variation?.sku || item.product.sku,
                stock: 0,
                unit: '',
                quantity: item.quantity,
                netUnitPrice: parseFloat(item.unit_cost),
                discount: parseFloat(item.discount),
                tax: parseFloat(item.tax.amount),
                taxType: (item.tax.type as 'percent' | 'fixed') || 'fixed',
                subtotal: parseFloat(item.subtotal),
                productType: item.variation ? 'Variation' as const : 'Simple' as const,
                ...(item.variation && {
                    variationId: item.variation.id,
                    variationType: item.variation.type,
                    variationValue: item.variation.value
                })
            }
        })

        return {
            id: undefined,
            reference: undefined,
            customerId: String(quotation.customer.id),
            storeId: String(quotation.store.id),
            status: 'pending' as const,
            paymentStatus: 'unpaid' as const,
            paymentMethod: '',
            grandTotal: parseFloat(quotation.grand_total),
            created_at: undefined,
            items: items,
            orderTax: quotation.tax.amount,
            orderDiscount: quotation.discount.amount,
            shipping: quotation.shipping,
            orderTaxIsPercentage: quotation.tax.type === 'percent',
            orderDiscountIsPercentage: quotation.discount.type === 'percent',
            note: quotation.note || ''
        }
    }, [quotation, quotationId])

    const handleSubmit = async (
        formData: CreateSaleFormData | UpdateSaleFormData
    ) => {
        const createData = formData as CreateSaleFormData

        try {
            const payload = transformSaleFormDataToPayload(createData)
            await createSale(payload)
            goBack()
        } catch (error) {
            console.error(getErrorMessage(error))
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    { label: 'Create Sale' }
                ]}
                title={quotationId ? 'Create Sale from Quotation' : 'Create Sale'}
            />

            <div className="p-3 space-y-2">
                <SalesForm
                    mode="create"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create Sale"
                    isLoading={isPending || isLoadingQuotation}
                />
            </div>
        </>
    )
}

export default CreateSaleView
