'use client'

import { DashboardBreadCrumb, DashboardCard, StatusChip, TableComponent, TableCell } from '@/components'
import { useGetAdjustmentDetail } from '@/services'
import moment from 'moment'

interface AdjustmentDetailsViewProps {
    adjustmentId: string
}

const AdjustmentDetailsView = ({ adjustmentId }: AdjustmentDetailsViewProps) => {

    // ================================
    // FETCH ADJUSTMENT DETAILS
    // ================================
    const { data: adjustment, isLoading, error } = useGetAdjustmentDetail(Number(adjustmentId))

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return <AdjustmentDetailsSkeleton />
    }

    if (!adjustment || error) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'Adjustments', href: '/dashboard/adjustments' },
                        { label: 'Adjustment Details' }
                    ]}
                    title="Adjustment Details"
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            Adjustment not found
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    const columns = [
        { key: 'product', title: 'PRODUCT' },
        { key: 'code', title: 'CODE' },
        { key: 'variation', title: 'VARIATION' },
        { key: 'quantity', title: 'QUANTITY' },
        { key: 'type', title: 'TYPE' }
    ]

    const renderRow = (item: typeof adjustment.items[0]) => {
        const itemName = item.variation_type
            ? `${item.product_name} - ${item.variation_type}: ${item.variation_value}`
            : item.product_name

        const itemCode = item.variation_sku || item.product_sku

        return (
            <>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-900 font-medium">
                            {itemName}
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="text-xs text-gray-600">{itemCode}</span>
                </TableCell>
                <TableCell>
                    {item.variation_type ? (
                        <span className="text-xs text-gray-600">
                            {item.variation_type}: {item.variation_value}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">-</span>
                    )}
                </TableCell>
                <TableCell>
                    <span className="text-xs font-medium">{item.quantity}</span>
                </TableCell>
                <TableCell>
                    <StatusChip 
                        status={item.item_type === 'positive' ? 'positive' : 'negative'} 
                    />
                </TableCell>
            </>
        )
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Adjustments', href: '/dashboard/adjustments' },
                    { label: `Adjustment #${adjustment.adjustment_id}`, href: `/dashboard/adjustments/${adjustmentId}` },
                    { label: 'Details' }
                ]}
                title="Adjustment Details"
            />

            <div className="p-3 space-y-3">
                {/* ======================== ADJUSTMENT INFORMATION ======================== */}
                <DashboardCard title="Adjustment Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Date</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(adjustment.date).format('LL')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Type</h6>
                        <StatusChip status={adjustment.type === 'positive' ? 'positive' : 'negative'} />
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created By</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {adjustment.created_by_name || '-'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h6 className="text-xs text-gray-600">Created On</h6>
                        <p className="text-sm font-medium text-gray-900">
                            {moment(adjustment.created_at).format('LLL')}
                        </p>
                    </div>

                    <div className="space-y-2 col-span-full">
                        <h6 className="text-xs text-gray-600">Note</h6>
                        <p className="text-sm text-gray-900">{adjustment.note || '-'}</p>
                    </div>

                </DashboardCard>

                {/* ======================== ADJUSTMENT ITEMS ======================== */}
                <DashboardCard title="Adjustment Items" className='overflow-hidden' 
                bodyClassName='p-0'>

                    <TableComponent
                        columns={columns}
                        data={adjustment.items}
                        rowKey={(item) => String(item.item_id)}
                        renderRow={renderRow}
                        withCheckbox={false}
                        loading={false}
                    />

                </DashboardCard>
            </div>
        </>
    )
}

// ================================
// SKELETON COMPONENT FOR LOADING STATE
// ================================
const AdjustmentDetailsSkeleton = () => {
    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Adjustments', href: '/dashboard/adjustments' },
                    { label: 'Adjustment Details' }
                ]}
                title="Adjustment Details"
            />

            <div className="p-3 space-y-3">

                <DashboardCard title="Adjustment Information"
                    className='p-1' bodyClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                    ))}
                </DashboardCard>

                <DashboardCard title="Adjustment Items" className='overflow-hidden' bodyClassName='p-0'>
                    <div className="p-5 space-y-3 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

export default AdjustmentDetailsView

