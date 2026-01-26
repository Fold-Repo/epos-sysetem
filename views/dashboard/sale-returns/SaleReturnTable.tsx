'use client'

import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { EllipsisVerticalIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { SaleReturnType } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'

interface SaleReturnTableProps {
    data: SaleReturnType[]
    selectedReturns?: SaleReturnType[]
    onSelectionChange?: (selected: SaleReturnType[]) => void
    onView?: (returnId: string) => void
    loading?: boolean
}

const columns = [
    { key: 'sale_reference', title: 'SALE REFERENCE' },
    { key: 'customer', title: 'CUSTOMER' },
    { key: 'store_name', title: 'STORE' },
    { key: 'total_refund', title: 'TOTAL REFUND' },
    { key: 'reason', title: 'REASON' },
    { key: 'user_name', title: 'CREATED BY' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const SaleReturnTable = ({ 
    data, 
    selectedReturns,
    onSelectionChange, 
    onView,
    loading = false
}: SaleReturnTableProps) => {

    const renderRow = (returnItem: SaleReturnType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{returnItem.sale_reference || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{returnItem.customer_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{returnItem.store_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {returnItem.total_refund ? formatCurrency(returnItem.total_refund) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{returnItem.reason || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{returnItem.user_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {returnItem.created_at 
                            ? moment(returnItem.created_at).format('LLL')
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
                            }
                        ]}
                        onChange={(key) => {
                            if (!returnItem.id) return
                            const id = String(returnItem.id)
                            if (key === 'view') {
                                onView?.(id)
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
            rowKey={(item) => String(item.id || `sr-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={!!onSelectionChange}
            onSelectionChange={onSelectionChange}
            loading={loading}
        />
    )
}

export default SaleReturnTable
