'use client'

import { TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'
import { Avatar } from '@heroui/react'

interface CustomerData {
    id: string
    reference: string
    code: string
    customerName: string
    customerImage: string
    phone: string
    totalOrders: number
    amount: number
    paid: number
    due: number
    paymentMethod: string
    status: string
}

interface CustomerReportTableProps {
    data: CustomerData[]
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

const CustomerReportTable = ({ data }: CustomerReportTableProps) => {

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
                    <div className="flex items-center gap-2">
                        <Avatar 
                            src={item.customerImage} 
                            name={item.customerName}
                            size="sm"
                            className="flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className='text-xs'>{item.customerName}</span>
                            <span className='text-xs text-gray-500'>{item.phone}</span>
                        </div>
                    </div>
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
            loading={false}
        />
    )
}

export default CustomerReportTable

