'use client'

import { DashboardCard, TableComponent, TableCell, StatusChip } from '@/components'
import { formatCurrency } from '@/lib';
import { useGetSales } from '@/services';
import { Spinner } from '@heroui/react';
import React from 'react'

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

    // ================================
    // FETCH LATEST 5 SALES
    // ================================
    const { data, isLoading } = useGetSales({
        limit: 5,
        sort: 'newest',
        page: 1
    });

    const salesData = data?.sales || [];

    const getPaidAndDue = (sale: typeof salesData[0]) => {
        const grandTotal = sale.grandTotal || 0;
        if (sale.paymentStatus === 'paid') {
            return { paid: grandTotal, due: 0 };
        }
        return { paid: 0, due: grandTotal };
    };

    return (
        <DashboardCard
            headerClassName='pb-1'
            bodyClassName='space-y-4'
            title="Recent Sales">

            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[20vh]">
                    <Spinner color="primary" size="lg" />
                </div>
            ) : (
                <TableComponent
                    className='border border-gray-100 overflow-hidden rounded-xl'
                    columns={columns}
                    data={salesData}
                    rowKey={(item) => `${item.reference}-${item.id}`}
                    renderRow={(item) => {
                        const { paid, due } = getPaidAndDue(item);
                        return (
                            <>
                                <TableCell>
                                    <span className='text-xs text-dark'>{item.reference || '-'}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs text-dark'>{item.customer_name || '-'}</span>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={item.status || 'pending'} />
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs text-dark'>{formatCurrency(item.grandTotal || 0)}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs text-green-400'>{formatCurrency(paid)}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs text-dark'>{formatCurrency(due)}</span>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={item.paymentStatus || 'unpaid'} />
                                </TableCell>
                            </>
                        );
                    }}
                />
            )}

        </DashboardCard>
    )
}

export default RecentSales