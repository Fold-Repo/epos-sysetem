'use client'

import { DashboardCard, BarChart } from '@/components'
import { formatCurrency } from '@/lib'

const IncomeOverview = () => {
    
    // ================= Chart Data =================
    const chartData = [
        { month: 'Jan', grossProfit: 7000, totalExpense: 8500, netProfit: 10000 },
        { month: 'Feb', grossProfit: 7200, totalExpense: 8700, netProfit: 10200 },
        { month: 'Mar', grossProfit: 7500, totalExpense: 9000, netProfit: 10500 },
        { month: 'Apr', grossProfit: 7300, totalExpense: 8800, netProfit: 10300 },
        { month: 'May', grossProfit: 7600, totalExpense: 9100, netProfit: 10600 },
        { month: 'Jun', grossProfit: 7800, totalExpense: 9300, netProfit: 10800 },
        { month: 'Jul', grossProfit: 8000, totalExpense: 9500, netProfit: 11000 },
        { month: 'Aug', grossProfit: 7900, totalExpense: 9400, netProfit: 10900 },
        { month: 'Sep', grossProfit: 8200, totalExpense: 9700, netProfit: 11200 },
        { month: 'Oct', grossProfit: 8400, totalExpense: 9900, netProfit: 11400 },
        { month: 'Nov', grossProfit: 8600, totalExpense: 10100, netProfit: 11600 },
        { month: 'Dec', grossProfit: 8800, totalExpense: 10300, netProfit: 11800 },
    ]

    // ================= Bar Chart Series =================
    const barSeries = [
        {
            name: 'Sales',
            data: [50000, 55000, 48000, 52000, 58000, 51000, 56000, 60000, 54000, 59000, 63000, 57000],
            color: '#3B82F6'
        },
        {
            name: 'Service',
            data: [30000, 34000, 28000, 32000, 36000, 29000, 33000, 37000, 31000, 35000, 38000, 32000],
            color: '#10B981'
        },
        {
            name: 'Purchase Return',
            data: [7000, 8000, 6500, 7500, 8500, 6800, 7800, 8800, 7200, 8200, 9000, 7500],
            color: '#8B5CF6'
        },
        {
            name: 'Gross Profit',
            data: [7000, 8500, 6000, 7500, 9000, 6500, 8000, 9500, 7000, 8500, 10000, 7500],
            color: '#F59E0B'
        }
    ]

    return (
        <DashboardCard bodyClassName='space-y-4'>

            <h3 className="text-base font-medium text-gray-800">Income Overview</h3>
            
            <BarChart
                series={barSeries}
                categories={chartData.map(item => item.month)}
                height={350}
                showLegend={true}
                borderRadius={4}
                columnWidth="40%"
                legendPosition="top"
                yAxisFormatter={(value) => formatCurrency(value)}
            />

        </DashboardCard>
    )
}

export default IncomeOverview

