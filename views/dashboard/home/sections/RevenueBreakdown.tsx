'use client'

import { DashboardCard, DonutChart, ChartLegend } from '@/components'
import { getRevenueBreakdownData } from '@/data'
import React from 'react'

const RevenueBreakdown = () => {
    const { data, total } = getRevenueBreakdownData();

    const legendItems = data.map(item => ({
        dataKey: item.name.toLowerCase(),
        label: item.name,
        color: item.color,
        visible: true,
    }));

    const chartData = data.map(item => ({
        name: item.name,
        value: item.value,
        color: item.color,
        percentage: item.percentage,
    }));

    return (
        <DashboardCard title='Revenue Breakdown'>
            <div className="flex items-center gap-3">
                
                <div className="flex-1">
                    <DonutChart
                        data={chartData}
                        total={total}
                        totalLabel="Total Breakdown"
                        innerRadius={70}
                        outerRadius={100}
                        height={250}
                    />
                </div>

                <div className="shrink-0">
                    <div className="space-y-4">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center gap-3">
                                <div className="size-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#0B1221]">
                                        {item.name}:
                                    </span>
                                    <span className="text-sm font-semibold text-[#0B1221]">
                                        {item.value}
                                    </span>
                                    <span className="text-sm text-slate-400">
                                        ({item.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardCard>
    )
}

export default RevenueBreakdown