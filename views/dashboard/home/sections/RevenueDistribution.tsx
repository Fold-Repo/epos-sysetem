'use client'

import { DashboardCard, ProgressBar } from '@/components'
import { useGetRevenueData } from '@/services'
import { formatCurrency } from '@/lib'
import { Spinner } from '@heroui/react'
import React from 'react'

const RevenueDistribution = () => {
    const { data: revenueData = [], isLoading } = useGetRevenueData();

    return (
        <DashboardCard className='h-full' title='Revenue Distribution'>
            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[20vh]">
                    <Spinner color="primary" size="lg" />
                </div>
            ) : revenueData.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[20vh]">
                    <p className="text-sm text-slate-400">No revenue data available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {revenueData.map((item, index) => (
                        <ProgressBar
                            key={`${item.label}-${index}`}
                            label={item.label}
                            amount={`${formatCurrency(item.value)} (${item.percentage.toFixed(2)}%)`}
                            percentage={item.percentage}
                            color={item.color}
                            showTooltip={false}
                            animationDelay={index * 0.1}
                        />
                    ))}
                </div>
            )}
        </DashboardCard>
    )
}

export default RevenueDistribution