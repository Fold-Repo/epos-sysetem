'use client'

import { TableCell, TableComponent, StatusChip } from '@/components'
import { formatCurrency } from '@/lib'
import moment from 'moment'

interface ExpenseData {
    id: string
    expenseName: string
    category: string
    description: string
    date: string
    amount: number
    status: string
}

interface ExpensesReportTableProps {
    data: ExpenseData[]
}

const columns = [
    { key: 'expenseName', title: 'EXPENSE NAME' },
    { key: 'category', title: 'CATEGORY' },
    { key: 'description', title: 'DESCRIPTION' },
    { key: 'date', title: 'DATE' },
    { key: 'amount', title: 'AMOUNT' },
    { key: 'status', title: 'STATUS' }
]

const ExpensesReportTable = ({ data }: ExpensesReportTableProps) => {

    const renderRow = (item: ExpenseData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium'>{item.expenseName}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs text-gray-600'>{item.description}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {moment(item.date).format('DD MMM YYYY')}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.amount)}
                    </span>
                </TableCell>
                <TableCell>
                    <StatusChip status={item.status} />
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

export default ExpensesReportTable

