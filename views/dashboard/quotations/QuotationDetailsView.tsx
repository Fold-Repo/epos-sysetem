'use client'

import { DashboardBreadCrumb, DashboardCard, StatusChip } from '@/components'
import { OrderItemsTable, SummaryBox, OrderItem } from '@/views/dashboard/components'
import { formatCurrency } from '@/lib'
import { useGetQuotationDetail } from '@/services'
import moment from 'moment'
import { formatByType } from '@/utils/helper'

interface QuotationDetailsViewProps {
    quotationId: string
}

const QuotationDetailsView = ({ quotationId }: QuotationDetailsViewProps) => {

    // ================================
    // FETCH QUOTATION DETAILS
    // ================================
    const { data: quotation, isLoading, error } = useGetQuotationDetail(Number(quotationId))

    // ================================
    // TRANSFORM ITEMS TO ORDER ITEM FORMAT
    // ================================
    const orderItems: OrderItem[] = quotation?.items?.map(item => {
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
            taxType: (item.tax.type as 'percent' | 'fixed') || 'fixed',
            subtotal: parseFloat(item.subtotal)
        }
    }) || []

    // ================================
    // FORMAT TAX DISPLAY
    // ================================
    const taxDisplay = quotation
        ? formatByType(
            parseFloat(quotation.tax.amount),
            quotation.tax.type,
            formatCurrency
        )
        : '-'

    // ================================
    // FORMAT DISCOUNT DISPLAY
    // ================================
    const discountDisplay = quotation
        ? formatByType(
            parseFloat(quotation.discount.amount),
            quotation.discount.type,
            formatCurrency
        )
        : '-'

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return <QuotationDetailsSkeleton />
    }

    if (!quotation || error) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Quotations', href: '/dashboard/quotations' },
                        { label: 'Quotation Details' }
                    ]}
                    title="Quotation Details"
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Quotation not found
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Quotations', href: '/dashboard/quotations' },
                    { label: quotation.reference, href: `/dashboard/quotations/${quotationId}` },
                    { label: 'Details' }
                ]}
                title="Quotation Details"
            />

            <div className="p-3 space-y-3">
                {/* ======================== CUSTOMER INFORMATION ======================== */}
                <DashboardCard title="Customer Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Name</h6>
                        <p className="text-sm font-medium text-gray-900">{quotation.customer.name}</p>
                    </div>

                    {quotation.customer.email && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Email</h6>
                            <p className="text-sm font-medium text-gray-900">{quotation.customer.email}</p>
                        </div>
                    )}

                    {quotation.customer.phone && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Phone</h6>
                            <p className="text-sm font-medium text-gray-900">{quotation.customer.phone}</p>
                        </div>
                    )}

                    {quotation.customer.address && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Address</h6>
                            <p className="text-sm font-medium text-gray-900">{quotation.customer.address}</p>
                        </div>
                    )}

                </DashboardCard>

                {/* ======================== QUOTATION INFORMATION ======================== */}
                <DashboardCard title="Quotation Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Reference</h6>
                        <p className="text-sm font-medium text-gray-900">{quotation.reference}</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Store</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {quotation.store.name || '-'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Grand Total</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(parseFloat(quotation.grand_total))}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Status</h6>
                        <StatusChip status={quotation.status.toLowerCase()} />
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Order Tax</h6>
                        <p className="text-sm font-medium text-gray-900">{taxDisplay}</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Discount</h6>
                        <p className="text-sm font-medium text-gray-900">{discountDisplay}</p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Shipping</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(parseFloat(quotation.shipping))}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(quotation.created_at).format('LLL')}
                        </p>
                    </div>

                    {quotation.note && (
                        <div className="space-y-2 col-span-full">
                            <h6 className="text-xs text-gray-600">Note</h6>
                            <p className="text-sm text-gray-900">{quotation.note}</p>
                        </div>
                    )}

                </DashboardCard>

                {/* ======================== QUOTATION ITEMS ======================== */}
                <DashboardCard title="Quotation Items" className='overflow-hidden' 
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
                                { label: 'Shipping', value: formatCurrency(parseFloat(quotation.shipping)) },
                                { label: 'Grand Total', value: formatCurrency(parseFloat(quotation.grand_total)), isTotal: true }
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
const QuotationDetailsSkeleton = () => {
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

                <DashboardCard title="Customer Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-40"></div>
                        </div>
                    ))}
                </DashboardCard>

                <DashboardCard title="Quotation Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                    ))}
                </DashboardCard>

                <DashboardCard title="Quotation Items" className='overflow-hidden' bodyClassName='p-0'>
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

export default QuotationDetailsView