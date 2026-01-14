'use client'

import { DashboardCard, CustomAutocomplete, ProductSelect } from '@/components'
import { SummaryBox, FormFieldsGrid, OrderItemsTable, FormField } from '@/views/dashboard/components'
import { useProductSelection, BaseProductItem, useOrderTotals } from '@/hooks'
import { useState, useEffect, useMemo } from 'react'
import { formatCurrency, getCurrencySymbol } from '@/lib'
import { Button } from '@heroui/react'
import { CreatePurchaseFormData, UpdatePurchaseFormData, PurchaseType, ProductType } from '@/types'
import { useAppSelector, selectSuppliers, selectPaymentMethods, selectStores } from '@/store'

interface PurchaseItem extends BaseProductItem {
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
}

interface PurchaseFormProps {
    mode: 'create' | 'edit'
    initialData?: PurchaseType & {
        items?: PurchaseItem[]
        storeId?: string
        purchaseDate?: string
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
    const [selectedStoreId, setSelectedStoreId] = useState<string>('')
    const [purchaseDate, setPurchaseDate] = useState<string>('')
    const [orderTax, setOrderTax] = useState('')
    const [orderTaxIsPercentage, setOrderTaxIsPercentage] = useState(true)
    const [orderDiscount, setOrderDiscount] = useState('')
    const [orderDiscountIsPercentage, setOrderDiscountIsPercentage] = useState(false)
    const [shipping, setShipping] = useState('')
    const [status, setStatus] = useState<'received' | 'pending' | 'orders'>('pending')
    const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')
    const [note, setNote] = useState('')

    const { items: purchaseItems, setItems,
        clearItems,
        updateItem, deleteItem }
        = useProductSelection<PurchaseItem>({
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
            duplicateErrorMessage: (productName) => `"${productName}" is already in the purchase items list.`,
            onItemUpdate: (item, field) => {
                if (field === 'quantity') {
                    const price = item.netUnitPrice * (item.quantity || 1)
                    const discountAmount = (price * item.discount) / 100

                    // ================================
                    // CALCULATE TAX AMOUNT
                    // ================================
                    const taxAmount = item.taxType === 'fixed' ? item.tax : (price * item.tax) / 100
                    const subtotal = price - discountAmount + taxAmount
                    return { subtotal } as Partial<PurchaseItem>
                }
                return {}
            }
        })

    // =========================
    // GET SUPPLIERS, STORES, AND PAYMENT METHODS FROM REDUX STATE
    // =========================
    const suppliers = useAppSelector(selectSuppliers)
    const stores = useAppSelector(selectStores)
    const paymentMethods = useAppSelector(selectPaymentMethods)
    
    // =========================
    // SUPPLIER OPTIONS
    // =========================
    const supplierOptions = useMemo(() => {
        return suppliers
            .filter(s => s.supplier_id !== undefined)
            .map(s => ({ value: String(s.supplier_id), label: s.name }))
    }, [suppliers])

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
        if (mode === 'edit' && initialData) {
            setSelectedSupplierId(initialData.supplierId || '')
            setSelectedStoreId(initialData.storeId || '')
            setPurchaseDate(initialData.purchaseDate || '')
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
    const showPaymentMethod = paymentStatus === 'paid'

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
            ...(item.productType === 'Variation' && item.variationId && { variation_id: item.variationId }),
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
        const baseFormData: CreatePurchaseFormData = {
            supplier_id: selectedSupplierId,
            store_id: selectedStoreId,
            purchase_date: purchaseDate || new Date().toISOString().split('T')[0],
            purchase_items: purchaseItemsData,
            order_tax: Number(orderTax || 0),
            order_discount: Number(orderDiscount || 0),
            shipping: Number(shipping || 0),
            status: status,
            payment_status: paymentStatus,
            payment_method: showPaymentMethod ? paymentMethod : undefined,
            payment_amount: undefined,
            note: note || '',
            grand_total: totals.grandTotal,
            order_tax_type: orderTaxIsPercentage ? 'percent' : 'fixed',
            order_discount_type: orderDiscountIsPercentage ? 'percent' : 'fixed'
        }
        
        if (mode === 'edit' && initialData?.id) {
            const formData: UpdatePurchaseFormData = {
                ...baseFormData,
                purchase_id: initialData.id
            }
            onSubmit(formData)
        } else {
            onSubmit(baseFormData)
        }
    }

    const isSubmitDisabled = purchaseItems.length === 0 || !selectedSupplierId || !selectedStoreId

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
            name: 'purchase-date',
            label: 'Purchase Date',
            type: 'date' as const,
            value: purchaseDate || new Date().toISOString().split('T')[0],
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.target instanceof HTMLInputElement) {
                    setPurchaseDate(e.target.value)
                }
            },
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
                    existingItems={purchaseItems}
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
                items={purchaseItems}
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
                    {submitButtonText || (mode === 'edit' ? 'Update Purchase' : 'Create Purchase')}
                </Button>
            </div>
        </DashboardCard>
    )
}

export default PurchaseForm

