'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon } from '@/components'
import { CurrencyDollarIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { formatCurrency } from '@/lib';
import AnnualReportTable from './AnnualReportTable';
import { useGetAnnualReport, AnnualReportQueryParams } from '@/services';
import { useQueryParams } from '@/hooks';

const AnnualReportView = () => {
    
    const { searchParams, updateQueryParams } = useQueryParams();
    const yearParam = searchParams.get('year');
    const parsedYear = yearParam ? parseInt(yearParam, 10) : undefined;

    const queryParams: AnnualReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        year: parsedYear && !Number.isNaN(parsedYear) ? parsedYear : undefined,
        search: searchParams.get('search') || undefined
    };

    const { data, isLoading } = useGetAnnualReport(queryParams);
    const annualData = data?.annualReport ?? [];
    const summary = data?.summary;
    const pagination = data?.pagination;

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const yearCount = Math.max(pagination?.total || 0, 5);
        const dynamicYears = Array.from({ length: yearCount }, (_, index) => String(currentYear - index));

        return [
            { label: 'All', key: 'all' },
            ...dynamicYears.map((year) => ({ label: year, key: year }))
        ];
    }, [pagination?.total]);

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: queryParams.year ? `Year: ${queryParams.year}` : 'Year: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: yearOptions,
            value: queryParams.year ? String(queryParams.year) : 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    year: key === 'all' ? null : key,
                    page: 1
                })
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
                        value={formatCurrency(summary?.current_year_sales || 0)}
                        icon={<CurrencyDollarIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Current Year Profit"
                        value={formatCurrency(summary?.current_year_profit || 0)}
                        icon={<BanknotesIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Average Annual Profit"
                        value={formatCurrency(summary?.average_annual_profit || 0)}
                        icon={<ChartBarIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Total Revenue (5 Years)"
                        value={formatCurrency(summary?.total_revenue_5_years || 0)}
                        icon={<ArrowTrendingUpIcon className="size-6" />}
                    />
                </div>

                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        items={filterItems}
                    />

                    <AnnualReportTable data={annualData} loading={isLoading} />

                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Years"
                        />
                    )}
                </DashboardCard>
            </div>
        </>
    )
}

export default AnnualReportView

