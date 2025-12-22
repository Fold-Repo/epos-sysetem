'use client'

import { PopupModal, TableComponent, TableCell } from '@/components'
import { formatCurrency } from '@/lib'
import moment from 'moment'
import { SummaryBox } from '../../components'

interface RegisterData {
    id: string
    openedOn: string
    closedOn: string
    user: string
    cashInHand: number
    cashInHandWhileClosing: number
    note: string
}

interface RegisterDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    register: RegisterData
}

const RegisterDetailsModal = ({ isOpen, onClose, register }: RegisterDetailsModalProps) => {
    // Hardcoded payment breakdown data
    const paymentBreakdown = [
        { id: '1', paymentType: 'Cash In Hand', amount: 0.00 },
        { id: '2', paymentType: 'Cash', amount: 349.30 },
        { id: '3', paymentType: 'Cheque', amount: 0.00 },
        { id: '4', paymentType: 'Bank Transfer', amount: 0.00 },
        { id: '5', paymentType: 'Other', amount: 0.00 },
        { id: '6', paymentType: 'Razorpay', amount: 0.00 },
        { id: '7', paymentType: 'cred', amount: 0.00 },
        { id: '8', paymentType: 'Gpay', amount: 0.00 },
    ]

    const totalSales = paymentBreakdown.reduce((sum, item) => sum + item.amount, 0)
    const totalRefund = 0.00
    const totalPayment = totalSales - totalRefund

    const modalTitle = `Register Details - ${register.user} (${moment(register.closedOn).format('MMMM Do YYYY')})`

    const columns = [
        { key: 'paymentType', title: 'PAYMENT TYPE' },
        { key: 'amount', title: 'AMOUNT' }
    ]

    const renderRow = (item: typeof paymentBreakdown[0]) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs text-gray-800'>{item.paymentType}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium text-gray-800'>
                        {formatCurrency(item.amount)}
                    </span>
                </TableCell>
            </>
        )
    }

    return (
        <PopupModal
            size="2xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            title={modalTitle}
            className="max-h-[95vh] pb-3"
            showCloseButton={true}>

            <div className="space-y-4">
                <TableComponent
                    className='border border-gray-200 overflow-hidden rounded-xl'
                    columns={columns}
                    data={paymentBreakdown}
                    rowKey={(item) => item.id}
                    renderRow={renderRow}
                    withCheckbox={false}
                    loading={false}
                />

                {/* ================= Totals Section ================= */}
                <SummaryBox
                    items={[
                        { label: 'Total Sales', value: formatCurrency(totalSales) },
                        { label: 'Total Refund', value: formatCurrency(totalRefund) },
                        { label: 'Total Payment', value: formatCurrency(totalPayment) }
                    ]}
                />

            </div>
        </PopupModal>
    )
}

export default RegisterDetailsModal

