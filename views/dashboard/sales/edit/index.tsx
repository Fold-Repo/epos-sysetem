'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useToast, useGoBack } from '@/hooks'
import { UpdateSaleFormData, CreateSaleFormData } from '@/types'
import { salesData, productsData } from '@/data'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SalesForm from '../SalesForm'

interface SaleItem {
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

const EditSaleView = () => {
    const params = useParams()
    const saleId = params?.id as string
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [initialData, setInitialData] = useState<any>(null)

    useEffect(() => {
        const mockSale = salesData[0]
        
        if (mockSale) {
            const mockItems: SaleItem[] = productsData.slice(0, 3).map((product, index) => {
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
                ...mockSale,
                items: mockItems,
                orderTax: '10',
                orderDiscount: '50',
                shipping: '20',
                orderTaxIsPercentage: true,
                orderDiscountIsPercentage: false,
                payments: [
                    {
                        id: `payment-${Date.now()}`,
                        date: '2024-01-15',
                        reference: 'PAY-001',
                        amount: '1000',
                        paymentType: 'cash'
                    }
                ],
                note: 'This is a mock sale for editing purposes.'
            })
        }
        
        setIsLoading(false)
    }, [])

    const handleSubmit = (formData: CreateSaleFormData | UpdateSaleFormData) => {
        const updateData = formData as UpdateSaleFormData
        console.log('Update sale:', updateData)
        showSuccess('Sale updated', 'Sale updated successfully.')
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
                    { label: 'Sales', href: '/dashboard/sales' },
                    { label: 'Edit Sale' }
                ]}
                title='Edit Sale'
            />

            <div className="p-3 space-y-2">
                <SalesForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Update Sale"
                />
            </div>
        </>
    )
}

export default EditSaleView

