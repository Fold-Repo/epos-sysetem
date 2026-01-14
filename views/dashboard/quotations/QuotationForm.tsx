'use client'

import { DashboardCard, CustomAutocomplete, ProductSelect } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable } from '@/views/dashboard/components'
import { BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect, useMemo } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreateQuotationFormData, UpdateQuotationFormData, QuotationType } from '@/types'
import { useAppSelector, selectCustomers, selectStores } from '@/store'

interface QuotationItem extends BaseProductItem {
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    taxType?: 'percent' | 'fixed'
    subtotal: number
    productType?: 'Simple' | 'Variation'
    variationId?: number
    variationType?: string
    variationValue?: string
    quotationItemId?: number
}

interface QuotationFormProps {
    mode: 'create' | 'edit'
    initialData?: QuotationType & {
        items?: QuotationItem[]
        storeId?: string
        orderTax?: string
        orderDiscount?: string
        shipping?: string
        orderTaxIsPercentage?: boolean
        orderDiscountIsPercentage?: boolean
        note?: string
    }
    onSubmit: (data: CreateQuotationFormData | UpdateQuotationFormData) => void
    onCancel: () => void
    isLoading?: boolean
    submitButtonText?: string
    cancelButtonText?: string
}

const QuotationForm = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText,
    cancelButtonText = 'Cancel'
}: QuotationFormProps) => {
    
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
    const [selectedStoreId, setSelectedStoreId] = useState<string>('')
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState('draft')
    const [note, setNote] = useState('')
    const [quotationItems, setItems] = useState<QuotationItem[]>([])

    // =========================
    // UPDATE ITEM
    // =========================
    const updateItem = (itemId: string, field: keyof QuotationItem, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const updated = { ...item, [field]: value }
                
                // =========================
                // AUTO-CALCULATE SUBTOTAL
                // =========================
                if (field === 'quantity' || field === 'netUnitPrice' || field === 'discount' || field === 'tax' || field === 'taxType') {
                    const price = updated.netUnitPrice * (updated.quantity || 1)
                    const discountAmount = (price * updated.discount) / 100
                    
                    // ================================
                    // CALCULATE TAX AMOUNT
                    // ================================
                    const taxAmount = updated.taxType === 'fixed' ? updated.tax : (price * updated.tax) / 100
                    const subtotal = price - discountAmount + taxAmount
                    return { ...updated, subtotal }
                }
                
                return updated
            }
            return item
        }))
    }

    // =========================
    // DELETE ITEM
    // =========================
    const deleteItem = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId))
    }

    // =========================
    // GET CUSTOMERS AND STORES FROM REDUX STATE
    // =========================
    const customers = useAppSelector(selectCustomers)
    const stores = useAppSelector(selectStores)
    
    // =========================
    // CUSTOMER OPTIONS
    // =========================
    const customerOptions = useMemo(() => {
        return customers
            .filter(c => (c.customer_id !== undefined || c.id !== undefined))
            .map(c => ({ 
                value: String(c.customer_id || c.id), 
                label: c.name 
            }))
    }, [customers])

    // =========================
    // STORE OPTIONS
    // =========================
    const storeOptions = useMemo(() => {
        return stores
            .filter(s => s.store_id !== undefined)
            .map(s => ({ value: String(s.store_id), label: s.name }))
    }, [stores])

    // =========================
    // LOAD INITIAL DATA (EDIT MODE)
    // =========================
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setSelectedCustomerId(initialData.customerId || '')
            setSelectedStoreId(initialData.storeId || '')
            setStatus(initialData.status || 'draft')
            setOrderTax(initialData.orderTax || '')
            setOrderTaxIsPercentage(initialData.orderTaxIsPercentage ?? true)
            setOrderDiscount(initialData.orderDiscount || '')
            setOrderDiscountIsPercentage(initialData.orderDiscountIsPercentage ?? false)
            setShipping(initialData.shipping || '')
            setNote(initialData.note || '')
            
            if (initialData.items) {
                setItems(initialData.items)
            }
        }
    }, [mode, initialData, setItems])

    // =========================
    // CALCULATE TOTALS
    // =========================
    const totals = useOrderTotals({
        items: quotationItems,
        orderTax,
        orderDiscount,
        shipping,
        orderTaxIsPercentage,
        orderDiscountIsPercentage
    })

    const handleSubmit = () => {
        // =========================
        // VALIDATION
        // =========================
        if (quotationItems.length === 0) {
            return
        }

        if (!selectedCustomerId) {
            return
        }

        if (!selectedStoreId) {
            return
        }

        // =========================
        // MAP ITEMS TO BACKEND FORMAT
        // =========================
        const quotationItemsData = quotationItems.map(item => ({
            product_id: parseInt(item.productId),
            quantity: item.quantity,
            net_unit_price: item.netUnitPrice,
            discount: item.discount,
            tax: item.tax,
            subtotal: item.subtotal,
            ...(item.variationId && { variation_id: item.variationId }),
            ...(mode === 'edit' && item.quotationItemId && { quotation_item_id: String(item.quotationItemId) })
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        const baseFormData: CreateQuotationFormData = {
            store_id: selectedStoreId,
            customer_id: selectedCustomerId,
            quotation_items: quotationItemsData,
            order_tax: Number(orderTax || 0),
            order_discount: Number(orderDiscount || 0),
            shipping: Number(shipping || 0),
            status: status,
            note: note || '',
            grand_total: totals.grandTotal,
            order_tax_type: orderTaxIsPercentage ? 'percent' : 'fixed',
            order_discount_type: orderDiscountIsPercentage ? 'percent' : 'fixed'
        }
        
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdateQuotationFormData = {
                ...baseFormData,
                quotation_id: initialData.id
            }
            onSubmit(formData)
        } else {
            onSubmit(baseFormData)
        }
    }

    const isSubmitDisabled = quotationItems.length === 0 || !selectedCustomerId || !selectedStoreId

    return (
        <DashboardCard bodyClassName='space-y-2'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 space-y-4">
                
                <ProductSelect
                    name="product"
                    label="Product"
                    placeholder="Search Product"
                    radius="lg"
                    inputSize="sm"
                    limit={20}
                    existingItems={quotationItems}
                    itemMapper={(product, id) => {
                        // ================================
                        // DETERMINE IF PRODUCT IS A VARIATION
                        // ================================
                        const isVariation = !!(product as any).variationId
                        const price = product.price || 0
                        const discount = product.discount || 0
                        const tax = (product as any).tax || product.tax || 0
                        const taxType = (product as any).taxType || 'percent'
                        
                        const taxAmount = taxType === 'fixed' ? tax : (price * tax) / 100
                        const discountAmount = (price * discount) / 100
                        const initialSubtotal = price - discountAmount + taxAmount
                        
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
                            quantity: 1,
                            netUnitPrice: price,
                            discount: discount,
                            tax: tax,
                            taxType: taxType,
                            subtotal: initialSubtotal,
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

                <CustomAutocomplete
                    name="customer"
                    label="Customer"
                    placeholder="Choose Customer"
                    radius="lg"
                    inputSize="sm"
                    options={customerOptions}
                    value={selectedCustomerId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setSelectedCustomerId(value)
                        }
                    }}
                />

                <CustomAutocomplete
                    name="store"
                    label="Store"
                    placeholder="Choose Store"
                    radius="lg"
                    inputSize="sm"
                    options={storeOptions}
                    value={selectedStoreId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setSelectedStoreId(value)
                        }
                    }}
                />
            </div>

            {/* ============================== */}
            {/* ===== PRODUCT TABLE===== */}
            {/* ============================== */}
            <OrderItemsTable
                items={quotationItems}
                onQuantityChange={(itemId, quantity) => updateItem(itemId, 'quantity', quantity)}
                onDelete={deleteItem}
                hideStock={true}
            />

            {/* ============================== */}
            {/* ===== SUMMARY BOX ===== */}
            {/* ============================== */}
            <SummaryBox
                items={[
                    {
                        label: 'Order Tax',
                        value: `${formatCurrency(totals.orderTaxAmount)} (${Number(orderTax) || 0}${orderTaxIsPercentage ? '%' : ''})`
                    },
                    {
                        label: 'Discount',
                        value: `${formatCurrency(totals.orderDiscount)} (${Number(orderDiscount) || 0}${orderDiscountIsPercentage ? '%' : ''})`
                    },
                    {
                        label: 'Shipping',
                        value: totals.shipping
                    },
                    {
                        label: 'Grand Total',
                        value: totals.grandTotal,
                        isTotal: true
                    }
                ]}
            />

            {/* ============================== */}
            {/* ===== FORM FIELDS GRID ===== */}
            {/* ============================== */}
            <FormFieldsGrid
                columns={4}
                fields={[
                    {
                        name: 'order-tax',
                        label: 'Order Tax',
                        type: 'number',
                        placeholder: '0.00',
                        value: orderTax,
                        onChange: (e) => setOrderTax(e.target.value),
                        endSelectOptions: [
                            { value: 'percentage', label: '%' },
                            { value: 'fixed', label: getCurrencySymbol() }
                        ],
                        endSelectValue: orderTaxIsPercentage ? 'percentage' : 'fixed',
                        onEndSelectChange: (value) => setOrderTaxIsPercentage(value === 'percentage'),
                    },
                    {
                        name: 'order-discount',
                        label: 'Order Discount',
                        type: 'number',
                        placeholder: '0.00',
                        value: orderDiscount,
                        onChange: (e) => setOrderDiscount(e.target.value),
                        endSelectOptions: [
                            { value: 'percentage', label: '%' },
                            { value: 'fixed', label: getCurrencySymbol() }
                        ],
                        endSelectValue: orderDiscountIsPercentage ? 'percentage' : 'fixed',
                        onEndSelectChange: (value) => setOrderDiscountIsPercentage(value === 'percentage'),
                    },
                    {
                        name: 'shipping',
                        label: 'Shipping',
                        type: 'number',
                        placeholder: '0.00',
                        value: shipping,
                        isCurrency: true,
                        onChange: (e) => setShipping(e.target.value),
                        startContent: <span className="text-xs text-gray-600">{getCurrencySymbol()}</span>
                    },
                    {
                        name: 'status',
                        label: 'Status',
                        type: 'select',
                        value: status,
                        onChange: (e) => setStatus(e.target.value),
                        options: [
                            { value: 'draft', label: 'Draft' },
                            { value: 'sent', label: 'Sent' },
                            { value: 'approved', label: 'Approved' },
                            { value: 'rejected', label: 'Rejected' }
                        ]
                    },
                    {
                        name: 'notes',
                        label: 'Notes',
                        type: 'textarea',
                        placeholder: 'Enter Notes',
                        value: note,
                        onChange: (e) => setNote(e.target.value),
                        colSpan: 2,
                        formGroupClass: 'col-span-2'
                    }
                ]}
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
                    isLoading={isLoading}
                    isDisabled={isSubmitDisabled}
                    className='px-4 bg-primary text-white h-9'>
                    {submitButtonText || (mode === 'edit' ? 'Update Quotation' : 'Create Quotation')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default QuotationForm

