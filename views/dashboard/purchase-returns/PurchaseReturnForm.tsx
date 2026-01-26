'use client'

import { DashboardCard, ProductSelect } from '@/components'
import { OrderItemsTable } from '@/views/dashboard/components'
import { TextArea, Button } from '@/components/ui'
import { useProductSelection, BaseProductItem } from '@/hooks'
import { useState, useEffect, useMemo } from 'react'
import { formatCurrency } from '@/lib'
import { CreatePurchaseReturnPayload } from '@/types'
import { useGetPurchaseDetail } from '@/services'

interface PurchaseReturnItem extends BaseProductItem {
    quantity: number
    maxQuantity?: number
    netUnitPrice: number
    discount: number
    tax: number
    taxType?: 'percent' | 'fixed'
    subtotal: number
    variationId?: number
    productType?: 'Simple' | 'Variation'
    variationType?: string
    variationValue?: string
    purchaseItemId?: number
}

interface PurchaseReturnFormProps {
    onSubmit: (data: CreatePurchaseReturnPayload) => void
    onCancel: () => void
    isLoading?: boolean
    initialPurchaseId?: string
}

const PurchaseReturnForm = ({
    onSubmit,
    onCancel,
    isLoading = false,
    initialPurchaseId
}: PurchaseReturnFormProps) => {
    
    const [reason, setReason] = useState('')

    // =========================
    // FETCH PURCHASE DETAIL IF PURCHASE ID PROVIDED
    // =========================
    const { data: purchaseDetail, isLoading: isLoadingPurchase } = useGetPurchaseDetail(
        initialPurchaseId ? Number(initialPurchaseId) : undefined
    )

    const { items: returnItems, setItems, updateItem, deleteItem } = useProductSelection<PurchaseReturnItem>({
        products: [],
        itemMapper: (product, id) => {
            const isVariation = !!(product as any).variationId
            const price = product.price || 0
            
            const itemName = isVariation && (product as any).variationValue
                ? `${product.name} - ${(product as any).variationType}: ${(product as any).variationValue}`
                : product.name
            
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
                netUnitPrice: price,
                discount: 0,
                tax: 0,
                taxType: 'percent' as const,
                subtotal: price,
                productType: isVariation ? 'Variation' : 'Simple',
                ...(isVariation && {
                    variationId: (product as any).variationId,
                    variationType: (product as any).variationType,
                    variationValue: (product as any).variationValue
                })
            }
        },
        duplicateErrorTitle: 'Product already added',
        duplicateErrorMessage: (productName) => `"${productName}" is already in the return items list.`,
        onItemUpdate: (item, field) => {
            if (field === 'quantity') {
                const maxQty = (item as PurchaseReturnItem).maxQuantity
                const qty = maxQty 
                    ? Math.min(Math.max(1, item.quantity || 1), maxQty)
                    : Math.max(1, item.quantity || 1)
                const subtotal = item.netUnitPrice * qty
                return { quantity: qty, subtotal } as Partial<PurchaseReturnItem>
            }
            return {}
        }
    })

    // =========================
    // POPULATE ITEMS FROM PURCHASE DETAIL
    // =========================
    useEffect(() => {
        if (purchaseDetail && purchaseDetail.items) {
            const items: PurchaseReturnItem[] = purchaseDetail.items.map((item, index) => {
                const itemName = item.variation
                    ? `${item.product.name} - ${item.variation.type}: ${item.variation.value}`
                    : item.product.name
                
                const itemCode = item.variation?.sku || item.product.sku
                const originalQuantity = item.quantity
                
                return {
                    id: `item-${item.id}-${index}`,
                    productId: String(item.product.id),
                    name: itemName,
                    code: itemCode,
                    stock: 0,
                    unit: '',
                    quantity: originalQuantity,
                    maxQuantity: originalQuantity,
                    netUnitPrice: parseFloat(item.unit_cost),
                    discount: parseFloat(item.discount),
                    tax: parseFloat(item.tax.amount),
                    taxType: item.tax.type as 'percent' | 'fixed',
                    subtotal: parseFloat(item.unit_cost) * originalQuantity,
                    productType: item.variation ? 'Variation' : 'Simple',
                    purchaseItemId: item.id,
                    ...(item.variation && {
                        variationId: item.variation.id,
                        variationType: item.variation.type,
                        variationValue: item.variation.value
                    })
                }
            })
            setItems(items)
        }
    }, [purchaseDetail, setItems])

    // =========================
    // GET ITEMS WITH QUANTITY > 0
    // =========================
    const selectedItems = useMemo(() => {
        return returnItems.filter(item => item.quantity >= 1)
    }, [returnItems])

    // =========================
    // HANDLE FORM SUBMISSION
    // =========================
    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            return
        }

        if (!initialPurchaseId || !purchaseDetail || !reason.trim()) {
            return
        }

        const payload: CreatePurchaseReturnPayload = {
            purchase_id: Number(initialPurchaseId),
            reason: reason.trim(),
            store_id: purchaseDetail.store.id,
            items: selectedItems.map(item => ({
                product_id: Number(item.productId),
                quantity: item.quantity,
                ...(item.productType === 'Variation' && item.variationId && { variation_id: item.variationId })
            }))
        }

        onSubmit(payload)
    }

    const isSubmitDisabled = selectedItems.length === 0 || !initialPurchaseId || !purchaseDetail || !reason.trim() || isLoadingPurchase

    // =========================
    // LOADING STATE
    // =========================
    if (isLoadingPurchase) {
        return (
            <DashboardCard bodyClassName='space-y-2'>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </DashboardCard>
        )
    }

    if (!initialPurchaseId || !purchaseDetail) {
        return (
            <DashboardCard bodyClassName='space-y-2'>
                <div className="text-center py-8">
                    <p className="text-gray-500">Please select a purchase to create a return.</p>
                </div>
            </DashboardCard>
        )
    }

    return (
        <DashboardCard bodyClassName='space-y-2'>
            {/* ============================== */}
            {/* ===== PRODUCT SELECT (TOP START) ===== */}
            {/* ============================== */}
            <div className="w-full md:w-1/3">
                <ProductSelect
                    name="product"
                    label="Product"
                    placeholder="Search Product"
                    radius="lg"
                    inputSize="sm"
                    limit={20}
                    existingItems={returnItems}
                    itemMapper={(product, id) => {
                        const isVariation = !!(product as any).variationId
                        const price = product.price || 0
                        
                        const itemName = isVariation && (product as any).variationValue
                            ? `${product.name} - ${(product as any).variationType}: ${(product as any).variationValue}`
                            : product.name
                        
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
                            netUnitPrice: price,
                            discount: 0,
                            tax: 0,
                            taxType: 'percent' as const,
                            subtotal: price,
                            productType: isVariation ? 'Variation' : 'Simple',
                            ...(isVariation && {
                                variationId: (product as any).variationId,
                                variationType: (product as any).variationType,
                                variationValue: (product as any).variationValue
                            })
                        }
                    }}
                    onItemAdd={(item) => {
                        setItems(prev => [...prev, item])
                    }}
                />
            </div>

            {/* ============================== */}
            {/* ===== PRODUCT TABLE ===== */}
            {/* ============================== */}
            <OrderItemsTable
                items={returnItems}
                onQuantityChange={(itemId, quantity) => updateItem(itemId, 'quantity', quantity)}
                onDelete={deleteItem}
                hideStock={true}
            />

            {/* ============================== */}
            {/* ===== REASON (BOTTOM) ===== */}
            {/* ============================== */}
            <div>
                <TextArea
                    name="reason"
                    label="Reason"
                    placeholder="Enter reason for return"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                />
            </div>

            <div className="flex items-center gap-3 justify-end p-3">
                <Button 
                    onPress={onCancel} 
                    size='sm' 
                    color='danger' 
                    className='px-4 h-9'
                    isDisabled={isLoading}>
                    Cancel
                </Button>

                <Button 
                    onPress={handleSubmit} 
                    size='sm' 
                    isDisabled={isSubmitDisabled || isLoading}
                    isLoading={isLoading}
                    className='px-4 bg-primary text-white h-9'>
                    Create Return
                </Button>
            </div>
        </DashboardCard>
    )
}

export default PurchaseReturnForm
