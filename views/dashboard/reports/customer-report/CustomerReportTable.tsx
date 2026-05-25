'use client'

import { TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'

interface CustomerData {
    id: string
    reference: string
    code: string
    customerName: string
    totalOrders: number
    amount: number
    paid: number
    due: number
    paymentMethod: string
}

interface CustomerReportTableProps {
    data: CustomerData[]
    loading?: boolean
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'code', title: 'CODE' },
    { key: 'customer', title: 'CUSTOMER' },
    { key: 'totalOrders', title: 'TOTAL ORDERS' },
    { key: 'amount', title: 'AMOUNT' },
    { key: 'paid', title: 'PAID' },
    { key: 'due', title: 'DUE' },
    { key: 'paymentMethod', title: 'PAYMENT METHOD' }
]

const CustomerReportTable = ({ data, loading = false }: CustomerReportTableProps) => {

    const renderRow = (item: CustomerData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{item.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.code}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.customerName}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.totalOrders}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.amount)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.paid)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.due)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.paymentMethod}</span>
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
            loading={loading}
        />
    )
}

export default CustomerReportTable

