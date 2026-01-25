'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { Expense } from '@/types'
import moment from 'moment'
import { formatCurrency } from '@/lib'

interface ExpensesListTableProps {
    data: Expense[]
    isLoading?: boolean
    onEdit?: (expense: Expense) => void
    onDelete?: (expenseId: number) => void
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'user', title: 'USER' },
    { key: 'title', title: 'EXPENSE TITLE' },
    { key: 'expense_category', title: 'EXPENSE CATEGORY' },
    { key: 'amount', title: 'AMOUNT' },
    { key: 'created_on', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const ExpensesListTable = ({
    data,
    isLoading = false,
    onEdit,
    onDelete
}: ExpensesListTableProps) => {

    const renderRow = (expense: Expense) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{expense.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{expense.user}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{expense.title}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{expense.expense_category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {expense.amount ? formatCurrency(expense.amount) : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {expense.created_on 
                            ? moment(expense.created_on).format('LLL')
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
                            onPress={() => onDelete?.(expense.expense_id)} 
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
            rowKey={(item) => String(item.expense_id || `expense-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={isLoading}
        />
    )
}

export default ExpensesListTable

