'use client'

import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { PurchaseType } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'
import { StatusChip } from '@/components'

interface PurchaseTableProps {
    data: PurchaseType[]
    selectedPurchases?: PurchaseType[]
    onSelectionChange?: (selected: PurchaseType[]) => void
    onView?: (purchaseId: string) => void
    onEdit?: (purchaseId: string) => void
    onDelete?: (purchaseId: string) => void
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'supplier', title: 'SUPPLIER' },
    { key: 'status', title: 'STATUS' },
    { key: 'paymentStatus', title: 'PAYMENT STATUS' },
    { key: 'grandTotal', title: 'GRAND TOTAL' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const PurchaseTable = ({ 
    data, 
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete
}: PurchaseTableProps) => {

    const renderRow = (purchase: PurchaseType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{purchase.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{purchase.supplier}</span>
                </TableCell>
                <TableCell>
                    <StatusChip status={purchase.status} />
                </TableCell>
                <TableCell>
                    <StatusChip status={purchase.paymentStatus} />
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {purchase.grandTotal ? formatCurrency(purchase.grandTotal) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {purchase.created_at 
                            ? moment(purchase.created_at).format('LLL')
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
                            if (!purchase.id) return
                            const id = String(purchase.id)
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
            rowKey={(item) => String(item.id || `pur-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default PurchaseTable

