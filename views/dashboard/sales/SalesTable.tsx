'use client'

import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { SaleType } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'
import { StatusChip } from '@/components'

interface SalesTableProps {
    data: SaleType[]
    selectedSales?: SaleType[]
    onSelectionChange?: (selected: SaleType[]) => void
    onView?: (saleId: string) => void
    onEdit?: (saleId: string) => void
    onDelete?: (saleId: string) => void
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'user', title: 'USER' },
    { key: 'customer', title: 'CUSTOMER' },
    { key: 'status', title: 'STATUS' },
    { key: 'grandTotal', title: 'GRAND TOTAL' },
    { key: 'paid', title: 'PAID' },
    { key: 'due', title: 'DUE' },
    { key: 'paymentStatus', title: 'PAYMENT STATUS' },
    { key: 'paymentType', title: 'PAYMENT TYPE' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const SalesTable = ({ 
    data, 
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete
}: SalesTableProps) => {

    const renderRow = (sale: SaleType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{sale.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{sale.user}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{sale.customer}</span>
                </TableCell>
                <TableCell>
                    <StatusChip status={sale.status} />
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {sale.grandTotal ? formatCurrency(sale.grandTotal) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {sale.paid !== undefined ? formatCurrency(sale.paid) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {sale.due !== undefined ? formatCurrency(sale.due) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <StatusChip status={sale.paymentStatus} />
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{sale.paymentType || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {sale.created_at 
                            ? moment(sale.created_at).format('LLL')
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
                                key: 'view',
                                label: 'View',
                                icon: <EyeIcon className='size-4' />
                            },
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
                            if (!sale.id) return
                            const id = String(sale.id)
                            if (key === 'view') {
                                onView?.(id)
                            } else if (key === 'edit') {
                                onEdit?.(id)
                            } else if (key === 'delete') {
                                onDelete?.(id)
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
            rowKey={(item) => String(item.id || `sale-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default SalesTable

