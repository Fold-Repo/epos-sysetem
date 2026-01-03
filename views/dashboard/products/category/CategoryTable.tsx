import { TableCell, TableComponent, MenuDropdown, StatusChip } from '@/components'
import { Category } from '@/types/category.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'
import Image from 'next/image'
import moment from 'moment'

interface CategoryTableProps {
    data: Category[]
    isLoading?: boolean
    onEdit?: (category: Category) => void
    onDelete?: (categoryId: number) => void
}

const columns = [
    { key: 'category', title: 'Product category' },
    { key: 'productCount', title: 'Product Count' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'last_modified', title: 'Last Modified' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Action' }
]

const CategoryTable = ({ data, isLoading = false, onEdit, onDelete }: CategoryTableProps) => {

    const renderRow = (category: Category) => {
        return (
            <>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {category.image && (
                            <Image src={category.image} alt={category.category_name}
                                width={100} height={100} className='size-9 rounded-md object-cover' 
                                loading='lazy' 
                            />
                        )}
                        <span className='text-xs line-clamp-1'>
                            {category.category_name}
                        </span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{category.productCount ?? '-'}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {category.created_at 
                            ? moment(category.created_at).format('lll')
                            : '-'}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {category.last_modified 
                            ? moment(category.last_modified).format('lll')
                            : '-'}
                    </span>
                </TableCell>

                <TableCell>
                    {category.status ? (
                        <StatusChip status={category.status} 
                        label={category.status === 'active' ? 'Active' : 'Inactive'}
                        />
                    ) : (
                        <span className='text-xs text-gray-400'>-</span>
                    )}
                </TableCell>

                <TableCell>
                    <MenuDropdown
                        trigger={
                            <Button isIconOnly size='sm' className='bg-gray-100/80' radius='full'>
                                <EllipsisVerticalIcon className='size-4' />
                            </Button>
                        }
                        items={[
                            {
                                key: 'edit',
                                label: 'Edit',
                                icon: <PencilIcon className='size-4' />
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                                icon: <TrashIcon className='size-4' />,
                                className: 'text-danger'
                            }
                        ]}
                        onChange={(key) => {
                            if (key === 'edit') {
                                onEdit?.(category)
                            } else if (key === 'delete') {
                                onDelete?.(category.category_id)
                            }
                        }}
                    />
                </TableCell>
            </>
        )
    }

    return (
        <TableComponent
            className='border border-gray-200 overflow-hidden rounded-xl'
            columns={columns}
            data={data}
            rowKey={(item) => String(item.category_id)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={isLoading}
        />
    )
}

export default CategoryTable

