'use client'

import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { ExpenseCategoryType } from '@/types'

interface ExpensesCatTableProps {
    data: ExpenseCategoryType[]
    onEdit?: (category: ExpenseCategoryType) => void
    onDelete?: (categoryId: string) => void
}

const columns = [
    { key: 'name', title: 'NAME' },
    { key: '', title: '' },
    { key: '', title: '' },
    { key: 'actions', title: 'ACTION' }
]

const ExpensesCatTable = ({
    data,
    onEdit,
    onDelete
}: ExpensesCatTableProps) => {

    const renderRow = (category: ExpenseCategoryType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{category.name}</span>
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">

                        <Button onPress={() => onEdit?.(category)} isIconOnly size='sm' className='bg-gray-100/80' radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button onPress={() => onDelete?.(String(category.id))} isIconOnly size='sm' className='bg-gray-100/80 text-danger' radius='full'>
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
            rowKey={(item) => String(item.id || `expense-cat-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default ExpensesCatTable
