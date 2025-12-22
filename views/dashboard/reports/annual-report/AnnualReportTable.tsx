'use client'

import { TableCell, TableComponent, StatusChip } from '@/components'
import { formatCurrency } from '@/lib'

interface AnnualData {
    id: string
    year: string
    totalSales: number
    totalPurchases: number
    totalExpenses: number
    totalIncome: number
    netProfit: number
    growth: number
}

interface AnnualReportTableProps {
    data: AnnualData[]
}

const columns = [
    { key: 'year', title: 'YEAR' },
    { key: 'totalSales', title: 'TOTAL SALES' },
    { key: 'totalPurchases', title: 'TOTAL PURCHASES' },
    { key: 'totalExpenses', title: 'TOTAL EXPENSES' },
    { key: 'totalIncome', title: 'TOTAL INCOME' },
    { key: 'netProfit', title: 'NET PROFIT' },
    { key: 'growth', title: 'GROWTH' }
]

const AnnualReportTable = ({ data }: AnnualReportTableProps) => {

    const renderRow = (item: AnnualData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium'>{item.year}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.totalSales)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.totalPurchases)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.totalExpenses)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.totalIncome)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.netProfit)}
                    </span>
                </TableCell>
                <TableCell>
                    <StatusChip 
                        status={item.growth > 0 ? 'approved' : 'rejected'} 
                        label={`${item.growth > 0 ? '+' : ''}${item.growth.toFixed(1)}%`}
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
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default AnnualReportTable

