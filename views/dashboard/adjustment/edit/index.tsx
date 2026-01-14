'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import { CreateAdjustmentFormData } from '@/types'
import { useParams } from 'next/navigation'
import AdjustmentForm from '../AdjustmentForm'
import { useGetAdjustmentDetail, useUpdateAdjustment, transformAdjustmentFormDataToPayload } from '@/services'
import { useMemo } from 'react'

const EditAdjustmentView = () => {

    const params = useParams()
    const adjustmentId = params?.id as string
    const goBack = useGoBack()
    
    // ================================
    // FETCH ADJUSTMENT DETAILS
    // ================================
    const { data: adjustment, isLoading } = useGetAdjustmentDetail(Number(adjustmentId))
    const updateAdjustmentMutation = useUpdateAdjustment()

    // ================================
    // TRANSFORM ADJUSTMENT DATA TO FORM INITIAL DATA
    // ================================
    const initialData = useMemo(() => {
        if (!adjustment) return null

        const items = adjustment.items.map((item, index) => {
            const itemName = item.variation_type
                ? `${item.product_name} - ${item.variation_type}: ${item.variation_value}`
                : item.product_name

            return {
                id: `item-${item.item_id}-${index}`,
                productId: String(item.product_id),
                name: itemName,
                code: item.variation_sku || item.product_sku,
                stock: 0,
                unit: '',
                quantity: item.quantity,
                type: item.item_type === 'positive' ? 'positive' as const : 'negative' as const,
                productType: item.variation_type ? 'Variation' as const : 'Simple' as const,
                ...(item.variation_id && {
                    variationId: item.variation_id,
                    variationType: item.variation_type,
                    variationValue: item.variation_value
                })
            }
        })

        // Format date from ISO string to YYYY-MM-DD
        const formattedDate = adjustment.date ? new Date(adjustment.date).toISOString().split('T')[0] : ''

        return {
            date: formattedDate,
            note: adjustment.note || '',
            items: items
        }
    }, [adjustment])

    // ================================
    // HANDLE FORM SUBMIT
    // ================================
    const handleSubmit = (formData: CreateAdjustmentFormData) => {
        const payload = transformAdjustmentFormDataToPayload(formData)
        
        updateAdjustmentMutation.mutate(
            { id: Number(adjustmentId), payload },
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
                        { label: 'Adjustments', href: '/dashboard/adjustments' },
                        { label: 'Edit Adjustment' }
                    ]}
                    title='Edit Adjustment'
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

    if (!adjustment || !initialData) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Adjustments', href: '/dashboard/adjustments' },
                        { label: 'Edit Adjustment' }
                    ]}
                    title='Edit Adjustment'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Adjustment not found
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
                    { label: 'Adjustments', href: '/dashboard/adjustments' },
                    { label: `Adjustment #${adjustment.adjustment_id}`, href: `/dashboard/adjustments/${adjustmentId}` },
                    { label: 'Edit' }
                ]}
                title='Edit Adjustment'
            />

            <div className="p-3 space-y-2">
                <AdjustmentForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    isLoading={updateAdjustmentMutation.isPending}
                    submitButtonText="Update Adjustment"
                />
            </div>
        </>
    )
}

export default EditAdjustmentView

