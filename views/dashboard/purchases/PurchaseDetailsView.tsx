'use client'

import { DashboardBreadCrumb, DashboardCard, StatusChip } from '@/components'
import { OrderItemsTable, SummaryBox, OrderItem } from '@/views/dashboard/components'
import { formatCurrency } from '@/lib'
import { useGetPurchaseDetail } from '@/services'
import moment from 'moment'
import { notFound } from 'next/navigation'

interface PurchaseDetailsViewProps {
    purchaseId: string
}

const PurchaseDetailsView = ({ purchaseId }: PurchaseDetailsViewProps) => {

    // ================================
    // FETCH PURCHASE DETAILS
    // ================================
    const { data: purchase, isLoading, error } = useGetPurchaseDetail(Number(purchaseId))

    // ================================
    // TRANSFORM ITEMS TO ORDER ITEM FORMAT
    // ================================
    const orderItems: OrderItem[] = purchase?.items?.map(item => {
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
    const taxDisplay = purchase
        ? `${formatCurrency(parseFloat(purchase.tax.amount))}${purchase.tax.type === 'percent' ? ` (${purchase.tax.amount}%)` : ` (${purchase.tax.type})`}`
        : '-'

    // ================================
    // FORMAT DISCOUNT DISPLAY
    // ================================
    const discountDisplay = purchase
        ? `${formatCurrency(parseFloat(purchase.discount.amount))}${purchase.discount.type === 'percent' ? ` (${purchase.discount.amount}%)` : ''}`
        : '-'

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return <PurchaseDetailsSkeleton />
    }

    if(!purchase || error) return notFound()

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    { label: 'Purchase Details' }
                ]}
                title="Purchase Details"
            />

            <div className="p-3 space-y-3">
                {/* ======================== SUPPLIER & STORE INFORMATION ======================== */}
                <DashboardCard title="Supplier & Store Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Supplier Name</h6>
                        <p className="text-sm font-medium text-gray-900">{purchase?.supplier.name}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Store</h6>
                        <p className="text-sm font-medium text-gray-900">{purchase?.store.name}</p>
                    </div>
                </DashboardCard>

                {/* ======================== PURCHASE INFORMATION ======================== */}
                <DashboardCard title="Purchase Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Reference</h6>
                        <p className="text-sm font-medium text-gray-900">{purchase.reference}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Purchase Date</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(purchase.purchase_date).format('LL')}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Grand Total</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(parseFloat(purchase.grand_total))}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Status</h6>
                        <StatusChip status={purchase.status.toLowerCase()} />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Payment Status</h6>
                        <StatusChip status={purchase.payment.status.toLowerCase()} />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Payment Method</h6>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                            {purchase.payment.method?.type || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(purchase.created_at).format('LLL')}
                        </p>
                    </div>
                    {purchase.note && (
                        <div className="space-y-2 col-span-full">
                            <h6 className="text-xs text-gray-600">Note</h6>
                            <p className="text-sm text-gray-900">{purchase.note}</p>
                        </div>
                    )}
                </DashboardCard>

                {/* ======================== PURCHASE ITEMS ======================== */}
                <DashboardCard title="Purchase Items" className='overflow-hidden'
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
                                { label: 'Shipping', value: formatCurrency(parseFloat(purchase.shipping)) },
                                { label: 'Grand Total', value: formatCurrency(parseFloat(purchase.grand_total)), isTotal: true }
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
const PurchaseDetailsSkeleton = () => {
    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    { label: 'Purchase Details' }
                ]}
                title="Purchase Details"
            />

            <div className="p-3 space-y-3">

                <DashboardCard title="Supplier & Store Information"
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

                <DashboardCard title="Purchase Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                    ))}
                </DashboardCard>

                <DashboardCard title="Purchase Items" className='overflow-hidden' bodyClassName='p-0'>
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

export default PurchaseDetailsView
