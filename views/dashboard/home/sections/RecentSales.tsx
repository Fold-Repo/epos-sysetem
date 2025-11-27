'use client'

import { FilterBar, DashboardCard, StackIcon, TableComponent, TableCell, Pagination, StatusChip } from '@/components'
import { formatCurrency } from '@/lib';
import { getRecentSalesData } from '@/data';
import React, { useState } from 'react'

const columns = [
    { key: "reference", title: "Reference" },
    { key: "customer", title: "Customer" },
    { key: "status", title: "Status" },
    { key: "grandTotal", title: "Grand Total" },
    { key: "paid", title: "Paid" },
    { key: "due", title: "Due" },
    { key: "paymentStatus", title: "Payment Status" }
];

const RecentSales = () => {

    const salesData = getRecentSalesData();
    const [currentPage, setCurrentPage] = useState(1)
    const totalItems = 400
    const itemsPerPage = 25

    return (
        <DashboardCard
            headerClassName='pb-1'
            bodyClassName='space-y-4'
            title="Recent Sales">

            <FilterBar
                searchInput={{
                    placeholder: 'Search by reference, Customer or Amount',
                }}
                items={[
                    {
                        type: 'dropdown',
                        label: 'Status: All',
                        startContent: <StackIcon className="text-slate-400" />,
                        showChevron: false,
                        items: [
                            { label: 'All', key: 'all' },
                            { label: 'Pending', key: 'pending' },
                            { label: 'Completed', key: 'completed' },
                            { label: 'Cancelled', key: 'cancelled' }
                        ],
                        value: '',
                        onChange: (key) => {
                            console.log('Type changed:', key)
                        }
                    }
                ]}
            />

            <TableComponent
                className='border border-gray-100 overflow-hidden rounded-xl'
                columns={columns}
                data={salesData}
                rowKey={(item) => `${item.reference}-${item.customer}`}
                renderRow={(item) => {
                    return (
                        <>
                            <TableCell>
                                <span className='text-xs text-dark'>{item.reference}</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>{item.customer}</span>
                            </TableCell>
                            <TableCell>
                                <StatusChip status={item.status as 'completed' | 'pending' | 'cancelled'} />
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>{formatCurrency(item.grandTotal)}</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-green-400'>{formatCurrency(item.paid)}</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>{formatCurrency(item.due)}</span>
                            </TableCell>
                            <TableCell>
                                <StatusChip status={item.paymentStatus} />
                            </TableCell>
                        </>
                    );
                }}
            />

            <Pagination
                className='px-4'
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showingText="transactions"
            />

        </DashboardCard>
    )
}

export default RecentSales