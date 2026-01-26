'use client'

import { DashboardBreadCrumb, DashboardCard, StatusChip } from '@/components'
import { useGetTransferDetail } from '@/services'
import moment from 'moment'

interface TransferDetailsViewProps {
    transferId: string
}

const TransferDetailsView = ({ transferId }: TransferDetailsViewProps) => {

    // ================================
    // FETCH TRANSFER DETAILS
    // ================================
    const { data: transfer, isLoading, error } = useGetTransferDetail(Number(transferId))

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return <TransferDetailsSkeleton />
    }

    if (!transfer || error) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Transfers', href: '/dashboard/transfers' },
                        { label: 'Transfer Details' }
                    ]}
                    title="Transfer Details"
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Transfer not found
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
                    { label: 'Transfers', href: '/dashboard/transfers' },
                    { label: `Transfer #${transfer.transfer_id}`, href: `/dashboard/transfers/${transferId}` },
                    { label: 'Details' }
                ]}
                title="Transfer Details"
            />

            <div className="p-3 space-y-3">
                {/* ======================== STORE INFORMATION ======================== */}
                <DashboardCard title="Store Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">From Store</h6>
                        <p className="text-sm font-medium text-gray-900">{transfer.from_store_name || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">To Store</h6>
                        <p className="text-sm font-medium text-gray-900">{transfer.to_store_name || '-'}</p>
                    </div>
                </DashboardCard>

                {/* ======================== TRANSFER INFORMATION ======================== */}
                <DashboardCard title="Transfer Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Product</h6>
                        <p className="text-sm font-medium text-gray-900">{transfer.product_name || '-'}</p>
                        <p className="text-xs text-gray-500">SKU: {transfer.product_sku || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Quantity</h6>
                        <p className="text-sm font-medium text-gray-900">{transfer.quantity || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Status</h6>
                        <StatusChip status={transfer.status || 'pending'} />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {transfer.created_at ? moment(transfer.created_at).format('LLL') : '-'}
                        </p>
                    </div>
                    {transfer.variation_type && transfer.variation_value && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Variation</h6>
                            <p className="text-sm font-medium text-gray-900">
                                {transfer.variation_type}: {transfer.variation_value}
                            </p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created By</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {transfer.created_by_name || '-'}
                        </p>
                    </div>
                    {transfer.received_by_name && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Received By</h6>
                            <p className="text-sm font-medium text-gray-900">
                                {transfer.received_by_name}
                            </p>
                        </div>
                    )}
                    {transfer.transferred_at && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Transferred At</h6>
                            <p className="text-sm font-medium text-gray-900">
                                {moment(transfer.transferred_at).format('LLL')}
                            </p>
                        </div>
                    )}
                    {transfer.received_at && (
                        <div className="space-y-2">
                            <h6 className="text-xs text-gray-600">Received At</h6>
                            <p className="text-sm font-medium text-gray-900">
                                {moment(transfer.received_at).format('LLL')}
                            </p>
                        </div>
                    )}
                    <div className="space-y-2 col-span-full">
                        <h6 className="text-xs text-gray-600">Notes</h6>
                        <p className="text-sm text-gray-900">{transfer.notes || '-'}</p>
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

// ================================
// SKELETON COMPONENT FOR LOADING STATE
// ================================
const TransferDetailsSkeleton = () => {
    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Transfers', href: '/dashboard/transfers' },
                    { label: 'Transfer Details' }
                ]}
                title="Transfer Details"
            />

            <div className="p-3 space-y-3">

                <DashboardCard title="Store Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                    ))}
                </DashboardCard>

                <DashboardCard title="Transfer Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                    ))}
                </DashboardCard>
            </div>
        </>
    )
}

export default TransferDetailsView