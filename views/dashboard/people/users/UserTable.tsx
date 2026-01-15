'use client'

import { TableCell, TableComponent, TrashIcon } from '@/components'
import { PencilIcon, KeyIcon } from '@heroicons/react/24/outline'
import { Button, User } from '@heroui/react'
import { StaffUserType } from '@/types'
import moment from 'moment'

interface UserTableProps {
    data: StaffUserType[]
    isLoading?: boolean
    onEdit?: (user: StaffUserType) => void
    onDelete?: (userId: string) => void                         
    onResetPassword?: (user: StaffUserType) => void
}

const columns = [
    { key: 'user', title: 'USER' },
    { key: 'role', title: 'ROLE' },
    { key: 'phone', title: 'PHONE NUMBER' },
    { key: 'stores', title: 'STORES' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const UserTable = ({
    data,
    isLoading,
    onEdit,
    onDelete,
    onResetPassword
}: UserTableProps) => {

    const renderRow = (user: StaffUserType) => {
        const fullName = user.full_name || `${user.firstname} ${user.lastname}`.trim()
        return (
            <>
                <TableCell>
                    <User
                        as="div"
                        avatarProps={{
                            radius: "full",
                            size: 'sm'
                        }}
                        className="transition-transform"
                        description={user.email || ''}
                        name={fullName}
                        classNames={{
                            name: 'text-xs font-medium',
                            description: 'text-[11px] text-gray-500',
                            base: 'gap-x-2',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{user.role_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{user.phone || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{user.store_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {user.created_at 
                            ? moment(user.created_at).format('LLL')
                            : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button 
                            onPress={() => onResetPassword?.(user)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'
                            title="Reset Password">
                            <KeyIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onEdit?.(user)} 
                            isIconOnly 
                            size='sm' 
                            className='bg-gray-100/80' 
                            radius='full'>
                            <PencilIcon className='size-3' />
                        </Button>

                        <Button 
                            onPress={() => onDelete?.(String(user.staff_id || user.id))} 
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
            loading={isLoading}
            rowKey={(item) => String(item.staff_id || item.id || `user-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={false}
        />
    )
}

export default UserTable

