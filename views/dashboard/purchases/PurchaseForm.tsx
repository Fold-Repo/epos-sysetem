'use client'

import { DashboardCard, CustomAutocomplete } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable, FormField } from '@/views/dashboard/components'
import { productsData, suppliersData } from '@/data'
import { useProductSelection, BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreatePurchaseFormData, UpdatePurchaseFormData, PurchaseType } from '@/types'

interface PurchaseItem extends BaseProductItem {
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    subtotal: number
}

interface PurchaseFormProps {
    mode: 'create' | 'edit'
    initialData?: PurchaseType & {
        items?: PurchaseItem[]
        orderTax?: string
        orderDiscount?: string
        shipping?: string
        orderTaxIsPercentage?: boolean
        orderDiscountIsPercentage?: boolean
        paymentMethod?: string
        paymentAmount?: string
        note?: string
    }
    onSubmit: (data: CreatePurchaseFormData | UpdatePurchaseFormData) => void
    onCancel: () => void
    isLoading?: boolean
    submitButtonText?: string
    cancelButtonText?: string
}

const PurchaseForm = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText,
    cancelButtonText = 'Cancel'
}: PurchaseFormProps) => {
    
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState<'received' | 'pending' | 'orders'>('pending')
    const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid' | 'partial'>('unpaid')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')
    const [note, setNote] = useState('')

    const { selectedProductId, items: purchaseItems, setItems,
        clearItems,
        handleProductSelect, updateItem, deleteItem, productOptions }
        = useProductSelection<PurchaseItem>({
            products: productsData,
            itemMapper: (product, id) => {
                const price = product.price || 0
                const discount = product.discount || 0
                const tax = product.tax || 0
                const discountAmount = (price * discount) / 100
                const taxAmount = (price * tax) / 100
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
                    subtotal: initialSubtotal
                }
            },
            duplicateErrorTitle: 'Product already added',
            duplicateErrorMessage: (productName) => `"${productName}" is already in the purchase items list.`,
            onItemUpdate: (item, field) => {
                if (field === 'quantity') {
                    const price = item.netUnitPrice * (item.quantity || 1)
                    const discountAmount = (price * item.discount) / 100
                    const taxAmount = (price * item.tax) / 100
                    const subtotal = price - discountAmount + taxAmount
                    return { subtotal } as Partial<PurchaseItem>
                }
                return {}
            }
        })

    const supplierOptions = suppliersData.map(s => ({ value: s.id, label: s.name }))

    // =========================
    // LOAD INITIAL DATA (EDIT MODE)
    // =========================
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setSelectedSupplierId(initialData.supplierId || '')
            setStatus(initialData.status || 'pending')
            setPaymentStatus(initialData.paymentStatus || 'unpaid')
            setPaymentMethod(initialData.paymentMethod || '')
            setPaymentAmount(initialData.paymentAmount || '')
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
        items: purchaseItems,
        orderTax,
        orderDiscount,
        shipping,
        orderTaxIsPercentage,
        orderDiscountIsPercentage
    })

    // =========================
    // CONDITIONAL FIELD LOGIC
    // =========================
    const showPaymentMethod = paymentStatus === 'paid' || paymentStatus === 'partial'
    const showPaymentAmount = paymentStatus === 'partial'

    const handleSubmit = () => {
        // =========================
        // VALIDATION
        // =========================
        if (purchaseItems.length === 0) {
            return
        }

        if (!selectedSupplierId) {
            return
        }

        // =========================
        // MAP ITEMS TO BACKEND FORMAT
        // =========================
        const purchaseItemsData = purchaseItems.map(item => ({
            product_id: parseInt(item.productId),
            quantity: item.quantity,
            net_unit_price: item.netUnitPrice,
            discount: item.discount,
            tax: item.tax,
            subtotal: item.subtotal,
            ...(mode === 'edit' && { purchase_item_id: '' })
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdatePurchaseFormData = {
                purchase_id: initialData.id,
                supplier_id: selectedSupplierId,
                purchase_items: purchaseItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status,
                payment_status: paymentStatus,
                payment_method: showPaymentMethod ? paymentMethod : undefined,
                payment_amount: showPaymentAmount ? Number(paymentAmount || 0) : undefined,
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        } else {
            const formData: CreatePurchaseFormData = {
                supplier_id: selectedSupplierId,
                purchase_items: purchaseItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status,
                payment_status: paymentStatus,
                payment_method: showPaymentMethod ? paymentMethod : undefined,
                payment_amount: showPaymentAmount ? Number(paymentAmount || 0) : undefined,
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        }
    }

    const isSubmitDisabled = purchaseItems.length === 0 || !selectedSupplierId

    // Build form fields array with conditional payment fields
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
                    setStatus(e.target.value as 'received' | 'pending' | 'orders')
                }
            },
            options: [
                { value: '', label: 'Select Status' },
                { value: 'received', label: 'Received' },
                { value: 'pending', label: 'Pending' },
                { value: 'orders', label: 'Orders' }
            ]
        },
        {
            name: 'payment-status',
            label: 'Payment Status',
            type: 'select' as const,
            value: paymentStatus,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLSelectElement) {
                    setPaymentStatus(e.target.value as 'unpaid' | 'paid' | 'partial')
                }
            },
            options: [
                { value: '', label: 'Select Payment Status' },
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'paid', label: 'Paid' },
                { value: 'partial', label: 'Partial' }
            ]
        },
        // Conditionally show payment method
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
                { value: 'cash', label: 'Cash' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'debit_card', label: 'Debit Card' },
                { value: 'check', label: 'Check' },
                { value: 'other', label: 'Other' }
            ]
        }] : []),
        // Conditionally show payment amount
        ...(showPaymentAmount ? [{
            name: 'payment-amount',
            label: 'Payment Amount',
            type: 'number' as const,
            placeholder: '0.00',
            value: paymentAmount,
            isCurrency: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLInputElement) {
                    setPaymentAmount(e.target.value)
                }
            },
            startContent: <span className="text-xs text-gray-600">{getCurrencySymbol()}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 space-y-4">
                <CustomAutocomplete
                    name="product"
                    label="Product"
                    placeholder="Search Product by Code Name"
                    radius="lg"
                    inputSize="sm"
                    options={productOptions}
                    value={selectedProductId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            handleProductSelect(value)
                        }
                    }}
                />

                <CustomAutocomplete
                    name="supplier"
                    label="Supplier"
                    placeholder="Choose Supplier"
                    radius="lg"
                    inputSize="sm"
                    options={supplierOptions}
                    value={selectedSupplierId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setSelectedSupplierId(value)
                        }
                    }}
                />
            </div>

            {/* ============================== */}
            {/* ===== PRODUCT TABLE===== */}
            {/* ============================== */}
            <OrderItemsTable
                items={purchaseItems}
                onQuantityChange={(itemId, quantity) => updateItem(itemId, 'quantity', quantity)}
                onDelete={deleteItem}
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
                    className='px-4 bg-primary text-white h-9'>
                    {submitButtonText || (mode === 'edit' ? 'Update Purchase' : 'Create Purchase')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default PurchaseForm

