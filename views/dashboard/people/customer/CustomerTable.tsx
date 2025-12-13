'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { CustomerType } from '@/types'

interface CustomerTableProps {
    data: CustomerType[]
    onEdit?: (customer: CustomerType) => void
    onDelete?: (customerId: string) => void
}

const columns = [
    { key: 'name', title: 'NAME' },
    { key: 'email', title: 'EMAIL' },
    { key: 'phone', title: 'PHONE' },
    { key: 'country', title: 'COUNTRY' },
    { key: 'city', title: 'CITY' },
    { key: 'address', title: 'ADDRESS' },
    { key: 'actions', title: 'ACTION' }
]

const CustomerTable = ({
    data,
    onEdit,
    onDelete
}: CustomerTableProps) => {

    const renderRow = (customer: CustomerType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{customer.name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{customer.email || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{customer.phone || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{customer.country || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{customer.city || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{customer.address || '-'}</span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(customer)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(customer.id))} 
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
            rowKey={(item) => String(item.id || `customer-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default CustomerTable

