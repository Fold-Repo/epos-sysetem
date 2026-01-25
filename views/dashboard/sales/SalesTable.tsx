'use client'

import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, ArrowDownTrayIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
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
    onDownloadPDF?: (saleId: string) => void
    onCreateReturn?: (saleId: string) => void
    loading?: boolean
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'customer', title: 'CUSTOMER' },
    { key: 'store_name', title: 'STORE' },
    { key: 'status', title: 'STATUS' },
    { key: 'paymentStatus', title: 'PAYMENT STATUS' },
    { key: 'grandTotal', title: 'GRAND TOTAL' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const SalesTable = ({ 
    data, 
    selectedSales,
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete,
    onDownloadPDF,
    onCreateReturn,
    loading = false
}: SalesTableProps) => {

    const renderRow = (sale: SaleType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{sale.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{sale.customer_name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{sale.store_name ?? '-'  }</span>
                </TableCell>
                <TableCell>
                    <StatusChip status={sale.status} />
                </TableCell>
                <TableCell>
                    <StatusChip status={sale.paymentStatus} />
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {sale.grandTotal ? formatCurrency(sale.grandTotal) : '-'}
                    </span>
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
                                key: 'download',
                                label: 'Download PDF',
                                icon: <ArrowDownTrayIcon className='size-4' />
                            },
                            {
                                key: 'createReturn',
                                label: 'Create Return',
                                icon: <ArrowUturnLeftIcon className='size-4' />
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
                            } else if (key === 'download') {
                                onDownloadPDF?.(id)
                            } else if (key === 'createReturn') {
                                onCreateReturn?.(id)
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
            withCheckbox={true}
            onSelectionChange={onSelectionChange}
            loading={loading}
        />
    )
}

export default SalesTable
