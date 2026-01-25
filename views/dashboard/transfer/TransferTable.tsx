'use client'
import { TableCell, TableComponent, MenuDropdown, TrashIcon, StatusChip } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TransferType } from '@/types'
import moment from 'moment'

interface TransferTableProps {
    data: TransferType[]
    selectedTransfers?: TransferType[]
    onSelectionChange?: (selected: TransferType[]) => void
    onView?: (transferId: string) => void
    onEdit?: (transferId: string) => void
    onDelete?: (transferId: string) => void
    loading?: boolean
}

const columns = [
    { key: 'product', title: 'PRODUCT' },
    { key: 'from_store', title: 'FROM STORE' },
    { key: 'to_store', title: 'TO STORE' },
    { key: 'quantity', title: 'QUANTITY' },
    { key: 'status', title: 'STATUS' },
    { key: 'created_by', title: 'CREATED BY' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const TransferTable = ({ 
    data, 
    selectedTransfers,
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete,
    loading = false
}: TransferTableProps) => {

    const renderRow = (transfer: TransferType) => {
        return (
            <>
                <TableCell>
                    <div>
                        <div className='text-xs font-medium'>{transfer.product_name || '-'}</div>
                        <div className='text-xs text-gray-500'>SKU: {transfer.product_sku || '-'}</div>
                        {transfer.variation_type && transfer.variation_value && (
                            <div className='text-xs text-gray-400'>
                                {transfer.variation_type}: {transfer.variation_value}
                            </div>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.from_store_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.to_store_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.quantity || '-'}</span>
                </TableCell>
                <TableCell>
                    <StatusChip 
                        status={transfer.status || 'pending'} 
                    />
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{transfer.created_by_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {transfer.created_at ? moment(transfer.created_at).format('LLL') : '-'}
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
                            if (!transfer.transfer_id) return
                            const id = String(transfer.transfer_id)
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
            rowKey={(item) => String(item.transfer_id || `transfer-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={!!onSelectionChange}
            onSelectionChange={onSelectionChange}
            loading={loading}
        />
    )
}

export default TransferTable