'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import CustomerReportTable from './CustomerReportTable'
import { useQueryParams } from '@/hooks'
import { CustomerReportQueryParams, useGetCustomerReport } from '@/services'

const CustomerReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams()

    const queryParams: CustomerReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        payment_method: searchParams.get('payment_method') || undefined,
        payment_status: searchParams.get('payment_status') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    }

    const { data, isLoading } = useGetCustomerReport(queryParams)
    const customerData = data?.customerReport ?? []
    const pagination = data?.pagination

    const statusOptions = [
        { label: 'All', key: 'all' },
        { label: 'Paid', key: 'paid' },
        { label: 'Due', key: 'due' },
    ]

    const paymentOptions = [
        { label: 'All', key: 'all' },
        { label: 'Cash', key: 'cash' },
        { label: 'Card', key: 'card' },
        { label: 'Transfer', key: 'transfer' },
    ]

    const selectedStatus = statusOptions.find((item) => item.key === (queryParams.payment_status || 'all'))
    const selectedPayment = paymentOptions.find((item) => item.key === (queryParams.payment_method || 'all'))

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
            label: selectedStatus ? `Status: ${selectedStatus.label}` : 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: statusOptions,
            value: queryParams.payment_status || 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    payment_status: key === 'all' ? null : key,
                    page: 1
                })
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
                title="Customer Report"
                description="View and analyze your customer performance"
            />

            <div className="p-3 space-y-4">
                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by reference, code, or customer name',
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

                    {/* ================= TABLE ================= */}
                    <CustomerReportTable
                        data={customerData}
                        loading={isLoading}
                    />

                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Customers"
                        />
                    )}

                </DashboardCard>
            </div>
        </>
    )
}

export default CustomerReportView

