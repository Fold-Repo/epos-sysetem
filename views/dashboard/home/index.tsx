import { DashboardBreadCrumb, MetricCard } from '@/components'
import { formatCurrency } from '@/lib';
import {
    BuildingStorefrontIcon,
    UserGroupIcon,
    BanknotesIcon
} from '@heroicons/react/24/solid';
import { LuChartSpline } from 'react-icons/lu';
import { RecentSales, RevenueBreakdown, RevenueDistribution, StockAlert, WeeklySales } from './sections';

const DashboardView = () => {

    const metricsData = [
        {
            title: "Total Sales",
            value: formatCurrency(2400000),
            description: "+12% from last month",
            colorClass: "text-[#16A34A]",
            icon: <LuChartSpline className='size-4' />
        },
        {
            title: "Total Purchases",
            value: formatCurrency(953.46),
            description: "3 new this week",
            colorClass: "text-[#2563EB]",
            icon: <BuildingStorefrontIcon className='size-4' />
        },
        {
            title: "Sales Return",
            value: formatCurrency(8500),
            description: "$8,500 pending",
            colorClass: "text-[#9333EA]",
            icon: <BanknotesIcon className='size-4' />
        },
        {
            title: "Today's Sales",
            value: formatCurrency(8500),
            description: "Above daily average",
            colorClass: "text-[#EA580C]",
            icon: <UserGroupIcon className='size-4' />
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Dashboard"
                description="Welcome back! Here's what's happening with your store today."
            />

            <div className="p-3 space-y-3">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {metricsData.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            description={metric.description}
                            colorClass={metric.colorClass}
                            useColorForDescription={true}
                            icon={metric.icon}
                        />
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