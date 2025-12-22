'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { useState } from 'react'
import { formatCurrency } from '@/lib'
import CustomerReportTable from './CustomerReportTable'

const CustomerReportView = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Hardcoded customer report data
    const customerData = [
        {
            id: '1',
            reference: 'INV2011',
            code: 'CU006',
            customerName: 'Marsha Betts',
            customerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            phone: '+1 234-567-8901',
            totalOrders: 45,
            amount: 750,
            paid: 750,
            due: 0,
            paymentMethod: 'Cash',
            status: 'completed'
        },
        {
            id: '2',
            reference: 'INV2014',
            code: 'CU007',
            customerName: 'Daniel Jude',
            customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            phone: '+1 234-567-8902',
            totalOrders: 21,
            amount: 1300,
            paid: 1300,
            due: 0,
            paymentMethod: 'Credit Card',
            status: 'paid'
        },
        {
            id: '3',
            reference: 'INV2025',
            code: 'CU001',
            customerName: 'Carl Evans',
            customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            phone: '+1 234-567-8903',
            totalOrders: 10,
            amount: 1000,
            paid: 1000,
            due: 0,
            paymentMethod: 'Cash',
            status: 'paid'
        },
        {
            id: '4',
            reference: 'INV2031',
            code: 'CU002',
            customerName: 'Minerva Rameriz',
            customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            phone: '+1 234-567-8904',
            totalOrders: 15,
            amount: 1500,
            paid: 1500,
            due: 0,
            paymentMethod: 'Paypal',
            status: 'paid'
        },
        {
            id: '5',
            reference: 'INV2033',
            code: 'CU004',
            customerName: 'Patricia Lewis',
            customerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            phone: '+1 234-567-8905',
            totalOrders: 14,
            amount: 2000,
            paid: 2000,
            due: 0,
            paymentMethod: 'Stripe',
            status: 'paid'
        },
        {
            id: '6',
            reference: 'INV2042',
            code: 'CU003',
            customerName: 'Robert Lamon',
            customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            phone: '+1 234-567-8906',
            totalOrders: 22,
            amount: 1500,
            paid: 0,
            due: 1500,
            paymentMethod: 'Paypal',
            status: 'overdue'
        },
        {
            id: '7',
            reference: 'INV2042',
            code: 'CU005',
            customerName: 'Mark Joslyn',
            customerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            phone: '+1 234-567-8907',
            totalOrders: 12,
            amount: 800,
            paid: 800,
            due: 0,
            paymentMethod: 'Paypal',
            status: 'paid'
        },
        {
            id: '8',
            reference: 'INV2047',
            code: 'CU009',
            customerName: 'Richard Fralick',
            customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            phone: '+1 234-567-8908',
            totalOrders: 15,
            amount: 1700,
            paid: 0,
            due: 1700,
            paymentMethod: 'Credit Card',
            status: 'unpaid'
        }
    ]

    const filterItems = [
        {
            type: 'dateRange' as const,
            label: 'Date Range',
            placeholder: 'Select date range'
        },
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Completed', key: 'completed' },
                { label: 'Paid', key: 'paid' },
                { label: 'Unpaid', key: 'unpaid' },
                { label: 'Overdue', key: 'overdue' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Status changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Payment Method: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Cash', key: 'cash' },
                { label: 'Credit Card', key: 'credit-card' },
                { label: 'Paypal', key: 'paypal' },
                { label: 'Stripe', key: 'stripe' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Payment method changed:', key)
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
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    {/* ================= TABLE ================= */}
                    <CustomerReportTable
                        data={customerData}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={customerData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Customers"
                    />

                </DashboardCard>
            </div>
        </>
    )
}

export default CustomerReportView

