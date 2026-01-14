'use client'

import { DashboardCard, ProductSelect, Input, TextArea } from '@/components'
import { AdjustmentItemsTable, AdjustmentTableItem } from '@/views/dashboard/components'
import { useProductSelection, BaseProductItem } from '@/hooks'
import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { CreateAdjustmentFormData } from '@/types'

interface AdjustmentItem extends BaseProductItem {
    quantity: number
    type: 'positive' | 'negative'
    productType?: 'Simple' | 'Variation'
    variationId?: number
    variationType?: string
    variationValue?: string
}

interface AdjustmentFormProps {
    mode: 'create' | 'edit'
    initialData?: {
        date?: string
        note?: string
        items?: AdjustmentItem[]
    }
    onSubmit: (data: CreateAdjustmentFormData) => void
    onCancel: () => void
    isLoading?: boolean
    submitButtonText?: string
    cancelButtonText?: string
}

const AdjustmentForm = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText = 'Create Adjustment',
    cancelButtonText = 'Cancel'
}: AdjustmentFormProps) => {
    
    const [date, setDate] = useState('')
    const [note, setNote] = useState('')

    const { items: adjustmentItems, setItems, updateItem, deleteItem }
        = useProductSelection<AdjustmentItem>({
            products: [], 
            itemMapper: (product, id) => {
                // ================================
                // DETERMINE IF PRODUCT IS A VARIATION
                // ================================
                const isVariation = !!(product as any).variationId
                
                // ================================
                // DETERMINE ITEM NAME
                // ================================
                const itemName = isVariation && (product as any).variationValue
                    ? `${product.name} - ${(product as any).variationType}: ${(product as any).variationValue}`
                    : product.name
                
                // ================================
                // DETERMINE ITEM CODE
                // ================================
                const itemCode = isVariation && (product as any).variationSku
                    ? (product as any).variationSku
                    : product.code
                
                return {
                    id,
                    productId: product.id,
                    name: itemName,
                    code: itemCode,
                    stock: product.stock,
                    unit: product.unit,
                    quantity: 1,
                    type: 'positive' as const,
                    productType: isVariation ? 'Variation' : 'Simple',
                    variationId: (product as any).variationId,
                    variationType: (product as any).variationType,
                    variationValue: (product as any).variationValue
                }
            },
            duplicateErrorTitle: 'Product already added',
            duplicateErrorMessage: (productName) => `"${productName}" is already in the adjustment items list.`,
            onItemUpdate: (item, field) => {
                // No additional calculations needed for adjustments
                return {}
            }
        })

    // =========================
    // LOAD INITIAL DATA
    // =========================
    useEffect(() => {
        if (initialData) {
            setDate(initialData.date || '')
            setNote(initialData.note || '')
            if (initialData.items) {
                setItems(initialData.items)
            }
        } else {
            // Set default date to today
            const today = new Date().toISOString().split('T')[0]
            setDate(today)
        }
    }, [initialData, setItems])

    // =========================
    // HANDLE FORM SUBMIT
    // =========================
    const handleSubmit = () => {
        // =========================
        // VALIDATION
        // =========================
        if (adjustmentItems.length === 0) {
            return
        }

        if (!date) {
            return
        }

        // =========================
        // MAP ITEMS TO BACKEND FORMAT
        // =========================
        const adjustmentItemsData = adjustmentItems.map(item => ({
            product_id: parseInt(item.productId),
            quantity: item.quantity,
            type: item.type,
            ...(item.productType === 'Variation' && item.variationId && { variation_id: item.variationId })
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        const formData: CreateAdjustmentFormData = {
            date: date,
            note: note || undefined,
            items: adjustmentItemsData
        }

        onSubmit(formData)
    }

    const isSubmitDisabled = adjustmentItems.length === 0 || !date

    // =========================
    // MAP ITEMS TO TABLE FORMAT
    // =========================
    const tableItems: AdjustmentTableItem[] = adjustmentItems.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        type: item.type
    }))

    return (
        <DashboardCard bodyClassName='space-y-2'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 space-y-4">
                
                <ProductSelect
                    name="product"
                    label="Product"
                    placeholder="Search Product"
                    radius="lg"
                    inputSize="sm"
                    limit={20}
                    existingItems={adjustmentItems}
                    itemMapper={(product, id) => {
                        // ================================
                        // DETERMINE IF PRODUCT IS A VARIATION
                        // ================================
                        const isVariation = !!(product as any).variationId
                        
                        // ================================
                        // DETERMINE ITEM NAME
                        // ================================
                        const itemName = isVariation && (product as any).variationValue
                            ? `${product.name} - ${(product as any).variationType}: ${(product as any).variationValue}`
                            : product.name
                        
                        // ================================
                        // DETERMINE ITEM CODE
                        // ================================
                        const itemCode = isVariation && (product as any).variationSku
                            ? (product as any).variationSku
                            : product.code
                        
                        return {
                            id,
                            productId: product.id,
                            name: itemName,
                            code: itemCode,
                            stock: product.stock,
                            unit: product.unit,
                            quantity: 1,
                            type: 'positive' as const,
                            productType: isVariation ? 'Variation' : 'Simple',
                            variationId: (product as any).variationId,
                            variationType: (product as any).variationType,
                            variationValue: (product as any).variationValue
                        }
                    }}
                    onItemAdd={(item) => {
                        setItems(prev => [...prev, item])
                    }}
                />

                <Input 
                    name="date" 
                    label="Date" 
                    type="date"
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div>

            <TextArea
                name="note"
                label="Note"
                placeholder="Enter note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
            />

            {/* ============================== */}
            {/* ===== PRODUCT TABLE ===== */}
            {/* ============================== */}
            <AdjustmentItemsTable
                items={tableItems}
                onQuantityChange={(itemId, quantity) => updateItem(itemId, 'quantity', quantity)}
                onTypeChange={(itemId, type) => updateItem(itemId, 'type', type)}
                onDelete={deleteItem}
            />

            <div className="flex items-center gap-3 justify-end p-3">
                <Button 
                    onPress={onCancel} 
                    size='sm' 
                    color='danger' 
                    className='px-4 h-9'
                    isDisabled={isLoading}>
                    {cancelButtonText}
                </Button>

                <Button 
                    onPress={handleSubmit} 
                    size='sm' 
                    isDisabled={isSubmitDisabled || isLoading}
                    isLoading={isLoading}
                    className='px-4 bg-primary text-white h-9'>
                    {submitButtonText}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default AdjustmentForm

