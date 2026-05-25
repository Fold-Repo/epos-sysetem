'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon } from '@/components'
import { CurrencyDollarIcon, BanknotesIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '@/lib';
import PurchaseReportTable from './PurchaseReportTable';
import { useQueryParams } from '@/hooks';
import { PurchaseReportQueryParams, useGetCategories, useGetPurchaseReport } from '@/services';

const PurchaseReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams();
    const categoryIdParam = searchParams.get('category_id');
    const parsedCategoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined;

    const queryParams: PurchaseReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        category_id: parsedCategoryId && !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined,
        status: searchParams.get('status') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
    };

    const { data, isLoading } = useGetPurchaseReport(queryParams);
    const { data: categories } = useGetCategories(1, 200);

    const summary = data?.summary;
    const purchaseData = data?.purchaseReport ?? [];
    const pagination = data?.pagination;

    const selectedCategory = categories.find((category) => category.category_id === queryParams.category_id);

    const statusOptions = [
        { label: 'All', key: 'all' },
        { label: 'Received', key: 'received' },
        { label: 'Pending', key: 'pending' },
        { label: 'Ordered', key: 'ordered' },
    ];

    const selectedStatus = statusOptions.find((item) => item.key === (queryParams.status || 'all'));

    const metricsData = [
        {
            title: "Total Purchases",
            value: String(summary?.total_purchases ?? 0),
            description: "Total purchase records",
            colorClass: "text-[#16A34A]",
            icon: <ShoppingCartIcon className='size-4' />
        },
        {
            title: "Total Amount",
            value: formatCurrency(summary?.total_amount || 0),
            description: "Total purchase amount",
            colorClass: "text-[#2563EB]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Total Paid",
            value: formatCurrency(summary?.total_paid || 0),
            description: "Amount paid",
            colorClass: "text-[#9333EA]",
            icon: <BanknotesIcon className='size-4' />
        },
        {
            title: "Total Unpaid",
            value: formatCurrency(summary?.total_unpaid || 0),
            description: "Pending payments",
            colorClass: "text-[#DC2626]",
            icon: <CurrencyDollarIcon className='size-4' />
        }
    ]

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
                    });
                }
            }
        },
        {
            type: 'dropdown' as const,
            label: selectedCategory ? `Category: ${selectedCategory.category_name}` : 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                ...categories.map((category) => ({
                    label: category.category_name,
                    key: String(category.category_id)
                }))
            ],
            value: queryParams.category_id ? String(queryParams.category_id) : 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    category_id: key === 'all' ? null : key,
                    page: 1
                });
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
                });
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Purchase Report"
                description="View and analyze your purchase performance"
            />

            <div className="p-3 space-y-4">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metricsData.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            description={metric.description}
                            colorClass={metric.colorClass}
                            icon={metric.icon}
                        />
                    ))}
                </div>

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by reference, SKU, or product name',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({
                                    search: value || null,
                                    page: 1
                                });
                            }
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <PurchaseReportTable
                        data={purchaseData}
                        loading={isLoading}
                    />

                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page });
                            }}
                            showingText="Purchases"
                        />
                    )}

                </DashboardCard>

            </div>
        </>
    )
}

export default PurchaseReportView
