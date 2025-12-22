'use client'

import { TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'
import moment from 'moment'

interface TaxData {
    id: string
    reference: string
    supplier: string
    date: string
    store: string
    amount: number
    paymentMethod: string
    discount: number
    taxAmount: number
}

interface TaxReportTableProps {
    data: TaxData[]
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'supplier', title: 'SUPPLIER' },
    { key: 'date', title: 'DATE' },
    { key: 'store', title: 'STORE' },
    { key: 'amount', title: 'AMOUNT' },
    { key: 'paymentMethod', title: 'PAYMENT METHOD' },
    { key: 'discount', title: 'DISCOUNT' },
    { key: 'taxAmount', title: 'TAX AMOUNT' }
]

const TaxReportTable = ({ data }: TaxReportTableProps) => {

    const renderRow = (item: TaxData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium'>{item.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.supplier}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {moment(item.date).format('DD MMM YYYY')}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.store}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.amount)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.paymentMethod}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.discount)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.taxAmount)}
                    </span>
                </TableCell>
            </>
        )
    }

    return (
        <TableComponent
            className='border border-gray-200 overflow-hidden rounded-xl'
            columns={columns}
            data={data}
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default TaxReportTable

