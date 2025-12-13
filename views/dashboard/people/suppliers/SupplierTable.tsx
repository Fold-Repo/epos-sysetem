'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { SupplierType } from '@/types'
import moment from 'moment'

interface SupplierTableProps {
    data: SupplierType[]
    onEdit?: (supplier: SupplierType) => void
    onDelete?: (supplierId: string) => void
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

const SupplierTable = ({
    data,
    onEdit,
    onDelete
}: SupplierTableProps) => {

    const renderRow = (supplier: SupplierType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{supplier.name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.email || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.phone || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.country || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.city || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.address || '-'}</span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(supplier)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(supplier.id))} 
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
            rowKey={(item) => String(item.id || `supplier-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default SupplierTable

