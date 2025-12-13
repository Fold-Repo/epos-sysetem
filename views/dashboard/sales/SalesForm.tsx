'use client'

import { DashboardCard, CustomAutocomplete, Input, Select, TextArea } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable } from '@/views/dashboard/components'
import { productsData, customersData } from '@/data'
import { useProductSelection, BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreateSaleFormData, UpdateSaleFormData, SaleType } from '@/types'
import { TrashIcon } from '@/components'
import { PlusIcon } from '@heroicons/react/24/outline'
import moment from 'moment'

interface SaleItem extends BaseProductItem {
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    subtotal: number
}

interface PaymentEntry {
    id: string
    date: string
    reference: string
    amount: string
    paymentType: string
}

interface SalesFormProps {
    mode: 'create' | 'edit'
    initialData?: SaleType & {
        items?: SaleItem[]
        orderTax?: string
        orderDiscount?: string
        shipping?: string
        orderTaxIsPercentage?: boolean
        orderDiscountIsPercentage?: boolean
        payments?: PaymentEntry[]
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
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState<'completed' | 'pending' | 'cancelled'>('pending')
    const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid' | 'partial'>('unpaid')
    const [payments, setPayments] = useState<PaymentEntry[]>([
        {
            id: `payment-${Date.now()}`,
            date: moment().format('YYYY-MM-DD'),
            reference: '',
            amount: '',
            paymentType: ''
        }
    ])
    const [note, setNote] = useState('')

    const { selectedProductId, items: saleItems, setItems,
        clearItems,
        handleProductSelect, updateItem, deleteItem, productOptions }
        = useProductSelection<SaleItem>({
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
            duplicateErrorMessage: (productName) => `"${productName}" is already in the sale items list.`,
            onItemUpdate: (item, field) => {
                if (field === 'quantity') {
                    const price = item.netUnitPrice * (item.quantity || 1)
                    const discountAmount = (price * item.discount) / 100
                    const taxAmount = (price * item.tax) / 100
                    const subtotal = price - discountAmount + taxAmount
                    return { subtotal } as Partial<SaleItem>
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
            setStatus(initialData.status || 'pending')
            setPaymentStatus(initialData.paymentStatus || 'unpaid')
            setOrderTax(initialData.orderTax || '')
            setOrderTaxIsPercentage(initialData.orderTaxIsPercentage ?? true)
            setOrderDiscount(initialData.orderDiscount || '')
            setOrderDiscountIsPercentage(initialData.orderDiscountIsPercentage ?? false)
            setShipping(initialData.shipping || '')
            setNote(initialData.note || '')
            
            if (initialData.payments && initialData.payments.length > 0) {
                setPayments(initialData.payments)
            }
            
            if (initialData.items) {
                setItems(initialData.items)
            }
        }
    }, [mode, initialData, setItems])

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

    // Calculate total paid from payments
    const totalPaid = payments.reduce((sum, payment) => {
        return sum + (Number(payment.amount) || 0)
    }, 0)

    const totalDue = totals.grandTotal - totalPaid

    // =========================
    // PAYMENT HANDLERS
    // =========================
    const addPaymentRow = () => {
        setPayments([...payments, {
            id: `payment-${Date.now()}`,
            date: moment().format('YYYY-MM-DD'),
            reference: '',
            amount: '',
            paymentType: ''
        }])
    }

    const removePaymentRow = (id: string) => {
        if (payments.length > 1) {
            setPayments(payments.filter(p => p.id !== id))
        }
    }

    const updatePayment = (id: string, field: keyof PaymentEntry, value: string) => {
        setPayments(payments.map(p => 
            p.id === id ? { ...p, [field]: value } : p
        ))
    }

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

        // =========================
        // MAP ITEMS TO BACKEND FORMAT
        // =========================
        const saleItemsData = saleItems.map(item => ({
            product_id: parseInt(item.productId),
            quantity: item.quantity,
            net_unit_price: item.netUnitPrice,
            discount: item.discount,
            tax: item.tax,
            subtotal: item.subtotal,
            ...(mode === 'edit' && { sale_item_id: '' })
        }))

        // Get payment type from first payment if exists (only if payment status is paid or partial)
        const paymentType = (paymentStatus === 'paid' || paymentStatus === 'partial') && payments.length > 0 && payments[0].paymentType ? payments[0].paymentType : undefined

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdateSaleFormData = {
                sale_id: initialData.id,
                user_id: selectedCustomerId,
                customer_id: selectedCustomerId,
                sale_items: saleItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status,
                payment_status: paymentStatus,
                payment_type: paymentType,
                payment_amount: totalPaid > 0 ? totalPaid : undefined,
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        } else {
            const formData: CreateSaleFormData = {
                user_id: selectedCustomerId,
                customer_id: selectedCustomerId,
                sale_items: saleItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status,
                payment_status: paymentStatus,
                payment_type: paymentType,
                payment_amount: totalPaid > 0 ? totalPaid : undefined,
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        }
    }

    const isSubmitDisabled = saleItems.length === 0 || !selectedCustomerId

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
                items={saleItems}
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
                            if (e.target.value !== '') {
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
                                setPaymentStatus(e.target.value as 'unpaid' | 'paid' | 'partial')
                            }
                        },
                        options: [
                            { value: '', label: 'Select Payment Status' },
                            { value: 'unpaid', label: 'Unpaid' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'partial', label: 'Partial' }
                        ]
                    }
                ]}
            />

            {/* ============================== */}
            {/* ===== PAYMENT ENTRIES ===== */}
            {/* ============================== */}
            {(paymentStatus === 'paid' || paymentStatus === 'partial') && (
                <div className="space-y-3">
                    <h6 className="text-sm font-medium text-gray-900">Payments</h6>

                {payments.map((payment, index) => (
                    <div key={payment.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                        <Input
                            name={`payment-date-${payment.id}`}
                            label="Date"
                            type="date"
                            value={payment.date}
                            onChange={(e) => updatePayment(payment.id, 'date', e.target.value)}
                        />
                        <Input
                            name={`payment-reference-${payment.id}`}
                            label="Reference"
                            placeholder="Enter Reference"
                            value={payment.reference}
                            onChange={(e) => updatePayment(payment.id, 'reference', e.target.value)}
                        />
                        <Input
                            name={`payment-amount-${payment.id}`}
                            label="Amount"
                            placeholder="Enter Amount"
                            value={payment.amount}
                            isCurrency={true}
                            onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
                            startContent={<span className="text-xs text-gray-600">{getCurrencySymbol()}</span>}
                        />
                        <Select
                            name={`payment-type-${payment.id}`}
                            label="Payment Type"
                            value={payment.paymentType}
                            onChange={(e) => updatePayment(payment.id, 'paymentType', e.target.value)}
                            required>
                            <option value="">Choose Payment Type</option>
                            <option value="cash">Cash</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="check">Check</option>
                            <option value="other">Other</option>
                        </Select>
                        <div className="flex items-center gap-2 mt-4">
                            {payments.length > 1 && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    onPress={() => removePaymentRow(payment.id)}>
                                    <TrashIcon className="size-4" />
                                </Button>
                            )}
                            {index === payments.length - 1 && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    onPress={addPaymentRow}
                                    className="bg-gray-100">
                                    <PlusIcon className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* ============================== */}
            {/* ===== NOTE ===== */}
            {/* ============================== */}
            <TextArea
                name="note"
                label="Note"
                placeholder="Enter Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                inputSize="sm"
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
                    {submitButtonText || (mode === 'edit' ? 'Update Sale' : 'Create Sale')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default SalesForm

