'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { RoleType } from '@/types'
import moment from 'moment'

interface RoleTableProps {
    data: RoleType[]
    isLoading?: boolean
    onEdit?: (role: RoleType) => void
    onDelete?: (roleId: string) => void
}

const columns = [
    { key: 'name', title: 'ROLE NAME' },
    { key: 'description', title: 'DESCRIPTION' },
    { key: 'userCount', title: 'USERS' },
    { key: 'permissionsCount', title: 'PERMISSIONS' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const RoleTable = ({
    data,
    isLoading,
    onEdit,
    onDelete
}: RoleTableProps) => {

    const renderRow = (role: RoleType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium'>{role.name}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs text-gray-600'>
                        {role.description || '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{role.userCount || 0}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{role.permissionsCount || 0}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {role.created_at 
                            ? moment(role.created_at).format('lll')
                            : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onEdit?.(role)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(role.id))} 
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
            rowKey={(item) => String(item.id || `role-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={isLoading}
        />
    )
}

export default RoleTable

