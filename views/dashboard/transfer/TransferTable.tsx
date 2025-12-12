'use client'

import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TransferType } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'
import { StatusChip } from '@/components'

interface TransferTableProps {
    data: TransferType[]
    selectedTransfers?: TransferType[]
    onSelectionChange?: (selected: TransferType[]) => void
    onView?: (transferId: string) => void
    onEdit?: (transferId: string) => void
    onDelete?: (transferId: string) => void
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'fromStore', title: 'FROM STORE' },
    { key: 'toStore', title: 'TO STORE' },
    { key: 'items', title: 'ITEMS' },
    { key: 'grandTotal', title: 'GRAND TOTAL' },
    { key: 'status', title: 'STATUS' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const TransferTable = ({ 
    data, 
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete
}: TransferTableProps) => {

    const renderRow = (transfer: TransferType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{transfer.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.fromStore}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.toStore}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.items || 0}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {transfer.grandTotal ? formatCurrency(transfer.grandTotal) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <StatusChip status={transfer.status} />
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {transfer.created_at 
                            ? moment(transfer.created_at).format('LLL')
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
                            if (!transfer.id) return
                            const id = String(transfer.id)
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
            rowKey={(item) => String(item.id || `transfer-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default TransferTable

