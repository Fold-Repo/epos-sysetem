'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { TableComponent, TableCell } from '@/components'
import { formatCurrency } from '@/lib'
import { useGetPurchaseReturnDetail } from '@/services'
import moment from 'moment'
import { notFound } from 'next/navigation'

interface PurchaseReturnDetailsViewProps {
    returnId: string
}

const PurchaseReturnDetailsView = ({ returnId }: PurchaseReturnDetailsViewProps) => {

    // ================================
    // FETCH PURCHASE RETURN DETAILS
    // ================================
    const { data: returnDetail, isLoading, error } = useGetPurchaseReturnDetail(Number(returnId))

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return (
            <div className="p-3 space-y-3">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if(!returnDetail || error) return notFound()

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Purchase Returns', href: '/dashboard/purchase-returns' },
                    { label: 'Return Details' }
                ]}
                title="Purchase Return Details"
            />

            <div className="p-3 space-y-3">
                {/* ======================== PURCHASE & STORE INFORMATION ======================== */}
                <DashboardCard 
                    title="Purchase & Store Information"
                    className='p-1' 
                    bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'
                >
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Purchase Reference</h6>
                        <p className="text-sm font-medium text-gray-900">{returnDetail.purchase_reference}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Store</h6>
                        <p className="text-sm font-medium text-gray-900">{returnDetail.store_name}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Supplier</h6>
                        <p className="text-sm font-medium text-gray-900">{returnDetail.supplier_name}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created By</h6>
                        <p className="text-sm font-medium text-gray-900">{returnDetail.user_name}</p>
                    </div>
                </DashboardCard>

                {/* ======================== RETURN INFORMATION ======================== */}
                <DashboardCard 
                    title="Return Information"
                    className='p-1' 
                    bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'
                >
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Return ID</h6>
                        <p className="text-sm font-medium text-gray-900">#{returnDetail.purchase_return_id}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Total Deducted</h6>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(returnDetail.total_deducted)}</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <h6 className="text-xs text-gray-600">Reason</h6>
                        <p className="text-sm text-gray-900">{returnDetail.reason}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created At</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(returnDetail.created_at).format('LLL')}
                        </p>
                    </div>
                </DashboardCard>

                {/* ======================== RETURN ITEMS ======================== */}
                <DashboardCard title="Return Items" className='p-1'>
                    <TableComponent
                        className='border border-gray-200 overflow-hidden rounded-xl'
                        columns={[
                            { key: 'product', title: 'PRODUCT' },
                            { key: 'code', title: 'CODE' },
                            { key: 'variation', title: 'VARIATION' },
                            { key: 'quantity', title: 'QUANTITY' },
                            { key: 'unit_cost', title: 'UNIT COST' },
                            { key: 'subtotal', title: 'SUBTOTAL' }
                        ]}
                        data={returnDetail.items}
                        rowKey={(item) => String(item.purchase_return_item_id || `${item.product_id}-${item.variation_id || 'simple'}`)}
                        renderRow={(item) => {
                            const itemName = item.variation_type && item.variation_value
                                ? `${item.product_name} - ${item.variation_type}: ${item.variation_value}`
                                : item.product_name
                            
                            const itemCode = item.variation_sku || item.product_sku

                            return (
                                <>
                                    <TableCell>
                                        <span className='text-xs'>{itemName}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='text-xs'>{itemCode}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='text-xs'>
                                            {item.variation_type && item.variation_value
                                                ? `${item.variation_type}: ${item.variation_value}`
                                                : '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='text-xs'>{item.quantity}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='text-xs'>{formatCurrency(item.unit_cost)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='text-xs font-medium'>
                                            {formatCurrency(item.unit_cost * item.quantity)}
                                        </span>
                                    </TableCell>
                                </>
                            )
                        }}
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default PurchaseReturnDetailsView
