'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button, Switch } from '@heroui/react'
import { PaymentMethodType } from '@/types'

interface PaymentMethodTableProps {
    data: PaymentMethodType[]
    onEdit?: (paymentMethod: PaymentMethodType) => void
    onDelete?: (paymentMethodId: string) => void
    onStatusChange?: (paymentMethodId: string, status: 'active' | 'inactive') => void
}

const columns = [
    { key: 'name', title: 'NAME' },
    { key: 'status', title: 'STATUS' },
    { key: 'actions', title: 'ACTION' }
]

const PaymentMethodTable = ({
    data,
    onEdit,
    onDelete,
    onStatusChange
}: PaymentMethodTableProps) => {

    const renderRow = (paymentMethod: PaymentMethodType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{paymentMethod.name}</span>
                </TableCell>
                <TableCell>
                    <Switch
                        size="sm"
                        color="primary"
                        isSelected={paymentMethod.status === 'active'}
                        onValueChange={(isSelected) => {
                            if (onStatusChange && paymentMethod.id) {
                                onStatusChange(
                                    String(paymentMethod.id),
                                    isSelected ? 'active' : 'inactive'
                                )
                            }
                        }}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(paymentMethod)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(paymentMethod.id))} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80 text-danger' 
                            radius='full'>
                            <TrashIcon className='size-3' />
                        </Button>
                    </div>
                </TableCell>
            </>
        )
    }

    return (
        <TableComponent
            className='border border-gray-200 overflow-hidden rounded-xl'
            columns={columns}
            data={data}
            rowKey={(item) => String(item.id || `pm-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default PaymentMethodTable

