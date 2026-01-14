'use client'

import { DashboardBreadCrumb, DashboardCard, StatusChip } from '@/components'
import { OrderItemsTable, SummaryBox, OrderItem } from '@/views/dashboard/components'
import { formatCurrency } from '@/lib'
import { useGetSaleDetail } from '@/services'
import moment from 'moment'
import { notFound } from 'next/navigation'

interface SalesDetailsViewProps {
    saleId: string
}

const SalesDetailsView = ({ saleId }: SalesDetailsViewProps) => {

    // ================================
    // FETCH SALE DETAILS
    // ================================
    const { data: sale, isLoading, error } = useGetSaleDetail(Number(saleId))

    // ================================
    // TRANSFORM ITEMS TO ORDER ITEM FORMAT
    // ================================
    const orderItems: OrderItem[] = sale?.items?.map(item => {
        const itemName = item.variation
            ? `${item.product.name} - ${item.variation.type}: ${item.variation.value}`
            : item.product.name

        const itemCode = item.variation?.sku || item.product.sku

        return {
            id: String(item.id),
            productId: String(item.product.id),
            name: itemName,
            code: itemCode,
            quantity: item.quantity,
            netUnitPrice: parseFloat(item.unit_cost),
            discount: parseFloat(item.discount),
            tax: parseFloat(item.tax.amount),
            taxType: item.tax.type,
            subtotal: parseFloat(item.subtotal)
        }
    }) || []

    // ================================
    // FORMAT TAX DISPLAY
    // ================================
    const taxDisplay = sale
        ? `${formatCurrency(parseFloat(sale.tax.amount))}${sale.tax.type === 'percent' ? ` (${sale.tax.amount}%)` : ` (${sale.tax.type})`}`
        : '-'

    // ================================
    // FORMAT DISCOUNT DISPLAY
    // ================================
    const discountDisplay = sale
        ? `${formatCurrency(parseFloat(sale.discount.amount))}${sale.discount.type === 'percent' ? ` (${sale.discount.amount}%)` : ''}`
        : '-'

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return <SalesDetailsSkeleton />
    }

    if(!sale || error) return notFound()

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
                {/* ======================== CUSTOMER & STORE INFORMATION ======================== */}
                <DashboardCard title="Customer & Store Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Customer Name</h6>
                        <p className="text-sm font-medium text-gray-900">{sale?.customer.name}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Store</h6>
                        <p className="text-sm font-medium text-gray-900">{sale?.store.name}</p>
                    </div>
                </DashboardCard>

                {/* ======================== SALE INFORMATION ======================== */}
                <DashboardCard title="Sale Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Reference</h6>
                        <p className="text-sm font-medium text-gray-900">{sale.reference}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Grand Total</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(parseFloat(sale.grand_total))}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Status</h6>
                        <StatusChip status={sale.status.toLowerCase()} />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Payment Status</h6>
                        <StatusChip status={sale.payment.status.toLowerCase()} />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Payment Method</h6>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                            {sale.payment.method?.type || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(sale.created_at).format('LLL')}
                        </p>
                    </div>

                    {sale.note && (
                        <div className="space-y-2 col-span-full">
                            <h6 className="text-xs text-gray-600">Note</h6>
                            <p className="text-sm text-gray-900">{sale.note}</p>
                        </div>
                    )}
                    
                </DashboardCard>

                {/* ======================== SALE ITEMS ======================== */}
                <DashboardCard title="Sale Items" className='overflow-hidden'
                    bodyClassName='p-0'>
                    <OrderItemsTable
                        items={orderItems}
                        readOnly={true}
                        hideStock={true}
                    />

                    <div className="px-5 pb-5">
                        <SummaryBox
                            items={[
                                { label: 'Order Tax', value: taxDisplay },
                                { label: 'Discount', value: discountDisplay },
                                { label: 'Shipping', value: formatCurrency(parseFloat(sale.shipping)) },
                                { label: 'Grand Total', value: formatCurrency(parseFloat(sale.grand_total)), isTotal: true }
                            ]}
                        />
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

// ================================
// SKELETON COMPONENT FOR LOADING STATE
// ================================
const SalesDetailsSkeleton = () => {
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

                <DashboardCard title="Customer & Store Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                    </div>
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                    </div>
                </DashboardCard>

                <DashboardCard title="Sale Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                    ))}
                </DashboardCard>

                <DashboardCard title="Sale Items" className='overflow-hidden' bodyClassName='p-0'>
                    <div className="p-5 space-y-3 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                    <div className="px-5 pb-5">
                        <div className="space-y-2 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

export default SalesDetailsView
