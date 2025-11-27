'use client'

import { DashboardCard, ProgressBar } from '@/components'
import { getRevenueDistributionData } from '@/data'
import React from 'react'

const RevenueDistribution = () => {
    const revenueData = getRevenueDistributionData();

    return (
        <DashboardCard title='Revenue Distribution'>
            <div className="space-y-4">
                {revenueData.map((item, index) => (
                    <ProgressBar
                        key={item.label}
                        label={item.label}
                        amount={`${item.value} (${item.percentage.toFixed(2)}%)`}
                        percentage={item.percentage}
                        color={item.color}
                        showTooltip={false}
                        animationDelay={index * 0.1}
                    />
                ))}
            </div>
        </DashboardCard>
    )
}

export default RevenueDistribution