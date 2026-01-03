'use client'

import { TableCell, TableComponent, TrashIcon, MenuDropdown } from '@/components'
import { PencilIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { Supplier } from '@/types/supplier.type'
import moment from 'moment'

interface SupplierTableProps {
    data: Supplier[]
    isLoading?: boolean
    onEdit?: (supplier: Supplier) => void
    onDelete?: (supplierId: number) => void
}

const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'address', title: 'Address' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'actions', title: 'Action' }
]

const SupplierTable = ({
    data,
    isLoading = false,
    onEdit,
    onDelete
}: SupplierTableProps) => {

    const renderRow = (supplier: Supplier) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium'>{supplier.name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.email}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{supplier.phone}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs line-clamp-1'>{supplier.address}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {supplier.created_at 
                            ? moment(supplier.created_at).format('lll')
                            : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <MenuDropdown
                        trigger={
                            <Button isIconOnly size='sm' className='bg-gray-100/80' radius='full'>
                                <EllipsisVerticalIcon className='size-4' />
                            </Button>
                        }
                        items={[
                            {
                                key: 'edit',
                                label: 'Edit',
                                icon: <PencilIcon className='size-4' />
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                                icon: <TrashIcon className='size-4' />,
                                className: 'text-danger'
                            }
                        ]}
                        onChange={(key) => {
                            if (key === 'edit') {
                                onEdit?.(supplier)
                            } else if (key === 'delete') {
                                onDelete?.(supplier.supplier_id)
                            }
                        }}
                    />
                </TableCell>
            </>
        )
    }

    return (
        <TableComponent
            className='border border-gray-200 overflow-hidden rounded-xl'
            columns={columns}
            data={data}
            rowKey={(item) => String(item.supplier_id)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={isLoading}
        />
    )
}

export default SupplierTable

