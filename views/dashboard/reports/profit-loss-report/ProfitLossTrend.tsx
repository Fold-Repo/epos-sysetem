'use client'

import { useState } from 'react'
import { DashboardCard, ChartLegend, AreaChart } from '@/components'
import { formatCurrency } from '@/lib'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface ProfitLossTrendProps {
    labels: string[]
    data: Array<{
        grossProfit: number
        totalExpense: number
        netProfit: number
    }>
    loading?: boolean
}

const ProfitLossTrend = ({ labels, data, loading = false }: ProfitLossTrendProps) => {
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

    const chartData = labels.map((label, index) => ({
        month: label,
        grossProfit: data[index]?.grossProfit ?? 0,
        totalExpense: data[index]?.totalExpense ?? 0,
        netProfit: data[index]?.netProfit ?? 0,
    }))

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
            {loading ? (
                <div className="h-[300px] w-full rounded-xl bg-slate-100 animate-pulse" />
            ) : (
                <AreaChart
                    data={chartData}
                    xAxisKey="month"
                    series={areaSeries}
                    customTooltip={CustomTooltip}
                    yAxisFormatter={(value) => formatCurrency(value)}
                    height={300}
                />
            )}
        </DashboardCard>
    )
}

export default ProfitLossTrend

