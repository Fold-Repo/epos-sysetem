'use client'

import { CustomAutocomplete, DashboardBreadCrumb, DashboardCard, Input, TableComponent, TableCell, Select } from '@/components'
import { TrashIcon } from '@/components/icons'
import { Button, Chip } from '@heroui/react'
import { useProductSelection, BaseProductItem, useGoBack, useToast } from '@/hooks'
import { productsData } from '@/data'
import { AdjustmentItem as AdjustmentItemType, CreateAdjustmentFormData } from '@/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdjustmentItem extends BaseProductItem {
    quantity: number
    type: 'addition' | 'subtraction' | 'return'
}

const columns = [
    { key: 'product', title: 'PRODUCT' },
    { key: 'code', title: 'PRODUCT CODE' },
    { key: 'stock', title: 'STOCK' },
    { key: 'qty', title: 'QTY' },
    { key: 'type', title: 'TYPE' },
    { key: 'action', title: 'ACTION' },
]

const CreateAdjustmentView = () => {

    const router = useRouter()
    const goBack = useGoBack()

    const { showSuccess, showError } = useToast()
    const [date, setDate] = useState<string>('')

    const { selectedProductId, items: adjustmentItems,
        handleProductSelect, updateItem, deleteItem, productOptions, clearItems }
        = useProductSelection<AdjustmentItem>({
            products: productsData,
            itemMapper: (product, id) => ({
                id,
                productId: product.id,
                name: product.name,
                code: product.code,
                stock: product.stock,
                unit: product.unit,
                quantity: 1,
                type: 'addition' as const
            }),
            duplicateErrorTitle: 'Product already added',
            duplicateErrorMessage: (productName) => `"${productName}" is already in the order items list.`
        })

    // =========================
    // MAP TYPE TO METHOD TYPE
    // =========================
    const getMethodType = (type: 'addition' | 'subtraction' | 'return'): number => {
        switch (type) {
            case 'addition':
                return 1
            case 'subtraction':
                return 2
            case 'return':
                return 3
            default:
                return 1
        }
    }

    const handleSave = () => {

        if (adjustmentItems.length === 0) {
            showError('No items', 'Please add at least one product to create an adjustment.')
            return
        }

        if (!date) {
            showError('Date required', 'Please select a date for the adjustment.')
            return
        }

        // =========================
        // FORMAT DATE FOR BACKEND
        // =========================
        const formattedDate = new Date(date).toISOString()

        // =========================
        // MAP ITEMS TO BACKEND FORMAT
        // =========================
        const adjustmentItemsData = adjustmentItems.map(item => ({
            product_id: parseInt(item.productId),
            quantity: item.quantity,
            method_type: getMethodType(item.type),
            adjustment_item_id: ''
        }))

        const formData: CreateAdjustmentFormData = {
            date: formattedDate,
            note: '',
            adjustment_items: adjustmentItemsData
        }

        console.log(formData)

        showSuccess('Adjustment created', 'Adjustment created successfully.')

        // clearItems()
        // setDate('')

        // router.push('/dashboard/adjustments')

    }

    const renderRow = (item: AdjustmentItem) => {
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
                    </div>
                </TableCell>
                <TableCell>
                    <span className="text-xs text-gray-600">
                        {item.code}
                    </span>
                </TableCell>
                <TableCell>
                    <Chip size='sm' radius='sm' className="text-[10px] bg-primary/20 text-primary">
                        {item.stock} {item.unit}
                    </Chip>
                </TableCell>
                <TableCell>
                    <Input name={`qty-${item.id}`} type="number" min={1}
                        value={String(item.quantity)}
                        onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0
                            if (quantity < 1) return
                            updateItem(item.id, 'quantity', quantity)
                        }} className="w-20 h-9" inputSize="sm" />
                </TableCell>
                <TableCell>
                    <Select name={`type-${item.id}`} value={item.type}
                        onChange={(e) => {
                            const type = e.target.value as 'addition' | 'subtraction' | 'return'
                            updateItem(item.id, 'type', type)
                        }} className="w-32" inputSize="sm">
                        <option value="addition">Addition</option>
                        <option value="subtraction">Subtraction</option>
                        <option value="return">Return</option>
                    </Select>
                </TableCell>
                <TableCell>
                    <Button isIconOnly size="sm" variant="light" className="text-red-500 hover:text-red-600" onPress={() => deleteItem(item.id)}>
                        <TrashIcon className="size-4" />
                    </Button>
                </TableCell>
            </>
        )
    }

    return (
        <>

            <DashboardBreadCrumb
                items={[
                    { label: 'Adjustments', href: '/dashboard/adjustments' },
                    { label: 'Create Adjustment' }
                ]}
                title='Create Adjustment'
            />

            <div className="p-3 space-y-2">

                <DashboardCard bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-x-3 space-y-4'>

                    <CustomAutocomplete
                        name="product"
                        label="Product"
                        placeholder="Select Product"
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

                    <Input min={new Date().toISOString().split('T')[0]} name="date" label="Date" type="date"
                        value={date} onChange={(e) => setDate(e.target.value)} />

                </DashboardCard>

                <DashboardCard className='overflow-hidden' bodyClassName='p-0 space-y-4'>

                    <TableComponent
                        columns={columns}
                        data={adjustmentItems}
                        rowKey={(item) => item.id}
                        renderRow={renderRow}
                        withCheckbox={false}
                        loading={false}
                    />

                    <div className="flex items-center gap-3 justify-end p-3">

                        <Button onPress={goBack} size='sm' color='danger' className='px-4 h-9'>
                            Cancel
                        </Button>

                        <Button onPress={handleSave} size='sm'
                            isDisabled={adjustmentItems.length === 0 || !date}
                            className='px-4 bg-primary text-white h-9'>
                            Create Adjustment
                        </Button>

                    </div>

                </DashboardCard>
            </div>
        </>
    )
}

export default CreateAdjustmentView
