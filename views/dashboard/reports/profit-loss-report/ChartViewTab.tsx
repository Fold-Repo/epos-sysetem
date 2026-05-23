'use client'

import IncomeOverview from './IncomeOverview'
import ProfitLossTrend from './ProfitLossTrend'

interface ChartViewTabProps {
    labels: string[]
    incomeOverview: Array<{
        sales: number
        service: number
        purchaseReturn: number
        grossProfit: number
    }>
    trend: Array<{
        grossProfit: number
        totalExpense: number
        netProfit: number
    }>
    loading?: boolean
}

const ChartViewTab = ({ labels, incomeOverview, trend, loading = false }: ChartViewTabProps) => {
    return (
        <div className="space-y-6">

            <IncomeOverview labels={labels} data={incomeOverview} loading={loading} />
            
            <ProfitLossTrend labels={labels} data={trend} loading={loading} />

        </div>
    )
}

export default ChartViewTab

