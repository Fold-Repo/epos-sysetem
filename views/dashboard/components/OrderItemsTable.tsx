'use client'

import { TableComponent, TableCell, Input } from '@/components'
import { TrashIcon } from '@/components/icons'
import { Button, Chip } from '@heroui/react'
import { formatCurrency } from '@/lib'

export interface OrderItem {
    id: string
    productId: string
    name: string
    code: string
    stock?: number
    unit?: string
    quantity: number
    netUnitPrice: number
    discount: number
    tax: number
    taxType?: 'percent' | 'fixed'
    subtotal: number
}

interface OrderItemsTableProps {
    items: OrderItem[]
    onQuantityChange?: (itemId: string, quantity: number) => void
    onDelete?: (itemId: string) => void
    readOnly?: boolean
    hideStock?: boolean
}

const OrderItemsTable = ({ items, onQuantityChange, onDelete, readOnly = false, hideStock = false }: OrderItemsTableProps) => {
    const columns = [
        { key: 'product', title: 'PRODUCT' },
        { key: 'netUnitPrice', title: 'NET UNIT PRICE' },
        ...(hideStock ? [] : [{ key: 'stock', title: 'STOCK' }]),
        { key: 'qty', title: 'QTY' },
        { key: 'discount', title: 'DISCOUNT' },
        { key: 'tax', title: 'TAX' },
        { key: 'subtotal', title: 'SUBTOTAL' },
        ...(readOnly ? [] : [{ key: 'action', title: 'ACTION' }])
    ]
    const renderRow = (item: OrderItem) => {
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
                    <span className='text-xs text-gray-600'>
                        {formatCurrency(item.netUnitPrice)}
                    </span>
                </TableCell>
                {!hideStock && (
                    <TableCell>
                        <Chip size='sm' radius='sm' className="text-[10px] bg-primary/20 text-primary">
                            {item.stock} {item.unit}
                        </Chip>
                    </TableCell>
                )}
                <TableCell>
                    {readOnly || !onQuantityChange ? (
                        <span className='text-xs text-gray-900'>
                            {item.quantity}
                        </span>
                    ) : (
                        <Input 
                            name={`qty-${item.id}`}
                            type="number"
                            min={1}
                            value={String(item.quantity)}
                            onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 0
                                if (quantity < 1) return
                                onQuantityChange(item.id, quantity)
                            }}
                            className="w-20 h-9"
                            inputSize="sm"
                        />
                    )}
                </TableCell>
                <TableCell>
                    <span className='text-xs text-gray-600'>
                        {item.discount}%
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs text-gray-600'>
                        {item.taxType === 'fixed' 
                            ? formatCurrency(item.tax)
                            : `${item.tax}%`
                        }
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.subtotal)}
                    </span>
                </TableCell>
                {!readOnly && onDelete && (
                    <TableCell>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-red-500 hover:text-red-600"
                            onPress={() => onDelete(item.id)}>
                            <TrashIcon className="size-4" />
                        </Button>
                    </TableCell>
                )}
            </>
        )
    }

    return (
        <TableComponent
            columns={columns}
            data={items}
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default OrderItemsTable

