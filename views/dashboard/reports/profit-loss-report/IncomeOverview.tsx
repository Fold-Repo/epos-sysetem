'use client'

import { DashboardCard, BarChart } from '@/components'
import { formatCurrency } from '@/lib'

interface IncomeOverviewProps {
    labels: string[]
    data: Array<{
        sales: number
        service: number
        purchaseReturn: number
        grossProfit: number
    }>
    loading?: boolean
}

const IncomeOverview = ({ labels, data, loading = false }: IncomeOverviewProps) => {

    // ================= Bar Chart Series =================
    const barSeries = [
        {
            name: 'Sales',
            data: data.map((item) => item.sales),
            color: '#3B82F6'
        },
        {
            name: 'Service',
            data: data.map((item) => item.service),
            color: '#10B981'
        },
        {
            name: 'Purchase Return',
            data: data.map((item) => item.purchaseReturn),
            color: '#8B5CF6'
        },
        {
            name: 'Gross Profit',
            data: data.map((item) => item.grossProfit),
            color: '#F59E0B'
        }
    ]

    return (
        <DashboardCard bodyClassName='space-y-4'>

            <h3 className="text-base font-medium text-gray-800">Income Overview</h3>
            
            {loading ? (
                <div className="h-[350px] w-full rounded-xl bg-slate-100 animate-pulse" />
            ) : (
                <BarChart
                    series={barSeries}
                        categories={labels}
                    height={350}
                    showLegend={true}
                    borderRadius={4}
                    columnWidth="40%"
                    legendPosition="top"
                    yAxisFormatter={(value) => formatCurrency(value)}
                />
            )}

        </DashboardCard>
    )
}

export default IncomeOverview

