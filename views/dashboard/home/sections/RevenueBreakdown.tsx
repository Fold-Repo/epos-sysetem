'use client'

import { DashboardCard, DonutChart, ChartLegend } from '@/components'
import { useGetRevenueBreakdownData } from '@/services'
import { Spinner } from '@heroui/react'
import React from 'react'

const RevenueBreakdown = () => {
    const { data, isLoading } = useGetRevenueBreakdownData();
    
    const breakdownData = data?.data || [];
    const total = data?.total || 0;

    const legendItems = breakdownData.map(item => ({
        dataKey: item.name.toLowerCase(),
        label: item.name,
        color: item.color,
        visible: true,
    }));

    const chartData = breakdownData.map(item => ({
        name: item.name,
        value: item.value,
        color: item.color,
        percentage: item.percentage,
    }));

    return (
        <DashboardCard title='Revenue Breakdown'>
            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[20vh]">
                    <Spinner color="primary" size="lg" />
                </div>
            ) : breakdownData.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[20vh]">
                    <p className="text-sm text-slate-400">No breakdown data available</p>
                </div>
            ) : (
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
                            {breakdownData.map((item) => (
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
            )}
        </DashboardCard>
    )
}

export default RevenueBreakdown