'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import { UpdateQuotationFormData, CreateQuotationFormData } from '@/types'
import { useParams } from 'next/navigation'
import QuotationForm from '../QuotationForm'
import { useGetQuotationDetail, useUpdateQuotation, transformQuotationFormDataToPayload } from '@/services'
import { useMemo } from 'react'

const EditQuotationView = () => {

    const params = useParams()
    const quotationId = params?.id as string
    const goBack = useGoBack()
    
    // ================================
    // FETCH QUOTATION DETAILS
    // ================================
    const { data: quotation, isLoading } = useGetQuotationDetail(Number(quotationId))
    const updateQuotationMutation = useUpdateQuotation()

    // ================================
    // TRANSFORM QUOTATION DATA TO FORM INITIAL DATA
    // ================================
    const initialData = useMemo(() => {
        if (!quotation) return null

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
                quotationItemId: item.id,
                ...(item.variation && {
                    variationId: item.variation.id,
                    variationType: item.variation.type,
                    variationValue: item.variation.value
                })
            }
        })

        return {
            id: quotation.quotation_id,
            reference: quotation.reference,
            customerId: String(quotation.customer.id),
            storeId: String(quotation.store.id),
            status: quotation.status.toLowerCase(),
            grandTotal: parseFloat(quotation.grand_total),
            created_at: quotation.created_at,
            items: items,
            orderTax: quotation.tax.amount,
            orderDiscount: quotation.discount.amount,
            shipping: quotation.shipping,
            orderTaxIsPercentage: quotation.tax.type === 'percent',
            orderDiscountIsPercentage: quotation.discount.type === 'percent',
            note: quotation.note || ''
        }
    }, [quotation])

    // ================================
    // HANDLE FORM SUBMIT
    // ================================
    const handleSubmit = (formData: CreateQuotationFormData | UpdateQuotationFormData) => {
        const payload = transformQuotationFormDataToPayload(formData as CreateQuotationFormData)
        
        updateQuotationMutation.mutate(
            { id: Number(quotationId), payload },
            {
                onSuccess: () => {
                    goBack()
                }
            }
        )
    }

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Quotations', href: '/dashboard/quotations' },
                        { label: 'Edit Quotation' }
                    ]}
                    title='Edit Quotation'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    if (!quotation || !initialData) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Quotations', href: '/dashboard/quotations' },
                        { label: 'Edit Quotation' }
                    ]}
                    title='Edit Quotation'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Quotation not found
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Quotations', href: '/dashboard/quotations' },
                    { label: quotation.reference, href: `/dashboard/quotations/${quotationId}` },
                    { label: 'Edit' }
                ]}
                title='Edit Quotation'
            />

            <div className="p-3 space-y-2">
                <QuotationForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    isLoading={updateQuotationMutation.isPending}
                    submitButtonText="Update Quotation"
                />
            </div>
        </>
    )
}

export default EditQuotationView
