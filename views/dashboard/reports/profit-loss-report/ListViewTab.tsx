'use client'

import { FilterBar, ExportButton, TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'

const ListViewTab = () => {

    const months = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025']
    
    // Income data
    const incomeData = [
        {
            id: 'income-1',
            category: 'Sales',
            jan: 50000,
            feb: 50000,
            mar: 50000,
            apr: 50000,
            may: 50000,
            jun: 50000,
            total: 300000,
            isBold: false
        },
        {
            id: 'income-2',
            category: 'Service',
            jan: 30000,
            feb: 30000,
            mar: 30000,
            apr: 30000,
            may: 30000,
            jun: 30000,
            total: 180000,
            isBold: false
        },
        {
            id: 'income-3',
            category: 'Purchase Return',
            jan: 7000,
            feb: 7000,
            mar: 7000,
            apr: 7000,
            may: 7000,
            jun: 7000,
            total: 42000,
            isBold: false
        },
        {
            id: 'income-4',
            category: 'Gross Profit',
            jan: 8000,
            feb: 8000,
            mar: 8000,
            apr: 8000,
            may: 8000,
            jun: 8000,
            total: 48000,
            isBold: true
        }
    ]

    // Expenses data
    const expensesData = [
        {
            id: 'expense-1',
            category: 'Sales',
            jan: 50000,
            feb: 50000,
            mar: 50000,
            apr: 50000,
            may: 50000,
            jun: 50000,
            total: 300000,
            isBold: false
        },
        {
            id: 'expense-2',
            category: 'Purchase',
            jan: 30000,
            feb: 30000,
            mar: 30000,
            apr: 30000,
            may: 30000,
            jun: 30000,
            total: 180000,
            isBold: false
        },
        {
            id: 'expense-3',
            category: 'Sales Return',
            jan: 7000,
            feb: 7000,
            mar: 7000,
            apr: 7000,
            may: 7000,
            jun: 7000,
            total: 42000,
            isBold: false
        },
        {
            id: 'expense-4',
            category: 'Total Expense',
            jan: 8000,
            feb: 8000,
            mar: 8000,
            apr: 8000,
            may: 8000,
            jun: 8000,
            total: 48000,
            isBold: true
        }
    ]

    // Net Profit data
    const netProfitData = [
        {
            id: 'net-profit',
            category: 'Net Profit',
            jan: 8000,
            feb: 8000,
            mar: 8000,
            apr: 8000,
            may: 8000,
            jun: 8000,
            total: 48000,
            isBold: true
        }
    ]

    const columns = [
        { key: 'category', title: 'CATEGORY' },
        { key: 'jan', title: 'JAN 2025' },
        { key: 'feb', title: 'FEB 2025' },
        { key: 'mar', title: 'MAR 2025' },
        { key: 'apr', title: 'APR 2025' },
        { key: 'may', title: 'MAY 2025' },
        { key: 'jun', title: 'JUN 2025' }
    ]

    const renderRow = (item: typeof incomeData[0]) => {
        return (
            <>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {item.category}
                    </span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {formatCurrency(item.jan)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {formatCurrency(item.feb)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {formatCurrency(item.mar)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {formatCurrency(item.apr)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {formatCurrency(item.may)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {formatCurrency(item.jun)}
                    </span>
                </TableCell>
            </>
        )
    }

    const filterItems = [
        {
            type: 'dateRange' as const,
            label: 'Date Range',
            placeholder: 'Select date range'
        }
    ]

    return (
        <div className="space-y-6">
            
            <FilterBar
                searchInput={{
                    placeholder: 'Search...',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
            />

            {/* ================= Income Section ================= */}
            <div className="space-y-2">

                <h3 className="text-base font-medium text-gray-800">Income</h3>

                <TableComponent
                    className='border border-gray-200 overflow-hidden rounded-xl'
                    columns={columns}
                    data={incomeData}
                    rowKey={(item) => item.id}
                    renderRow={renderRow}
                    withCheckbox={false}
                    loading={false}
                />
            </div>

            {/* ================= Expenses Section ================= */}
            <div className="space-y-2">

                <h3 className="font-medium text-gray-800">Expenses</h3>

                <TableComponent
                    className='border border-gray-200 overflow-hidden rounded-xl'
                    columns={columns}
                    data={expensesData}
                    rowKey={(item) => item.id}
                    renderRow={renderRow}
                    withCheckbox={false}
                    loading={false}
                />
            </div>

            {/* ================= Net Profit Section ================= */}
            <div className="space-y-2">

                <h3 className="font-medium text-gray-800">Net Profit</h3>

                <TableComponent
                    className='border border-gray-200 overflow-hidden rounded-xl'
                    columns={columns}
                    data={netProfitData}
                    rowKey={(item) => item.id}
                    renderRow={renderRow}
                    withCheckbox={false}
                    loading={false}
                />
            </div>

        </div>
    )
}

export default ListViewTab

