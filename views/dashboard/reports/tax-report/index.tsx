'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon } from '@/components'
import TaxReportTable from './TaxReportTable';
import { useQueryParams } from '@/hooks';
import { TaxReportQueryParams, useGetTaxReport } from '@/services';

const TaxReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams();

    const queryParams: TaxReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        payment_method: searchParams.get('payment_method') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    };

    const { data, isLoading } = useGetTaxReport(queryParams);
    const taxData = data?.taxReport ?? [];
    const pagination = data?.pagination;

    const paymentOptions = [
        { label: 'All', key: 'all' },
        { label: 'Unpaid', key: 'Unpaid' },
        { label: 'Paid', key: 'Paid' },
    ];
    const selectedPayment = paymentOptions.find((item) => item.key === (queryParams.payment_method || 'all'));

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
            label: selectedPayment ? `Payment Method: ${selectedPayment.label}` : 'Payment Method: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: paymentOptions,
            value: queryParams.payment_method || 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    payment_method: key === 'all' ? null : key,
                    page: 1
                })
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title='Tax Report'
                description="View and analyze your tax transactions"
            />

            <div className="p-3">
                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by reference, supplier, or store',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({
                                    search: value || null,
                                    page: 1
                                })
                            }
                        }}
                        items={filterItems}
                    />

                    <TaxReportTable data={taxData} loading={isLoading} />

                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Transactions"
                        />
                    )}
                </DashboardCard>
            </div>
        </>
    )
}

export default TaxReportView

