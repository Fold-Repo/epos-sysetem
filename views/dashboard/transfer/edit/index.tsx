'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useToast, useGoBack } from '@/hooks'
import { UpdateTransferFormData, CreateTransferFormData } from '@/types'
import { transfersData, productsData } from '@/data'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import TransferForm from '../TransferForm'

interface TransferItem {
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

const EditTransferView = () => {
    const params = useParams()
    const transferId = params?.id as string
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [initialData, setInitialData] = useState<any>(null)

    // =========================
    // LOAD MOCK DATA
    // =========================
    useEffect(() => {
        const mockTransfer = transfersData[0]
        
        if (mockTransfer) {
            const mockItems: TransferItem[] = productsData.slice(0, 3).map((product, index) => {
                const price = product.price || 0
                const discount = product.discount || 0
                const tax = product.tax || 0
                const quantity = index + 1
                const subtotal = price * quantity
                
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
                ...mockTransfer,
                fromStoreId: '1',
                toStoreId: '2',
                items: mockItems,
                orderTax: '10',
                orderDiscount: '50',
                shipping: '20',
                orderTaxIsPercentage: true,
                orderDiscountIsPercentage: false,
                status: 'sent',
                note: 'This is a mock transfer for editing purposes.'
            })
        }
        
        setIsLoading(false)
    }, [])

    const handleSubmit = (formData: CreateTransferFormData | UpdateTransferFormData) => {
        const updateData = formData as UpdateTransferFormData
        console.log('Update transfer:', updateData)
        showSuccess('Transfer updated', 'Transfer updated successfully.')
        // router.push('/dashboard/transfers')
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
                    { label: 'Transfers', href: '/dashboard/transfers' },
                    { label: 'Edit Transfer' }
                ]}
                title='Edit Transfer'
            />

            <div className="p-3 space-y-2">
                <TransferForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Update Transfer"
                />
            </div>
        </>
    )
}

export default EditTransferView
