'use client'

import { DashboardCard, CustomAutocomplete } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable } from '@/views/dashboard/components'
import { productsData, storesData } from '@/data'
import { useProductSelection, BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreateTransferFormData, UpdateTransferFormData, TransferType } from '@/types'

interface TransferItem extends BaseProductItem {
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    subtotal: number
}

interface TransferFormProps {
    mode: 'create' | 'edit'
    initialData?: TransferType & {
        items?: TransferItem[]
        orderTax?: string
        orderDiscount?: string
        shipping?: string
        orderTaxIsPercentage?: boolean
        orderDiscountIsPercentage?: boolean
        note?: string
    }
    onSubmit: (data: CreateTransferFormData | UpdateTransferFormData) => void
    onCancel: () => void
    isLoading?: boolean
    submitButtonText?: string
    cancelButtonText?: string
}

const TransferForm = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText,
    cancelButtonText = 'Cancel'
}: TransferFormProps) => {
    
    const [fromStoreId, setFromStoreId] = useState<string>('')
    const [toStoreId, setToStoreId] = useState<string>('')
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState('')
    const [note, setNote] = useState('')

    const { selectedProductId, items: transferItems, setItems,
        clearItems,
        handleProductSelect, updateItem, deleteItem, productOptions }
        = useProductSelection<TransferItem>({
            products: productsData,
            itemMapper: (product, id) => {
                const price = product.price || 0
                const discount = product.discount || 0
                const tax = product.tax || 0
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
                    subtotal: price
                }
            },
            duplicateErrorTitle: 'Product already added',
            duplicateErrorMessage: (productName) => `"${productName}" is already in the transfer items list.`,
            onItemUpdate: (item, field) => {
                // =========================
                // AUTO-CALCULATE SUBTOTAL
                // =========================
                if (field === 'quantity') {
                    const price = item.netUnitPrice * (item.quantity || 1)
                    const subtotal = price
                    return { subtotal } as Partial<TransferItem>
                }
                return {}
            }
        })

    const storeOptions = storesData
        .filter(s => s.id !== undefined)
        .map(s => ({ value: String(s.id!), label: s.name }))

    // =========================
    // LOAD INITIAL DATA (EDIT MODE)
    // =========================
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFromStoreId(initialData.fromStoreId || '')
            setToStoreId(initialData.toStoreId || '')
            setOrderTax(initialData.orderTax || '')
            setOrderTaxIsPercentage(initialData.orderTaxIsPercentage ?? true)
            setOrderDiscount(initialData.orderDiscount || '')
            setOrderDiscountIsPercentage(initialData.orderDiscountIsPercentage ?? false)
            setShipping(initialData.shipping || '')
            setStatus(initialData.status || '')
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
        items: transferItems,
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
        if (transferItems.length === 0) {
            return
        }

        if (!fromStoreId || !toStoreId) {
            return
        }

        if (fromStoreId === toStoreId) {
            return
        }

        // =========================
        // MAP ITEMS TO BACKEND FORMAT
        // =========================
        const transferItemsData = transferItems.map(item => ({
            product_id: parseInt(item.productId),
            quantity: item.quantity,
            ...(mode === 'edit' && { transfer_item_id: '' })
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdateTransferFormData = {
                transfer_id: initialData.id,
                from_store_id: fromStoreId,
                to_store_id: toStoreId,
                transfer_items: transferItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status || 'pending',
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        } else {
            const formData: CreateTransferFormData = {
                from_store_id: fromStoreId,
                to_store_id: toStoreId,
                transfer_items: transferItemsData,
                order_tax: Number(orderTax || 0),
                order_discount: Number(orderDiscount || 0),
                shipping: Number(shipping || 0),
                status: status || 'pending',
                note: note || '',
                grand_total: totals.grandTotal
            }
            onSubmit(formData)
        }
    }

    const isSubmitDisabled = transferItems.length === 0 || !fromStoreId || !toStoreId || fromStoreId === toStoreId

    return (
        <DashboardCard bodyClassName='space-y-2'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 space-y-3">
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
                    name="from-store"
                    label="From Store"
                    placeholder="Choose From Store"
                    radius="lg"
                    inputSize="sm"
                    options={storeOptions}
                    value={fromStoreId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setFromStoreId(value)
                        }
                    }}
                />

                <CustomAutocomplete
                    name="to-store"
                    label="To Store"
                    placeholder="Choose To Store"
                    radius="lg"
                    inputSize="sm"
                    options={storeOptions}
                    value={toStoreId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setToStoreId(value)
                        }
                    }}
                />
            </div>

            {/* ============================== */}
            {/* ===== PRODUCT TABLE===== */}
            {/* ============================== */}
            <OrderItemsTable
                items={transferItems}
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
                            { value: 'sent', label: 'Sent' },
                            { value: 'in-transit', label: 'In-Transit' },
                            { value: 'ongoing', label: 'Ongoing' },
                            { value: 'completed', label: 'Completed' }
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
                    isDisabled={isLoading}
                >
                    {cancelButtonText}
                </Button>

                <Button 
                    onPress={handleSubmit} 
                    size='sm' 
                    isDisabled={isSubmitDisabled || isLoading}
                    className='px-4 bg-primary text-white h-9'>
                    {submitButtonText || (mode === 'edit' ? 'Update Transfer' : 'Create Transfer')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default TransferForm

