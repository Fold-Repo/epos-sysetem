import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { Variation } from '@/types/variation.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'
import { Chip } from '@heroui/react'
import moment from 'moment'

interface VariationsTableProps {
    data: Variation[]
    isLoading?: boolean
    onEdit?: (variation: Variation) => void
    onDelete?: (variationId: number) => void
}

const columns = [
    { key: 'variation', title: 'Variation Name' },
    { key: 'types', title: 'Options' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'updated_at', title: 'Last Modified' },
    { key: 'actions', title: 'Action' }
]

const VariationsTable = ({ data, isLoading = false, onEdit, onDelete }: VariationsTableProps) => {

    const renderRow = (variation: Variation) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {variation.name}
                    </span>
                </TableCell>

                <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                        {variation.options.map((option) => (
                            <Chip 
                                key={option.id} 
                                size="sm" 
                                variant="flat"
                                className='bg-gray-100 text-gray-700'>
                                {option.option}
                            </Chip>
                        ))}
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {moment(variation.created_at).format('lll')}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {variation.updated_at 
                            ? moment(variation.updated_at).format('lll')
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
                                onEdit?.(variation)
                            } else if (key === 'delete') {
                                onDelete?.(variation.id)
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

export default VariationsTable

