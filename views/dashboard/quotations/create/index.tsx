'use client'

import { DashboardBreadCrumb, DashboardCard, CustomAutocomplete, Input } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable } from '@/views/dashboard/components'
import { productsData, customersData } from '@/data'
import { useProductSelection, BaseProductItem, useToast, useGoBack, useOrderTotals } from '@/hooks'
import { useState } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/react'
import { CreateQuotationFormData } from '@/types'

interface QuotationItem extends BaseProductItem {
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    subtotal: number
}


const CreateQuotationView = () => {

    const router = useRouter()
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
    const [orderTax, setOrderTax] = useState('')
    const [orderDiscount, setOrderDiscount] = useState('')
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState('')
    const [note, setNote] = useState('')

    const { selectedProductId, items: quotationItems,
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

    const customerOptions = customersData.map(c => ({ value: c.id, label: c.name }))

    // =========================
    // CALCULATE TOTALS
    // =========================
    const totals = useOrderTotals({
        items: quotationItems,
        orderTax,
        orderDiscount,
        shipping,
        orderTaxIsPercentage: true,
        orderDiscountIsPercentage: false
    })

    const handleSave = () => {
        // =========================
        // VALIDATION
        // =========================
        if (quotationItems.length === 0) {
            showError('No items', 'Please add at least one product to create a quotation.')
            return
        }

        if (!selectedCustomerId) {
            showError('Customer required', 'Please select a customer for the quotation.')
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
            subtotal: item.subtotal
        }))

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
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

        console.log('Create quotation:', formData)

        showSuccess('Quotation created', 'Quotation created successfully.')
        
        // Clear form
        clearItems()
        setSelectedCustomerId('')
        setOrderTax('')
        setOrderDiscount('')
        setShipping('')
        setStatus('')
        setNote('')

        // router.push('/dashboard/quotations')
    }

    return (
        <>
        
            <DashboardBreadCrumb
                items={[
                    { label: 'Quotations', href: '/dashboard/quotations' },
                    { label: 'Create Quotation' }
                ]}
                title='Create Quotation'
            />

            <div className="p-3 space-y-2">

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
                                value: `${formatCurrency(totals.orderTaxAmount)} (${Number(orderTax) || 0}%)`
                            },
                            {
                                label: 'Discount',
                                value: totals.orderDiscount,
                                isPercentage: true,
                            },
                            {
                                label: 'Shipping',
                                value: totals.shipping,
                                isPercentage: true
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
                                endContent: <span className="text-xs text-gray-600">%</span>
                            },
                            {
                                name: 'order-discount',
                                label: 'Order Discount',
                                type: 'number',
                                placeholder: '0.00',
                                value: orderDiscount,
                                onChange: (e) => setOrderDiscount(e.target.value),
                                endContent: <span className="text-xs text-gray-600">%</span>
                            },
                            {
                                name: 'shipping',
                                label: 'Shipping',
                                type: 'number',
                                placeholder: '0.00',
                                value: shipping,
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
                                    { value: 'cancelled', label: 'Cancelled' }
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

                        <Button onPress={goBack} size='sm' color='danger' className='px-4 h-9'>
                            Cancel
                        </Button>

                        <Button onPress={handleSave} size='sm' isDisabled={quotationItems.length === 0 || !selectedCustomerId}
                            className='px-4 bg-primary text-white h-9'>
                            Create Adjustment
                        </Button>

                    </div>

                </DashboardCard>

            </div>
        </>
    )
}

export default CreateQuotationView
