'use client'

import { DashboardBreadCrumb, DashboardCard, TableComponent, TableCell } from '@/components'
import { OrderItemsTable, SummaryBox } from '@/views/dashboard/components'
import { StatusChip } from '@/components'
import { formatCurrency } from '@/lib'
import moment from 'moment'

const SalesDetailsView = ({ saleId }: { saleId: string }) => {
    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    { label: 'Sale Details' }
                ]}
                title="Sale Details"
            />

            <div className="p-3 space-y-3">
                {/* ======================== USER & CUSTOMER INFORMATION ======================== */}
                <DashboardCard title="User & Customer Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">User</h6>
                        <p className="text-sm font-medium text-gray-900">John Smith</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Customer</h6>
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                    </div>
                </DashboardCard>

                {/* ======================== SALE INFORMATION ======================== */}
                <DashboardCard title="Sale Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Reference</h6>
                        <p className="text-sm font-medium text-gray-900">SAL-2024-001</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Grand Total</h6>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(1250.00)}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Status</h6>
                        <StatusChip status="completed" />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Payment Status</h6>
                        <StatusChip status="paid" />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Paid</h6>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(1250.00)}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Due</h6>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(0.00)}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Payment Type</h6>
                        <p className="text-sm font-medium text-gray-900">Cash</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">2024-01-15</p>
                    </div>
                    <div className="space-y-2 col-span-full">
                        <h6 className="text-xs text-gray-600">Note</h6>
                        <p className="text-sm text-gray-900">
                            This is a test sale for the product, please review the details and confirm the sale, thank you.
                        </p>
                    </div>
                </DashboardCard>

                {/* ======================== PAYMENT DETAILS ======================== */}
                <DashboardCard title="Payment Details" className='overflow-hidden' 
                bodyClassName='p-0'>
                    <TableComponent
                        className='border-0'
                        columns={[
                            { key: 'date', title: 'DATE' },
                            { key: 'reference', title: 'REFERENCE' },
                            { key: 'paymentType', title: 'PAYMENT TYPE' },
                            { key: 'amount', title: 'AMOUNT' }
                        ]}
                        data={[
                            {
                                id: '1',
                                date: '2025-12-12',
                                reference: 'N/A',
                                paymentType: 'Cash',
                                amount: 124.12
                            }
                        ]}
                        rowKey={(item) => item.id}
                        renderRow={(payment) => (
                            <>
                                <TableCell>
                                    <span className='text-xs'>
                                        {moment(payment.date).format('MM/DD/YYYY')}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs'>{payment.reference}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs'>{payment.paymentType}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs font-medium'>
                                        {formatCurrency(payment.amount)}
                                    </span>
                                </TableCell>
                            </>
                        )}
                        withCheckbox={false}
                        loading={false}
                    />
                </DashboardCard>

                {/* ======================== SALE ITEMS ======================== */}
                <DashboardCard title="Sale Items" className='overflow-hidden' 
                bodyClassName='p-0'>
                    <OrderItemsTable
                        items={[
                            {
                                id: '1',
                                productId: '1',
                                name: 'Wireless Bluetooth Headphones',
                                code: 'WBH-001',
                                stock: 45,
                                unit: 'piece',
                                quantity: 2,
                                netUnitPrice: 129.99,
                                discount: 5,
                                tax: 10,
                                subtotal: 259.98
                            },
                            {
                                id: '2',
                                productId: '2',
                                name: 'Cotton T-Shirt',
                                code: 'CTS-002',
                                stock: 120,
                                unit: 'piece',
                                quantity: 3,
                                netUnitPrice: 24.99,
                                discount: 10,
                                tax: 8,
                                subtotal: 74.97
                            },
                            {
                                id: '3',
                                productId: '3',
                                name: 'Running Shoes',
                                code: 'RS-003',
                                stock: 30,
                                unit: 'pair',
                                quantity: 1,
                                netUnitPrice: 89.99,
                                discount: 15,
                                tax: 12,
                                subtotal: 89.99
                            }
                        ]}
                        readOnly={true}
                    />

                    <div className="px-5 pb-5">
                        <SummaryBox
                            items={[
                                { label: 'Order Tax', value: formatCurrency(125.00) + ' (10%)' },
                                { label: 'Discount', value: formatCurrency(50.00) },
                                { label: 'Shipping', value: formatCurrency(20.00) },
                                { label: 'Grand Total', value: formatCurrency(1250.00), isTotal: true }
                            ]}
                        />
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

export default SalesDetailsView

