'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { CurrencyDollarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '@/lib';
import ExpensesReportTable from './ExpensesReportTable';
import { useQueryParams } from '@/hooks';
import { ExpensesReportQueryParams, useGetActiveExpenseCategories, useGetExpensesReport } from '@/services';

const ExpensesReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams();

    const categoryIdParam = searchParams.get('category_id');
    const parsedCategoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined;

    const queryParams: ExpensesReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        category_id: parsedCategoryId && !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined,
        status: searchParams.get('status') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
    };

    const { data, isLoading } = useGetExpensesReport(queryParams);
    const { data: activeCategories } = useGetActiveExpenseCategories();

    const expensesData = data?.expenses ?? [];
    const summary = data?.summary;
    const pagination = data?.pagination;

    const statusOptions = [
        { label: 'All', key: 'all' },
        { label: 'Approved', key: 'approved' },
        { label: 'Pending', key: 'pending' },
    ];

    const selectedCategory = activeCategories?.find((item) => item.id === queryParams.category_id);
    const selectedStatus = statusOptions.find((item) => item.key === (queryParams.status || 'all'));

    const filterItems = [
        {
            type: 'dateRange' as const,
            startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
            endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
            onChange: (value: Date | { startDate: Date; endDate: Date }) => {
                if ('startDate' in value && 'endDate' in value) {
                    updateQueryParams({
                        startDate: value.startDate.toISOString().split('T')[0],
                        endDate: value.endDate.toISOString().split('T')[0],
                        page: 1
                    })
                }
            }
        },
        {
            type: 'dropdown' as const,
            label: selectedCategory ? `Category: ${selectedCategory.name}` : 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                ...(activeCategories || []).map((category) => ({
                    label: category.name,
                    key: String(category.id)
                }))
            ],
            value: queryParams.category_id ? String(queryParams.category_id) : 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    category_id: key === 'all' ? null : key,
                    page: 1
                })
            }
        },
        {
            type: 'dropdown' as const,
            label: selectedStatus ? `Status: ${selectedStatus.label}` : 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: statusOptions,
            value: queryParams.status || 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    status: key === 'all' ? null : key,
                    page: 1
                })
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title='Expenses Report'
                description="View and analyze your expenses"
            />

            <div className="p-3 space-y-4">
                {/* ================= Stats Cards ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Expenses"
                        value={formatCurrency(summary?.total_expenses || 0)}
                        icon={<CurrencyDollarIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Approved"
                        value={formatCurrency(summary?.approved || 0)}
                        icon={<CheckCircleIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Pending"
                        value={formatCurrency(summary?.pending || 0)}
                        icon={<ClockIcon className="size-6" />}
                    />
                    
                    <MetricCard
                        title="Average Expense"
                        value={formatCurrency(summary?.average_expense || 0)}
                        icon={<CurrencyDollarIcon className="size-6" />}
                    />
                </div>

                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by expense name or description',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({
                                    search: value || null,
                                    page: 1
                                })
                            }
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    <ExpensesReportTable data={expensesData} loading={isLoading} />

                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Expenses"
                        />
                    )}
                </DashboardCard>
            </div>
        </>
    )
}

export default ExpensesReportView

