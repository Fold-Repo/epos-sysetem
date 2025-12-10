import { PopupModal, DashboardCard, TableComponent, TableCell } from '@/components'
import React from 'react'

interface ViewAdjustmentModalProps {
    isOpen: boolean
    onClose: () => void
    adjustmentId?: string
}

const ViewAdjustmentModal = ({ isOpen, onClose }: ViewAdjustmentModalProps) => {
    
    // =========================
    // HARDCODED DATA
    // =========================
    const adjustmentInfo = {
        date: '2025-12-10',
        reference: 'AD_111169'
    }

    const adjustmentItems = [
        {
            product: 'mattela 65/180',
            code: '7SKLBTIHH',
            quantity: 1,
            type: 'Addition'
        },
        {
            product: 'Pineapple',
            code: 'M1JWWL8JDOC',
            quantity: 1,
            type: 'Addition'
        }
    ]

    return (
        <PopupModal 
            size="3xl" 
            radius="2xl" 
            isOpen={isOpen} 
            onClose={onClose} 
            placement="center" 
            className='max-h-[95vh]' 
            title="View Adjustment" 
            description="View adjustment details"
        >
            <div className="space-y-4 p-4">
                
                {/* =========================
                    GENERAL INFORMATION TABLE
                    ========================= */}
                <DashboardCard className='overflow-hidden' bodyClassName='p-0'>
                    <TableComponent
                        columns={[
                            { key: 'date', title: 'DATE' },
                            { key: 'reference', title: 'REFERENCE' }
                        ]}
                        data={[adjustmentInfo]}
                        rowKey={() => 'info'}
                        renderRow={() => (
                            <>
                                <TableCell>
                                    <span className='text-xs'>{adjustmentInfo.date}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs'>{adjustmentInfo.reference}</span>
                                </TableCell>
                            </>
                        )}
                        withCheckbox={false}
                        loading={false}
                    />
                </DashboardCard>

                {/* =========================
                    ADJUSTMENT ITEMS TABLE
                    ========================= */}
                <DashboardCard className='overflow-hidden' bodyClassName='p-0'>
                    <TableComponent
                        columns={[
                            { key: 'product', title: 'PRODUCT' },
                            { key: 'code', title: 'PRODUCT CODE' },
                            { key: 'quantity', title: 'QUANTITY' },
                            { key: 'type', title: 'TYPE' }
                        ]}
                        data={adjustmentItems}
                        rowKey={(item) => `item-${item.code}`}
                        renderRow={(item) => (
                            <>
                                <TableCell>
                                    <span className='text-xs text-gray-900'>
                                        {item.product}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs text-gray-600'>
                                        {item.code}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs'>{item.quantity}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-xs'>{item.type}</span>
                                </TableCell>
                            </>
                        )}
                        withCheckbox={false}
                        loading={false}
                    />
                </DashboardCard>

            </div>
        </PopupModal>
    )
}

export default ViewAdjustmentModal
