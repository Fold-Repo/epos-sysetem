'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon } from '@/components'
import { CurrencyDollarIcon, BanknotesIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '@/lib';
import SalesReportTable from './SalesReportTable';
import { useQueryParams } from '@/hooks';
import { SalesReportQueryParams, useGetBrands, useGetCategories, useGetSalesReport } from '@/services';

const SalesReportView = () => {
    
    const { searchParams, updateQueryParams } = useQueryParams();
    const brandIdParam = searchParams.get('brand_id');
    const categoryIdParam = searchParams.get('category_id');
    const parsedBrandId = brandIdParam ? parseInt(brandIdParam, 10) : undefined;
    const parsedCategoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined;

    const queryParams: SalesReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        brand_id: parsedBrandId && !Number.isNaN(parsedBrandId) ? parsedBrandId : undefined,
        category_id: parsedCategoryId && !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
    };

    const { data, isLoading } = useGetSalesReport(queryParams);
    const { data: brands } = useGetBrands(1, 200);
    const { data: categories } = useGetCategories(1, 200);

    const summary = data?.summary;
    const productSalesData = data?.salesReport ?? [];
    const pagination = data?.pagination;

    const selectedBrand = brands.find((brand) => brand.id === queryParams.brand_id);
    const selectedCategory = categories.find((category) => category.category_id === queryParams.category_id);

    const metricsData = [
        {
            title: "Total Amount",
            value: formatCurrency(summary?.total_amount || 0),
            description: "Total sales amount",
            colorClass: "text-[#16A34A]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Total Paid",
            value: formatCurrency(summary?.total_paid || 0),
            description: "Amount received",
            colorClass: "text-[#2563EB]",
            icon: <BanknotesIcon className='size-4' />
        },
        {
            title: "Total Unpaid",
            value: formatCurrency(summary?.total_unpaid || 0),
            description: "Pending payments",
            colorClass: "text-[#F97316]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Overdue",
            value: formatCurrency(summary?.overdue || 0),
            description: "Overdue amount",
            colorClass: "text-[#DC2626]",
            icon: <ExclamationCircleIcon className='size-4' />
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
            label: selectedBrand ? `Brand: ${selectedBrand.name}` : 'Brand: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                ...brands.map((brand) => ({
                    label: brand.name,
                    key: String(brand.id)
                }))
            ],
            value: queryParams.brand_id ? String(queryParams.brand_id) : 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    brand_id: key === 'all' ? null : key,
                    page: 1
                });
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
        }
    ];

    return (
        <>
            <DashboardBreadCrumb
                title="Sales Report"
                description="View and analyze your sales performance"
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
                            placeholder: 'Search by SKU, product name, or brand',
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
                    <SalesReportTable
                        data={productSalesData}
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
                            showingText="Products"
                        />
                    )}

                </DashboardCard>

            </div>
        </>
    )
}

export default SalesReportView
