'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { ExpenseType } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'

interface ExpensesListTableProps {
    data: ExpenseType[]
    onEdit?: (expense: ExpenseType) => void
    onDelete?: (expenseId: string) => void
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'user', title: 'USER' },
    { key: 'expenseTitle', title: 'EXPENSE TITLE' },
    { key: 'expenseCategory', title: 'EXPENSE CATEGORY' },
    { key: 'amount', title: 'AMOUNT' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const ExpensesListTable = ({
    data,
    onEdit,
    onDelete
}: ExpensesListTableProps) => {

    const renderRow = (expense: ExpenseType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{expense.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{expense.user}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{expense.expenseTitle}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{expense.expenseCategory}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {expense.amount ? formatCurrency(expense.amount) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {expense.created_at 
                            ? moment(expense.created_at).format('LLL')
                            : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(expense)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(expense.id))} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80 text-danger' 
                            radius='full'>
                            <TrashIcon className='size-3' />
                        </Button>
                    </div>
                </TableCell>
            </>
        )
    }

    return (
        <TableComponent
            className='border border-gray-200 overflow-hidden rounded-xl'
            columns={columns}
            data={data}
            rowKey={(item) => String(item.id || `expense-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default ExpensesListTable

