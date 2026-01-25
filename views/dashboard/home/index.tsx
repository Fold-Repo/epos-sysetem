'use client'

import { DashboardBreadCrumb, MetricCard, TrendIndicator } from '@/components'
import { formatCurrency } from '@/lib';
import {
    BuildingStorefrontIcon,
    UserGroupIcon,
    BanknotesIcon
} from '@heroicons/react/24/solid';
import { LuChartSpline } from 'react-icons/lu';
import { RecentSales, RevenueBreakdown, RevenueDistribution, StockAlert, WeeklySales } from './sections';
import { useGetSummaryCards } from '@/services';
import { useMemo } from 'react';

const DashboardView = () => {

    // ================================
    // FETCH SUMMARY CARDS
    // ================================
    const { data: summaryData, isLoading } = useGetSummaryCards()

    // ================================
    // METRICS DATA
    // ================================
    const metricsData = useMemo(() => {
        if (!summaryData || isLoading) {
            return [
                {
                    title: "Total Sales",
                    value: formatCurrency(0),
                    colorClass: "text-[#16A34A]",
                    icon: <LuChartSpline className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Total Purchases",
                    value: formatCurrency(0),
                    colorClass: "text-[#2563EB]",
                    icon: <BuildingStorefrontIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Sales Return",
                    value: formatCurrency(0),
                    colorClass: "text-[#9333EA]",
                    icon: <BanknotesIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Today's Sales",
                    value: formatCurrency(0),
                    colorClass: "text-[#EA580C]",
                    icon: <UserGroupIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                }
            ]
        }

        const getTrend = (percentageChange: number): 'up' | 'down' => {
            return percentageChange >= 0 ? 'up' : 'down'
        }

        return [
            {
                title: "Total Sales",
                value: formatCurrency(summaryData.totalSales.value),
                colorClass: "text-[#16A34A]",
                icon: <LuChartSpline className='size-4' />,
                trend: getTrend(summaryData.totalSales.percentage_change),
                percentage: Math.abs(summaryData.totalSales.percentage_change),
                description: "from last month"
            },
            {
                title: "Total Purchases",
                value: formatCurrency(summaryData.totalPurchases.value),
                colorClass: "text-[#2563EB]",
                icon: <BuildingStorefrontIcon className='size-4' />,
                trend: getTrend(summaryData.totalPurchases.percentage_change),
                percentage: Math.abs(summaryData.totalPurchases.percentage_change),
                description: "from last month"
            },
            {
                title: "Sales Return",
                value: formatCurrency(summaryData.salesReturn.value),
                colorClass: "text-[#9333EA]",
                icon: <BanknotesIcon className='size-4' />,
                trend: getTrend(summaryData.salesReturn.percentage_change),
                percentage: Math.abs(summaryData.salesReturn.percentage_change),
                description: "from last month"
            },
            {
                title: "Today's Sales",
                value: formatCurrency(summaryData.todaySales.value),
                colorClass: "text-[#EA580C]",
                icon: <UserGroupIcon className='size-4' />,
                trend: getTrend(summaryData.todaySales.percentage_change),
                percentage: Math.abs(summaryData.todaySales.percentage_change),
                description: "from last month"
            }
        ]
    }, [summaryData, isLoading])

    return (
        <>
        
            <DashboardBreadCrumb
                title="Dashboard"
                description="Welcome back! Here's what's happening with your store today."
            />

            <div className="p-3 space-y-3">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {metricsData.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            colorClass={metric.colorClass}
                            icon={metric.icon}
                        >
                            <TrendIndicator
                                trend={metric.trend}
                                percentage={metric.percentage}
                                description={metric.description}
                            />
                        </MetricCard>
                    ))}
                </div>

                {/* ================= WEEKLY SALES ================= */}
                <WeeklySales />

                {/* =========== REVENUE DISTRIBUTION / BREAKDOWN =========== */}
                <div className="flex flex-col lg:flex-row gap-3">

                    <div className="w-full lg:w-[50%]">
                        <RevenueDistribution />
                    </div>

                    <div className="w-full lg:w-[50%]">
                        <RevenueBreakdown />
                    </div>

                </div>

                {/* ================= RECENT SALES ================= */}
                <RecentSales />

                {/* ================= STOCK ALERT ================= */}
                <StockAlert />

            </div>

        </>
    )
}

export default DashboardView