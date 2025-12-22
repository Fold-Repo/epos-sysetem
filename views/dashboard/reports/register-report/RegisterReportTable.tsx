'use client'

import { TableCell, TableComponent, Button } from '@/components'
import { EyeIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib'
import moment from 'moment'

interface RegisterData {
    id: string
    openedOn: string
    closedOn: string
    user: string
    cashInHand: number
    cashInHandWhileClosing: number
    note: string
}

interface RegisterReportTableProps {
    data: RegisterData[]
    onView: (register: RegisterData) => void
}

const columns = [
    { key: 'openedOn', title: 'OPENED ON' },
    { key: 'closedOn', title: 'CLOSED ON' },
    { key: 'user', title: 'USER' },
    { key: 'cashInHand', title: 'CASH IN HAND' },
    { key: 'cashInHandWhileClosing', title: 'CASH IN HAND WHILE CLOSING' },
    { key: 'note', title: 'NOTE' },
    { key: 'action', title: 'ACTION' }
]

const RegisterReportTable = ({ data, onView }: RegisterReportTableProps) => {

    const renderRow = (item: RegisterData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>
                        {moment(item.openedOn).format('DD MMM YYYY, HH:mm')}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {moment(item.closedOn).format('DD MMM YYYY, HH:mm')}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.user}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.cashInHand)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.cashInHandWhileClosing)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs text-gray-600'>{item.note}</span>
                </TableCell>
                <TableCell>
                    <Button 
                        onPress={() => onView(item)} 
                        isIconOnly 
                        size='sm' 
                        className='bg-gray-100/80' 
                        radius='full'
                        title="View Details">
                        <EyeIcon className='size-4' />
                    </Button>
                </TableCell>
            </>
        )
    }

    return (
        <TableComponent
            className='border border-gray-200 overflow-hidden rounded-xl'
            columns={columns}
            data={data}
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default RegisterReportTable

