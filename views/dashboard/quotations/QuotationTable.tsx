import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { QuotationType } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'
import { StatusChip } from '@/components'

interface QuotationTableProps {
    data: QuotationType[]
    selectedQuotations?: QuotationType[]
    onSelectionChange?: (selected: QuotationType[]) => void
    onView?: (quotationId: string) => void
    onEdit?: (quotationId: string) => void
    onDelete?: (quotationId: string) => void
    onDownloadPDF?: (quotationId: string) => void
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'customer', title: 'CUSTOMER' },
    { key: 'status', title: 'STATUS' },
    { key: 'grandTotal', title: 'GRAND TOTAL' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const QuotationTable = ({ 
    data, 
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete,
    onDownloadPDF
}: QuotationTableProps) => {

    const renderRow = (quotation: QuotationType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{quotation.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{quotation.customer}</span>
                </TableCell>
                <TableCell>
                    <StatusChip status={quotation.status} />
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {quotation.grandTotal ? formatCurrency(quotation.grandTotal) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {quotation.created_at 
                            ? moment(quotation.created_at).format('LLL')
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
                                key: 'delete',
                                label: 'Delete',
                                icon: <TrashIcon className='size-4' />,
                                className: 'text-danger'
                            }
                        ]}
                        onChange={(key) => {
                            if (!quotation.id) return
                            const id = String(quotation.id)
                            if (key === 'view') {
                                onView?.(id)
                            } else if (key === 'edit') {
                                onEdit?.(id)
                            } else if (key === 'download') {
                                onDownloadPDF?.(id)
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
            rowKey={(item) => String(item.id || `qt-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default QuotationTable

