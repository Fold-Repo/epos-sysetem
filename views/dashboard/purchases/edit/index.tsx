'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useToast, useGoBack } from '@/hooks'
import { UpdatePurchaseFormData, CreatePurchaseFormData } from '@/types'
import { purchasesData, productsData } from '@/data'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PurchaseForm from '../PurchaseForm'

interface PurchaseItem {
    id: string
    productId: string
    name: string
    code: string
    stock: number
    unit: string
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    subtotal: number
}

const EditPurchaseView = () => {
    const params = useParams()
    const purchaseId = params?.id as string
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [initialData, setInitialData] = useState<any>(null)

    useEffect(() => {
        const mockPurchase = purchasesData[0]
        
        if (mockPurchase) {
            const mockItems: PurchaseItem[] = productsData.slice(0, 3).map((product, index) => {
                const price = product.price || 0
                const discount = product.discount || 0
                const tax = product.tax || 0
                const quantity = index + 1
                const itemPrice = price * quantity
                const discountAmount = (itemPrice * discount) / 100
                const taxAmount = (itemPrice * tax) / 100
                const subtotal = itemPrice - discountAmount + taxAmount
                
                return {
                    id: `item-${index}-${Date.now()}`,
                    productId: product.id,
                    name: product.name,
                    code: product.code,
                    stock: product.stock,
                    unit: product.unit,
                    quantity: quantity,
                    netUnitPrice: price,
                    discount: discount,
                    tax: tax,
                    subtotal: subtotal
                }
            })
            
            setInitialData({
                ...mockPurchase,
                items: mockItems,
                orderTax: '10',
                orderDiscount: '50',
                shipping: '20',
                orderTaxIsPercentage: true,
                orderDiscountIsPercentage: false,
                paymentMethod: 'bank_transfer',
                paymentAmount: '1000',
                note: 'This is a mock purchase for editing purposes.'
            })
        }
        
        setIsLoading(false)
    }, [])

    const handleSubmit = (formData: CreatePurchaseFormData | UpdatePurchaseFormData) => {
        const updateData = formData as UpdatePurchaseFormData
        console.log('Update purchase:', updateData)
        showSuccess('Purchase updated', 'Purchase updated successfully.')
    }

    if (isLoading) {
        return (
            <div className="p-3">
                <DashboardCard>
                    <div className="p-4 text-center">Loading...</div>
                </DashboardCard>
            </div>
        )
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    { label: 'Edit Purchase' }
                ]}
                title='Edit Purchase'
            />

            <div className="p-3 space-y-2">
                <PurchaseForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Update Purchase"
                />
            </div>
        </>
    )
}

export default EditPurchaseView

