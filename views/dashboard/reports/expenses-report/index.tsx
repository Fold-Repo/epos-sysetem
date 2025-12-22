'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { CurrencyDollarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { formatCurrency } from '@/lib';
import ExpensesReportTable from './ExpensesReportTable';

const ExpensesReportView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Hardcoded expenses data
    const expensesData = [
        {
            id: '1',
            expenseName: 'AC Repair Service',
            category: 'Repairs & Maintenance',
            description: 'AC Repair for Office',
            date: '2024-11-27',
            amount: 800,
            status: 'approved'
        },
        {
            id: '2',
            expenseName: 'Business Flight Ticket',
            category: 'Travel Expenses',
            description: 'Flight tickets for meetings',
            date: '2024-10-14',
            amount: 1200,
            status: 'approved'
        },
        {
            id: '3',
            expenseName: 'Chair Purchase',
            category: 'Office Supplies',
            description: 'Ergonomic chairs for staff',
            date: '2024-10-03',
            amount: 750,
            status: 'approved'
        },
        {
            id: '4',
            expenseName: 'Client Meeting',
            category: 'Travel Expenses',
            description: 'Travel fare for client meeting',
            date: '2024-11-06',
            amount: 700,
            status: 'approved'
        },
        {
            id: '5',
            expenseName: 'Electricity Payment',
            category: 'Utilities',
            description: 'Electricity Bill',
            date: '2024-12-24',
            amount: 200,
            status: 'approved'
        },
        {
            id: '6',
            expenseName: 'Internet Bill Payment',
            category: 'Utilities',
            description: 'Monthly internet subscription',
            date: '2024-09-10',
            amount: 300,
            status: 'pending'
        }
    ]

    // Calculate stats
    const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)
    const approvedExpenses = expensesData.filter(e => e.status === 'approved')
    const totalApproved = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const pendingExpenses = expensesData.filter(e => e.status === 'pending')
    const totalPending = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const filterItems = [
        {
            type: 'dateRange' as const,
            label: 'Date Range',
            placeholder: 'Select date range'
        },
        {
            type: 'dropdown' as const,
            label: 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Repairs & Maintenance', key: 'repairs' },
                { label: 'Travel Expenses', key: 'travel' },
                { label: 'Office Supplies', key: 'office' },
                { label: 'Utilities', key: 'utilities' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Approved', key: 'approved' },
                { label: 'Pending', key: 'pending' },
                { label: 'Rejected', key: 'rejected' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Status changed:', key)
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
                        value={formatCurrency(totalExpenses)}
                        icon={<CurrencyDollarIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Approved"
                        value={formatCurrency(totalApproved)}
                        icon={<CheckCircleIcon className="size-6" />}
                    />
                    <MetricCard
                        title="Pending"
                        value={formatCurrency(totalPending)}
                        icon={<ClockIcon className="size-6" />}
                    />
                    
                    <MetricCard
                        title="Average Expense"
                        value={formatCurrency(totalExpenses / expensesData.length)}
                        icon={<CurrencyDollarIcon className="size-6" />}
                    />
                </div>

                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by expense name or description',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    <ExpensesReportTable data={expensesData} />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={expensesData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Expenses"
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default ExpensesReportView

