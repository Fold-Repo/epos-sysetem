'use client'

import { useState } from 'react'
import { DashboardCard, ChartLegend, AreaChart } from '@/components'
import { formatCurrency } from '@/lib'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

const ProfitLossTrend = () => {
    const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
        grossProfit: true,
        totalExpense: true,
        netProfit: true,
    });

    const toggleSeries = (dataKey: string) => {
        setVisibleSeries(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };

    // ================= Chart Data =================
    const chartData = [
        { month: 'Jan', grossProfit: 5000, totalExpense: 12000, netProfit: 20000 },
        { month: 'Feb', grossProfit: 6500, totalExpense: 13500, netProfit: 22000 },
        { month: 'Mar', grossProfit: 4500, totalExpense: 11000, netProfit: 19000 },
        { month: 'Apr', grossProfit: 7000, totalExpense: 14000, netProfit: 24000 },
        { month: 'May', grossProfit: 5500, totalExpense: 12500, netProfit: 21000 },
        { month: 'Jun', grossProfit: 8000, totalExpense: 15000, netProfit: 26000 },
        { month: 'Jul', grossProfit: 6000, totalExpense: 13000, netProfit: 23000 },
        { month: 'Aug', grossProfit: 7500, totalExpense: 14500, netProfit: 25000 },
        { month: 'Sep', grossProfit: 5200, totalExpense: 12200, netProfit: 20500 },
        { month: 'Oct', grossProfit: 6800, totalExpense: 13800, netProfit: 23500 },
        { month: 'Nov', grossProfit: 8500, totalExpense: 15500, netProfit: 27000 },
        { month: 'Dec', grossProfit: 6200, totalExpense: 13200, netProfit: 22500 },
    ]

    const legendItems = [
        {
            dataKey: 'grossProfit',
            label: 'Gross Profit',
            color: '#10B981',
            visible: visibleSeries.grossProfit,
        },
        {
            dataKey: 'totalExpense',
            label: 'Total Expense',
            color: '#EF4444',
            visible: visibleSeries.totalExpense,
        },
        {
            dataKey: 'netProfit',
            label: 'Net Profit',
            color: '#3B82F6',
            visible: visibleSeries.netProfit,
        },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const labels: Record<string, string> = {
                grossProfit: 'Gross Profit',
                totalExpense: 'Total Expense',
                netProfit: 'Net Profit',
            };
            return (
                <div className="bg-white px-3 py-2.5 rounded-lg shadow-lg border border-[#E2E4E9]">
                    <p className="text-[11px] text-slate-400 mb-2">
                        {data.month}
                    </p>
                    <div className="space-y-2">
                        {payload.map((item: any, index: number) => {
                            const colorMap: Record<string, string> = {
                                grossProfit: '#10B981',
                                totalExpense: '#EF4444',
                                netProfit: '#3B82F6',
                            };
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <div 
                                        className="w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: colorMap[item.dataKey] || '#3B82F6'
                                        }}>
                                        <ArrowTrendingUpIcon className='size-4 text-white' />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            {labels[item.dataKey] || item.dataKey}
                                        </p>
                                        <p className="text-sm font-semibold text-text-color">
                                            {formatCurrency(item.value)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    const areaSeries = [
        {
            dataKey: 'grossProfit',
            strokeColor: '#10B981',
            gradientId: 'grossProfitGradient',
            gradientColorStart: '#10B981',
            gradientColorEnd: '#10B981',
            gradientOpacityStart: 0.4,
            gradientOpacityEnd: 0.05,
            strokeWidth: 2.5,
            showDots: false,
            hide: !visibleSeries.grossProfit,
        },
        {
            dataKey: 'totalExpense',
            strokeColor: '#EF4444',
            gradientId: 'totalExpenseGradient',
            gradientColorStart: '#EF4444',
            gradientColorEnd: '#EF4444',
            gradientOpacityStart: 0.4,
            gradientOpacityEnd: 0.05,
            strokeWidth: 2.5,
            showDots: false,
            hide: !visibleSeries.totalExpense,
        },
        {
            dataKey: 'netProfit',
            strokeColor: '#3B82F6',
            gradientId: 'netProfitGradient',
            gradientColorStart: '#3B82F6',
            gradientColorEnd: '#3B82F6',
            gradientOpacityStart: 0.4,
            gradientOpacityEnd: 0.05,
            strokeWidth: 2.5,
            showDots: false,
            hide: !visibleSeries.netProfit,
        }
    ]

    return (
        <DashboardCard 
            title='Profit & Loss Trend'
            headerActions={
                <ChartLegend
                    items={legendItems}
                    onToggle={toggleSeries}
                    indicatorSize="md"
                    textSize="xs"
                    gap="md"
                />
            }
        >
            <AreaChart
                data={chartData}
                xAxisKey="month"
                series={areaSeries}
                customTooltip={CustomTooltip}
                yAxisFormatter={(value) => {
                    const thousands = Math.round(value / 1000);
                    return formatCurrency(thousands).replace(/\.\d+/, '') + 'k';
                }}
                height={300}
            />
        </DashboardCard>
    )
}

export default ProfitLossTrend

