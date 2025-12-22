'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { CurrencyDollarIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { formatCurrency } from '@/lib';
import AnnualReportTable from './AnnualReportTable';

const AnnualReportView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Hardcoded annual report data
    const annualData = [
        {
            id: '1',
            year: '2024',
            totalSales: 650000,
            totalPurchases: 420000,
            totalExpenses: 85000,
            totalIncome: 230000,
            netProfit: 145000,
            growth: 12.5
        },
        {
            id: '2',
            year: '2023',
            totalSales: 580000,
            totalPurchases: 380000,
            totalExpenses: 75000,
            totalIncome: 200000,
            netProfit: 125000,
            growth: 8.3
        },
        {
            id: '3',
            year: '2022',
            totalSales: 535000,
            totalPurchases: 350000,
            totalExpenses: 70000,
            totalIncome: 185000,
            netProfit: 115000,
            growth: 5.2
        },
        {
            id: '4',
            year: '2021',
            totalSales: 510000,
            totalPurchases: 330000,
            totalExpenses: 65000,
            totalIncome: 180000,
            netProfit: 115000,
            growth: 3.8
        },
        {
            id: '5',
            year: '2020',
            totalSales: 490000,
            totalPurchases: 320000,
            totalExpenses: 60000,
            totalIncome: 170000,
            netProfit: 110000,
            growth: -2.1
        }
    ]

    // Calculate stats
    const currentYear = annualData[0]
    const totalYears = annualData.length
    const averageProfit = annualData.reduce((sum, item) => sum + item.netProfit, 0) / totalYears
    const totalRevenue = annualData.reduce((sum, item) => sum + item.totalSales, 0)

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: 'Year: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: '2024', key: '2024' },
                { label: '2023', key: '2023' },
                { label: '2022', key: '2022' },
                { label: '2021', key: '2021' },
                { label: '2020', key: '2020' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Year changed:', key)
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title='Annual Report'
                description="View and analyze your annual performance"
            />

            <div className="p-3 space-y-4">
                {/* ================= Stats Cards ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Current Year Sales"
                        value={formatCurrency(currentYear.totalSales)}
                        icon={<CurrencyDollarIcon className="size-6" />}
                        description={`${currentYear.growth > 0 ? '+' : ''}${currentYear.growth.toFixed(1)}% growth`}
                    />
                    <MetricCard
                        title="Current Year Profit"
                        value={formatCurrency(currentYear.netProfit)}
                        icon={<BanknotesIcon className="size-6" />}
                        description={`${currentYear.growth > 0 ? '+' : ''}${currentYear.growth.toFixed(1)}% growth`}
                    />
                    <MetricCard
                        title="Average Annual Profit"
                        value={formatCurrency(averageProfit)}
                        icon={<ChartBarIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Total Revenue (5 Years)"
                        value={formatCurrency(totalRevenue)}
                        icon={<ArrowTrendingUpIcon className="size-6" />}
                    />
                </div>

                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by year',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    <AnnualReportTable data={annualData} />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={annualData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Years"
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default AnnualReportView

