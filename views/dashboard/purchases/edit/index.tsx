'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import { UpdatePurchaseFormData, CreatePurchaseFormData } from '@/types'
import { useParams } from 'next/navigation'
import PurchaseForm from '../PurchaseForm'
import { useGetPurchaseDetail, useUpdatePurchase, transformPurchaseFormDataToPayload } from '@/services'
import { useMemo } from 'react'

const EditPurchaseView = () => {

    const params = useParams()
    const purchaseId = params?.id as string
    const goBack = useGoBack()
    
    // ================================
    // FETCH PURCHASE DETAILS
    // ================================
    const { data: purchase, isLoading } = useGetPurchaseDetail(Number(purchaseId))
    const updatePurchaseMutation = useUpdatePurchase()

    // ================================
    // TRANSFORM PURCHASE DATA TO FORM INITIAL DATA
    // ================================
    const initialData = useMemo(() => {
        if (!purchase) return null

        const items = purchase.items.map((item, index) => {
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
                ...(item.variation && {
                    variationId: item.variation.id,
                    variationType: item.variation.type,
                    variationValue: item.variation.value
                })
            }
        })

        return {
            id: purchase.purchase_id,
            reference: purchase.reference,
            supplierId: String(purchase.supplier.id),
            storeId: String(purchase.store.id),
            status: purchase.status.toLowerCase() as 'received' | 'pending' | 'orders',
            paymentStatus: purchase.payment.status.toLowerCase() as 'unpaid' | 'paid',
            paymentMethod: purchase.payment.method?.id ? String(purchase.payment.method.id) : '',
            grandTotal: parseFloat(purchase.grand_total),
            created_at: purchase.created_at,
            items: items,
            orderTax: purchase.tax.amount,
            orderDiscount: purchase.discount.amount,
            shipping: purchase.shipping,
            orderTaxIsPercentage: purchase.tax.type === 'percent',
            orderDiscountIsPercentage: purchase.discount.type === 'percent',
            purchaseDate: purchase.purchase_date.split('T')[0],
            note: purchase.note || ''
        }
    }, [purchase])

    // ================================
    // HANDLE FORM SUBMIT
    // ================================
    const handleSubmit = (formData: CreatePurchaseFormData | UpdatePurchaseFormData) => {
        const payload = transformPurchaseFormDataToPayload(formData as CreatePurchaseFormData)
        
        updatePurchaseMutation.mutate(
            { id: Number(purchaseId), payload },
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
                        { label: 'Purchases', href: '/dashboard/purchases' },
                        { label: 'Edit Purchase' }
                    ]}
                    title='Edit Purchase'
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

    if (!purchase || !initialData) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Purchases', href: '/dashboard/purchases' },
                        { label: 'Edit Purchase' }
                    ]}
                    title='Edit Purchase'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Purchase not found
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
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    { label: purchase.reference, href: `/dashboard/purchases/${purchaseId}` },
                    { label: 'Edit' }
                ]}
                title='Edit Purchase'
            />

            <div className="p-3 space-y-2">
                <PurchaseForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    isLoading={updatePurchaseMutation.isPending}
                    submitButtonText="Update Purchase"
                />
            </div>
        </>
    )
}

export default EditPurchaseView
