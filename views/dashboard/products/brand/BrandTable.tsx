import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { Brand } from '@/types/brand.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'
import moment from 'moment'

interface BrandTableProps {
    data: Brand[]
    isLoading?: boolean
    onEdit?: (brand: Brand) => void
    onDelete?: (brandId: number) => void
}

const columns = [
    { key: 'brand', title: 'Brand' },
    { key: 'short_name', title: 'Short Name' },
    { key: 'productCount', title: 'Product Count' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'updated_at', title: 'Last Modified' },
    { key: 'actions', title: 'Action' }
]

const BrandTable = ({ data, isLoading = false, onEdit, onDelete }: BrandTableProps) => {

    const renderRow = (brand: Brand) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium line-clamp-1'>
                        {brand.name}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{brand.short_name}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{brand.productCount ?? '-'}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {brand.created_at 
                            ? moment(brand.created_at).format('lll')
                            : '-'}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {brand.updated_at 
                            ? moment(brand.updated_at).format('lll')
                            : '-'}
                    </span>
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
                                onEdit?.(brand)
                            } else if (key === 'delete') {
                                onDelete?.(brand.id)
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
            rowKey={(item) => String(item.id)}
            renderRow={renderRow}
            withCheckbox={false}
            loading={isLoading}
        />
    )
}

export default BrandTable

