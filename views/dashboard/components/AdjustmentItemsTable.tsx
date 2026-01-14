'use client'

import { TableComponent, TableCell, Input } from '@/components'
import { TrashIcon } from '@/components/icons'
import { Button } from '@heroui/react'

export interface AdjustmentTableItem {
    id: string
    productId: string
    name: string
    code: string
    quantity: number
    type: 'positive' | 'negative'
}

interface AdjustmentItemsTableProps {
    items: AdjustmentTableItem[]
    onQuantityChange?: (itemId: string, quantity: number) => void
    onTypeChange?: (itemId: string, type: 'positive' | 'negative') => void
    onDelete?: (itemId: string) => void
    readOnly?: boolean
}

const AdjustmentItemsTable = ({ items, onQuantityChange, onTypeChange, onDelete, readOnly = false }: AdjustmentItemsTableProps) => {
    const columns = [
        { key: 'product', title: 'PRODUCT' },
        { key: 'qty', title: 'QTY' },
        { key: 'type', title: 'TYPE' },
        ...(readOnly ? [] : [{ key: 'action', title: 'ACTION' }])
    ]
    const renderRow = (item: AdjustmentTableItem) => {
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
                    {readOnly || !onTypeChange ? (
                        <span className='text-xs text-gray-600 capitalize'>
                            {item.type}
                        </span>
                    ) : (
                        <select
                            name={`type-${item.id}`}
                            value={item.type}
                            onChange={(e) => {
                                const type = e.target.value as 'positive' | 'negative'
                                onTypeChange(item.id, type)
                            }}
                            className="w-32 h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    )}
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

export default AdjustmentItemsTable

