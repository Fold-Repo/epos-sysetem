'use client'

import { DashboardCard, ProductSelect, Input, TextArea, Select, createInputLabel, TableComponent, TableCell } from '@/components'
import { TrashIcon } from '@/components/icons'
import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { CreateTransferPayload } from '@/types'
import { useAppSelector, selectStores } from '@/store'

interface TransferFormProps {
    mode: 'create' | 'edit'
    initialData?: {
        from_store_id?: number
        to_store_id?: number
        product_id?: number
        quantity?: number
        variation_id?: number | null
        status?: 'pending' | 'transferred' | 'received' | 'cancelled'
        notes?: string
    }
    onSubmit: (data: CreateTransferPayload) => void
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
    submitButtonText = 'Create Transfer',
    cancelButtonText = 'Cancel'
}: TransferFormProps) => {
    
    const stores = useAppSelector((state: any) => state.stores?.stores || [])
    
    const [fromStoreId, setFromStoreId] = useState<string>('')
    const [toStoreId, setToStoreId] = useState<string>('')
    const [productId, setProductId] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('')
    const [status, setStatus] = useState<'pending' | 'transferred' | 'received' | 'cancelled'>('pending')
    const [notes, setNotes] = useState('')
    const [variationId, setVariationId] = useState<number | null>(null)
    
    // Product item state for table display
    const [selectedProduct, setSelectedProduct] = useState<{
        id: string
        productId: string
        name: string
        code: string
        quantity: number
        variationId?: number | null
        variationType?: string | null
        variationValue?: string | null
    } | null>(null)

    // =========================
    // LOAD INITIAL DATA (EDIT MODE)
    // =========================
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFromStoreId(initialData.from_store_id?.toString() || '')
            setToStoreId(initialData.to_store_id?.toString() || '')
            setProductId(initialData.product_id?.toString() || '')
            setQuantity(initialData.quantity?.toString() || '')
            setStatus(initialData.status || 'pending')
            setNotes(initialData.notes || '')
            setVariationId(initialData.variation_id || null)
            
            // Set selected product for table display (if we have product info)
            if (initialData.product_id) {
                setSelectedProduct({
                    id: 'transfer-item-1',
                    productId: initialData.product_id.toString(),
                    name: 'Product', // Will be populated from API in real scenario
                    code: '',
                    quantity: initialData.quantity || 1,
                    variationId: initialData.variation_id || null
                })
            }
        }
    }, [mode, initialData])

    const storeOptions = stores.map((store: any) => ({
        value: store.store_id.toString(),
        label: store.name
    }))

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'transferred', label: 'Transferred' },
        { value: 'received', label: 'Received' },
        { value: 'cancelled', label: 'Cancelled' },
    ]

    const handleSubmit = () => {
        // =========================
        // VALIDATION
        // =========================
        if (!fromStoreId || !toStoreId) {
            return
        }

        if (fromStoreId === toStoreId) {
            return
        }

        if (!selectedProduct || !quantity) {
            return
        }

        // =========================
        // CONSTRUCT FORM DATA
        // =========================
        const formData: CreateTransferPayload = {
            from_store_id: parseInt(fromStoreId),
            to_store_id: parseInt(toStoreId),
            product_id: parseInt(productId),
            quantity: parseInt(quantity),
            status: status,
            notes: notes || '',
            ...(variationId && { variation_id: variationId })
        }

        onSubmit(formData)
    }

    const isSubmitDisabled = !fromStoreId || !toStoreId || fromStoreId === toStoreId || !selectedProduct || !quantity

    return (
        <DashboardCard bodyClassName='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    name="from_store_id"
                    label={createInputLabel({
                        name: "From Store",
                        required: true
                    })}
                    value={fromStoreId}
                    onChange={(e) => setFromStoreId(e.target.value)}
                    radius="lg">
                    <option value="" disabled>Select Source Store</option>
                    {storeOptions.map((option: { value: string; label: string }) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>

                <Select
                    name="to_store_id"
                    label={createInputLabel({
                        name: "To Store",
                        required: true
                    })}
                    value={toStoreId}
                    onChange={(e) => setToStoreId(e.target.value)}
                    radius="lg">
                    <option value="" disabled>Select Destination Store</option>
                    {storeOptions.map((option: { value: string; label: string }) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>

                <ProductSelect
                    name="product"
                    label="Product"
                    placeholder="Search Product"
                    radius="lg"
                    inputSize="sm"
                    limit={20}
                    existingItems={[]}
                    itemMapper={(product, id) => ({
                        id,
                        productId: product.id,
                        name: product.name,
                        code: product.code,
                        stock: product.stock,
                        unit: product.unit,
                        quantity: 1,
                        type: 'positive' as const,
                        productType: (product as any).variationId ? 'Variation' as const : 'Simple' as const,
                        ...((product as any).variationId && {
                            variationId: (product as any).variationId,
                            variationType: (product as any).variationType,
                            variationValue: (product as any).variationValue
                        })
                    })}
                    onItemAdd={(item) => {
                        setProductId(item.productId)
                        setQuantity('1') // Set default quantity
                        if (item.variationId) {
                            setVariationId(item.variationId)
                        }
                        
                        // Set selected product for table display
                        setSelectedProduct({
                            id: 'transfer-item-1',
                            productId: item.productId,
                            name: item.name,
                            code: item.code,
                            quantity: 1,
                            variationId: item.variationId || null,
                            variationType: item.variationType || null,
                            variationValue: item.variationValue || null
                        })
                    }}
                />


                <Select
                    name="status"
                    label={createInputLabel({
                        name: "Status",
                        required: false
                    })}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'pending' | 'transferred' | 'received' | 'cancelled')}
                    radius="lg">
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </div>

            {/* ============================== */}
            {/* ===== PRODUCT TABLE ===== */}
            {/* ============================== */}
            {selectedProduct && (
                <div className="space-y-2">
                    <h6 className="text-xs font-medium text-gray-700">Selected Product</h6>
                    <TableComponent
                        columns={[
                            { key: 'product', title: 'PRODUCT' },
                            { key: 'qty', title: 'QUANTITY' },
                            { key: 'action', title: 'ACTION' }
                        ]}
                        data={[selectedProduct]}
                        rowKey={(item) => item.id}
                        renderRow={(item) => {
                            return (
                                <>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-900 font-medium">
                                                {item.name}
                                            </span>
                                            <span className="text-[11px] text-gray-600 underline mt-0.5">
                                                {item.code}
                                            </span>
                                            {item.variationType && item.variationValue && (
                                                <span className="text-[11px] text-gray-500 mt-0.5">
                                                    {item.variationType}: {item.variationValue}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            name="quantity"
                                            type="number"
                                            min={1}
                                            value={String(item.quantity)}
                                            onChange={(e) => {
                                                const qty = parseInt(e.target.value) || 1
                                                if (qty < 1) return
                                                setQuantity(String(qty))
                                                setSelectedProduct({
                                                    ...item,
                                                    quantity: qty
                                                })
                                            }}
                                            className="w-20 h-9"
                                            inputSize="sm"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="text-red-500 hover:text-red-600"
                                            onPress={() => {
                                                setSelectedProduct(null)
                                                setProductId('')
                                                setQuantity('')
                                                setVariationId(null)
                                            }}>
                                            <TrashIcon className="size-4" />
                                        </Button>
                                    </TableCell>
                                </>
                            )
                        }}
                        withCheckbox={false}
                        loading={false}
                    />
                </div>
            )}

            <TextArea
                name="notes"
                label={createInputLabel({
                    name: "Notes",
                    required: true
                })}
                placeholder="Transfer for branch store inventory"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
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

export default TransferForm