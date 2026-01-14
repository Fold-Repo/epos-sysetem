'use client'

import { DashboardCard, CustomAutocomplete, ProductSelect } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable, FormField } from '@/views/dashboard/components'
import { useProductSelection, BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect, useMemo } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreateSaleFormData, UpdateSaleFormData, SaleType } from '@/types'
import { useAppSelector, selectPaymentMethods, selectStores, selectCustomers } from '@/store'

interface SaleItem extends BaseProductItem {
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
    saleItemId?: number
}

interface SalesFormProps {
    mode: 'create' | 'edit'
    initialData?: SaleType & {
        items?: SaleItem[]
        storeId?: string
        orderTax?: string
        orderDiscount?: string
        shipping?: string
        orderTaxIsPercentage?: boolean
        orderDiscountIsPercentage?: boolean
        paymentMethod?: string
        note?: string
    }
    onSubmit: (data: CreateSaleFormData | UpdateSaleFormData) => void
    onCancel: () => void
    isLoading?: boolean
    submitButtonText?: string
    cancelButtonText?: string
}

const SalesForm = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText,
    cancelButtonText = 'Cancel'
}: SalesFormProps) => {
    
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
    const [selectedStoreId, setSelectedStoreId] = useState<string>('')
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState<'completed' | 'pending' | 'cancelled'>('pending')
    const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [note, setNote] = useState('')

    const { items: saleItems, setItems, updateItem, deleteItem }
        = useProductSelection<SaleItem>({
            products: [], 
            itemMapper: (product, id) => {
                const price = product.price || 0
                const discount = product.discount || 0
                const tax = product.tax || 0
                const taxType = (product as any).taxType || 'percent'
                const discountAmount = (price * discount) / 100
                
                // ================================
                // CALCULATE TAX AMOUNT
                // ================================
                const taxAmount = taxType === 'fixed' ? tax : (price * tax) / 100
                const initialSubtotal = price - discountAmount + taxAmount
                return {
                    id,
                    productId: product.id,
                    name: product.name,
                    code: product.code,
                    stock: product.stock,
                    unit: product.unit,
                    quantity: 1,
                    netUnitPrice: price,
                    discount: discount,
                    tax: tax,
                    taxType: taxType,
                    subtotal: initialSubtotal
                }
            },
            duplicateErrorTitle: 'Product already added',
            duplicateErrorMessage: (productName) => `"${productName}" is already in the sale items list.`,
            onItemUpdate: (item, field) => {
                if (field === 'quantity') {
                    const price = item.netUnitPrice * (item.quantity || 1)
                    const discountAmount = (price * item.discount) / 100

                    // ================================
                    // CALCULATE TAX AMOUNT
                    // ================================
                    const taxAmount = item.taxType === 'fixed' ? item.tax : (price * item.tax) / 100
                    const subtotal = price - discountAmount + taxAmount
                    return { subtotal } as Partial<SaleItem>
                }
                return {}
            }
        })

    // =========================
    // GET STORES, PAYMENT METHODS, AND CUSTOMERS FROM REDUX STATE
    // =========================
    const stores = useAppSelector(selectStores)
    const paymentMethods = useAppSelector(selectPaymentMethods)
    const customers = useAppSelector(selectCustomers)
    
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
    // PAYMENT METHOD OPTIONS
    // =========================
    const paymentMethodOptions = useMemo(() => {
        return paymentMethods.map(pm => ({ 
            value: String(pm.id), 
            label: pm.name.charAt(0).toUpperCase() + pm.name.slice(1) 
        }))
    }, [paymentMethods])

    // =========================
    // LOAD INITIAL DATA (EDIT MODE)
    // =========================
    useEffect(() => {
        if (initialData) {
            setSelectedCustomerId(initialData.customerId || '')
            setSelectedStoreId(initialData.storeId || '')
            setStatus(initialData.status || 'pending')
            setPaymentStatus(initialData.paymentStatus || 'unpaid')
            setPaymentMethod(initialData.paymentMethod || '')
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
    }, [initialData, setItems])

    // =========================
    // CALCULATE TOTALS
    // =========================
    const totals = useOrderTotals({
        items: saleItems,
        orderTax,
        orderDiscount,
        shipping,
        orderTaxIsPercentage,
        orderDiscountIsPercentage
    })

    // =========================
    // CONDITIONAL FIELD LOGIC
    // =========================
    const showPaymentMethod = paymentStatus === 'paid'

    const handleSubmit = () => {
        // =========================
        // VALIDATION
        // =========================
        if (saleItems.length === 0) {
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
        const saleItemsData = saleItems.map(item => ({
            product_id: parseInt(item.productId),
            ...(item.productType === 'Variation' && item.variationId && { variation_id: item.variationId }),
            quantity: item.quantity,
            net_unit_price: item.netUnitPrice,
            discount: item.discount,
            tax: item.tax,
            subtotal: item.subtotal,
            ...(item.saleItemId && { sale_item_id: String(item.saleItemId) })
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        const baseFormData: CreateSaleFormData = {
            store_id: selectedStoreId,
            customer_id: selectedCustomerId,
            sale_items: saleItemsData,
            order_tax: Number(orderTax || 0),
            order_discount: Number(orderDiscount || 0),
            shipping: Number(shipping || 0),
            status: status,
            payment_status: paymentStatus,
            payment_method: showPaymentMethod ? paymentMethod : undefined,
            note: note || '',
            grand_total: totals.grandTotal,
            order_tax_type: orderTaxIsPercentage ? 'percent' : 'fixed',
            order_discount_type: orderDiscountIsPercentage ? 'percent' : 'fixed'
        }
        
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdateSaleFormData = {
                ...baseFormData,
                sale_id: initialData.id
            }
            onSubmit(formData)
        } else {
            onSubmit(baseFormData)
        }
    }

    const isSubmitDisabled = saleItems.length === 0 || !selectedCustomerId || !selectedStoreId

    // =========================
    // BUILD FORM FIELDS ARRAY
    // =========================
    const formFields = [
        {
            name: 'order-tax',
            label: 'Order Tax',
            type: 'number' as const,
            placeholder: '0.00',
            value: orderTax,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLInputElement) {
                    setOrderTax(e.target.value)
                }
            },
            endSelectOptions: [
                { value: 'percentage', label: '%' },
                { value: 'fixed', label: getCurrencySymbol() }
            ],
            endSelectValue: orderTaxIsPercentage ? 'percentage' : 'fixed',
            onEndSelectChange: (value: string) => setOrderTaxIsPercentage(value === 'percentage'),
        },
        {
            name: 'order-discount',
            label: 'Order Discount',
            type: 'number' as const,
            placeholder: '0.00',
            value: orderDiscount,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLInputElement) {
                    setOrderDiscount(e.target.value)
                }
            },
            endSelectOptions: [
                { value: 'percentage', label: '%' },
                { value: 'fixed', label: getCurrencySymbol() }
            ],
            endSelectValue: orderDiscountIsPercentage ? 'percentage' : 'fixed',
            onEndSelectChange: (value: string) => setOrderDiscountIsPercentage(value === 'percentage'),
        },
        {
            name: 'shipping',
            label: 'Shipping',
            placeholder: '0.00',
            value: shipping,
            isCurrency: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target.value) {
                    setShipping(e.target.value)
                }
            },
            startContent: <span className="text-xs text-gray-600">{getCurrencySymbol()}</span>
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select' as const,
            value: status,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLSelectElement) {
                    setStatus(e.target.value as 'completed' | 'pending' | 'cancelled')
                }
            },
            options: [
                { value: '', label: 'Select Status' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'cancelled', label: 'Cancelled' }
            ]
        },
        {
            name: 'payment-status',
            label: 'Payment Status',
            type: 'select' as const,
            value: paymentStatus,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLSelectElement) {
                    setPaymentStatus(e.target.value as 'unpaid' | 'paid')
                }
            },
            options: [
                { value: '', label: 'Select Payment Status' },
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'paid', label: 'Paid' }
            ]
        },
        
        // ================================
        // SHOW PAYMENT METHOD
        // ================================
        ...(showPaymentMethod ? [{
            name: 'payment-method',
            label: 'Payment Method',
            type: 'select' as const,
            value: paymentMethod,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLSelectElement) {
                    setPaymentMethod(e.target.value)
                }
            },
            options: [
                { value: '', label: 'Select Payment Method' },
                ...paymentMethodOptions
            ]
        }] : []),
        
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea' as const,
            placeholder: 'Enter Notes',
            value: note,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLTextAreaElement) {
                    setNote(e.target.value)
                }
            },
            colSpan: 2,
            formGroupClass: 'col-span-2'
        }
    ]

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
                    existingItems={saleItems}
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
                            stock: product.stock,
                            unit: product.unit,
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
                items={saleItems}
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
                fields={formFields as FormField[]}
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
                    {submitButtonText || (mode === 'edit' ? 'Update Sale' : 'Create Sale')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default SalesForm
