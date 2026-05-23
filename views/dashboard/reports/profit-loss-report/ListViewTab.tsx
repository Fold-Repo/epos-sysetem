'use client'

import { TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'
import { ProfitLossPeriodItem } from '@/services'

interface ListViewTabProps {
    data: ProfitLossPeriodItem[]
    loading?: boolean
}

type ReportRow = {
    id: string
    category: string
    isBold: boolean
    values: Record<string, number>
}

const getMonthLabel = (period: string) => {
    const parsedDate = new Date(`${period}-01`)
    return parsedDate.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
}

const ListViewTab = ({ data, loading = false }: ListViewTabProps) => {
    const periods = data.map((item) => item.period)

    const createRow = (
        id: string,
        category: string,
        isBold: boolean,
        getValue: (item: ProfitLossPeriodItem) => number
    ): ReportRow => ({
        id,
        category,
        isBold,
        values: Object.fromEntries(data.map((item) => [item.period, getValue(item)]))
    })

    const incomeData: ReportRow[] = [
        createRow('income-sales', 'Sales', false, (item) => item.income.sales),
        createRow('income-service', 'Service', false, (item) => item.income.service),
        createRow('income-purchase-return', 'Purchase Return', false, (item) => item.income.purchase_return),
        createRow('income-gross-profit', 'Gross Profit', true, (item) => item.income.gross_profit),
    ]

    const expensesData: ReportRow[] = [
        createRow('expense-sales', 'Sales', false, (item) => item.expenses.sales),
        createRow('expense-purchase', 'Purchase', false, (item) => item.expenses.purchase),
        createRow('expense-sales-return', 'Sales Return', false, (item) => item.expenses.sales_return),
        createRow('expense-total-expense', 'Total Expense', true, (item) => item.expenses.total_expense),
    ]

    const netProfitData: ReportRow[] = [
        createRow('net-profit', 'Net Profit', true, (item) => item.netProfit),
    ]

    const columns = [
        { key: 'category', title: 'CATEGORY' },
        ...periods.map((period) => ({ key: period, title: getMonthLabel(period) }))
    ]

    const renderRow = (item: ReportRow) => {
        return (
            <>
                <TableCell>
                    <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                        {item.category}
                    </span>
                </TableCell>
                {periods.map((period) => (
                    <TableCell key={`${item.id}-${period}`}>
                        <span className={`text-xs ${item.isBold ? 'font-bold' : ''}`}>
                            {formatCurrency(item.values[period] ?? 0)}
                        </span>
                    </TableCell>
                ))}
            </>
        )
    }

    return (
        <div className="space-y-6">
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
                    loading={loading}
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
                    loading={loading}
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
                    loading={loading}
                />
            </div>

        </div>
    )
}

export default ListViewTab

