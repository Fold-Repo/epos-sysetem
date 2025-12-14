'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button, Switch } from '@heroui/react'
import { StoreType } from '@/types'
import { usersData } from '@/data'

interface StoreTableProps {
    data: StoreType[]
    onEdit?: (store: StoreType) => void
    onDelete?: (storeId: string) => void
    onStatusChange?: (storeId: string, status: 'active' | 'inactive') => void
}

const columns = [
    { key: 'name', title: 'NAME' },
    { key: 'users', title: 'USERS' },
    { key: 'status', title: 'STATUS' },
    { key: 'actions', title: 'ACTION' }
]

const getStoreUserCount = (storeId: string | number | undefined): number => {
    if (!storeId) return 0
    const storeIdStr = String(storeId)
    return usersData.filter(user => 
        user.stores && user.stores.some(s => String(s) === storeIdStr)
    ).length
}

const StoreTable = ({
    data,
    onEdit,
    onDelete,
    onStatusChange
}: StoreTableProps) => {

    const renderRow = (store: StoreType) => {
        const userCount = getStoreUserCount(store.id)
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{store.name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{userCount}</span>
                </TableCell>
                <TableCell>
                    <Switch
                        size="sm"
                        color="primary"
                        isSelected={store.status === 'active'}
                        onValueChange={(isSelected) => {
                            if (onStatusChange && store.id) {
                                onStatusChange(
                                    String(store.id),
                                    isSelected ? 'active' : 'inactive'
                                )
                            }
                        }}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(store)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(store.id))} 
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
            rowKey={(item) => String(item.id || `store-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={false}
        />
    )
}

export default StoreTable

