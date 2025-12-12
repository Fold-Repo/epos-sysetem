'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { CurrencyType } from '@/types'

interface CurrencyTableProps {
    data: CurrencyType[]
    onEdit?: (currency: CurrencyType) => void
    onDelete?: (currencyId: string) => void
}

const columns = [
    { key: 'name', title: 'NAME' },
    { key: 'code', title: 'CODE' },
    { key: 'symbol', title: 'SYMBOL' },
    { key: 'actions', title: 'ACTION' }
]

const CurrencyTable = ({
    data,
    onEdit,
    onDelete
}: CurrencyTableProps) => {

    const renderRow = (currency: CurrencyType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{currency.name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{currency.code}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{currency.symbol}</span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(currency)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(currency.id))} 
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
            rowKey={(item) => String(item.id || `currency-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default CurrencyTable

