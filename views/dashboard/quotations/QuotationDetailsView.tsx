'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { OrderItemsTable, SummaryBox } from '@/views/dashboard/components'

const QuotationDetailsView = ({ quotationId }: { quotationId: string }) => {
    return (
        <>

            <DashboardBreadCrumb
                items={[
                    { label: 'Quotations', href: '/dashboard/quotations' },
                    { label: 'Quotation Details' }
                ]}
                title="Quotation Details"
            />

            <div className="p-3 space-y-3">

                {/* ======================== CUSTOMER INFORMATION ======================== */}
                <DashboardCard title="Customer Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Name</h6>
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Email</h6>
                        <p className="text-sm font-medium text-gray-900">john.doe@example.com</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Phone</h6>
                        <p className="text-sm font-medium text-gray-900">+1 (555) 123-4567</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Address</h6>
                        <p className="text-sm font-medium text-gray-900">
                            123 Main Street, New York, NY 10001
                        </p>
                    </div>

                </DashboardCard>

                {/* ======================== QUOTATION INFORMATION ======================== */}
                <DashboardCard title="Quotation Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Reference</h6>
                        <p className="text-sm font-medium text-gray-900">1234567890</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Grand Total</h6>
                        <p className="text-sm font-medium text-gray-900">$129.99</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Status</h6>
                        <p className="text-sm font-medium text-gray-900">Sent</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">2024-01-15</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Note</h6>
                        <p className="text-sm text-gray-900">
                            This is a test quotation for the product, please review the details and confirm the quotation, thank you.
                        </p>
                    </div>

                </DashboardCard>

                {/* ======================== QUOTATION ITEMS ======================== */}
                <DashboardCard title="Quotation Items" className='overflow-hidden' 
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
                                subtotal: 267.48
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
                                subtotal: 80.97
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
                                { label: 'Subtotal', value: '$129.99' },
                                { label: 'Discount', value: '$10.00' },
                                { label: 'Tax', value: '$12.00' },
                                { label: 'Grand Total', value: '$129.99' }
                            ]}
                        />

                    </div>

                </DashboardCard>

            </div>

        </>
    )
}

export default QuotationDetailsView