'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import { UpdateSaleFormData, CreateSaleFormData } from '@/types'
import { useParams } from 'next/navigation'
import SalesForm from '../SalesForm'
import { useGetSaleDetail, useUpdateSale, transformSaleFormDataToPayload } from '@/services'
import { useMemo } from 'react'

const EditSaleView = () => {

    const params = useParams()
    const saleId = params?.id as string
    const goBack = useGoBack()
    
    // ================================
    // FETCH SALE DETAILS
    // ================================
    const { data: sale, isLoading } = useGetSaleDetail(Number(saleId))
    const updateSaleMutation = useUpdateSale()

    // ================================
    // TRANSFORM SALE DATA TO FORM INITIAL DATA
    // ================================
    const initialData = useMemo(() => {
        if (!sale) return null

        const items = sale.items.map((item, index) => {
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
                taxType: item.tax.type as 'percent' | 'fixed',
                subtotal: parseFloat(item.subtotal),
                productType: item.variation ? 'Variation' as const : 'Simple' as const,
                saleItemId: item.id,
                ...(item.variation && {
                    variationId: item.variation.id,
                    variationType: item.variation.type,
                    variationValue: item.variation.value
                })
            }
        })

        return {
            id: sale.sale_id,
            reference: sale.reference,
            customerId: String(sale.customer.id),
            storeId: String(sale.store.id),
            status: sale.status.toLowerCase() as 'completed' | 'pending' | 'cancelled',
            paymentStatus: sale.payment.status.toLowerCase() as 'unpaid' | 'paid',
            paymentMethod: sale.payment.method?.id ? String(sale.payment.method.id) : '',
            grandTotal: parseFloat(sale.grand_total),
            created_at: sale.created_at,
            items: items,
            orderTax: sale.tax.amount,
            orderDiscount: sale.discount.amount,
            shipping: sale.shipping,
            orderTaxIsPercentage: sale.tax.type === 'percent',
            orderDiscountIsPercentage: sale.discount.type === 'percent',
            note: sale.note || ''
        }
    }, [sale])

    // ================================
    // HANDLE FORM SUBMIT
    // ================================
    const handleSubmit = (formData: CreateSaleFormData | UpdateSaleFormData) => {
        const payload = transformSaleFormDataToPayload(formData as CreateSaleFormData)
        
        updateSaleMutation.mutate(
            { id: Number(saleId), payload },
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
                        { label: 'Sales', href: '/dashboard/sales' },
                        { label: 'Edit Sale' }
                    ]}
                    title='Edit Sale'
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

    if (!sale || !initialData) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Sales', href: '/dashboard/sales' },
                        { label: 'Edit Sale' }
                    ]}
                    title='Edit Sale'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Sale not found
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
                    { label: 'Sales', href: '/dashboard/sales' },
                    { label: sale.reference, href: `/dashboard/sales/${saleId}` },
                    { label: 'Edit' }
                ]}
                title='Edit Sale'
            />

            <div className="p-3 space-y-2">
                <SalesForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    isLoading={updateSaleMutation.isPending}
                    submitButtonText="Update Sale"
                />
            </div>
        </>
    )
}

export default EditSaleView
