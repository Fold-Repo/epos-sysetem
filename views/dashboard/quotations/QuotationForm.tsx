'use client'

import { DashboardCard, CustomAutocomplete } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable } from '@/views/dashboard/components'
import { productsData, customersData } from '@/data'
import { useProductSelection, BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreateQuotationFormData, UpdateQuotationFormData, QuotationType } from '@/types'

interface QuotationItem extends BaseProductItem {
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    subtotal: number
}

interface QuotationFormProps {
    mode: 'create' | 'edit'
    initialData?: QuotationType & {
        items?: QuotationItem[]
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
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState('')
    const [note, setNote] = useState('')

    const { selectedProductId, items: quotationItems, setItems,
        clearItems,
        handleProductSelect, updateItem, deleteItem, productOptions }
        = useProductSelection<QuotationItem>({
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
            duplicateErrorMessage: (productName) => `"${productName}" is already in the order items list.`,
            onItemUpdate: (item, field) => {
                // =========================
                // AUTO-CALCULATE SUBTOTAL
                // =========================
                if (field === 'quantity') {
                    const price = item.netUnitPrice * (item.quantity || 1)
                    const discountAmount = (price * item.discount) / 100
                    const taxAmount = (price * item.tax) / 100
                    const subtotal = price - discountAmount + taxAmount
                    return { subtotal } as Partial<QuotationItem>
                }
                return {}
            }
        })

    const customerOptions = customersData
        .filter(c => c.id !== undefined)
        .map(c => ({ value: String(c.id!), label: c.name }))

    // =========================
    // LOAD INITIAL DATA (EDIT MODE)
    // =========================
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setSelectedCustomerId(initialData.customerId || '')
            setStatus(initialData.status || '')
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
            ...(mode === 'edit' && { quotation_item_id: '' })
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdateQuotationFormData = {
                quotation_id: initialData.id,
                customer_id: selectedCustomerId,
                quotation_items: quotationItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status || 'draft',
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        } else {
            const formData: CreateQuotationFormData = {
                customer_id: selectedCustomerId,
                quotation_items: quotationItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status || 'draft',
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        }
    }

    const isSubmitDisabled = quotationItems.length === 0 || !selectedCustomerId

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
            </div>

            {/* ============================== */}
            {/* ===== PRODUCT TABLE===== */}
            {/* ============================== */}
            <OrderItemsTable
                items={quotationItems}
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
                            { value: '', label: 'Select Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'cancelled', label: 'Cancelled' },
                            { value: 'Sent', label: 'Sent' },
                            { value: 'Draft', label: 'Draft' },
                            { value: 'Approved', label: 'Approved' },
                            { value: 'Rejected', label: 'Rejected' }
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
                    isDisabled={isSubmitDisabled || isLoading}
                    className='px-4 bg-primary text-white h-9'>
                    {submitButtonText || (mode === 'edit' ? 'Update Quotation' : 'Create Quotation')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default QuotationForm

