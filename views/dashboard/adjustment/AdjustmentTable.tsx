import { TableCell, TableComponent, MenuDropdown, TrashIcon, StatusChip } from '@/components'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { AdjustmentType } from '@/types'
import moment from 'moment'

interface AdjustmentTableProps {
    data: AdjustmentType[]
    selectedAdjustments?: AdjustmentType[]
    onSelectionChange?: (selected: AdjustmentType[]) => void
    onView?: (adjustmentId: string) => void
    onEdit?: (adjustmentId: string) => void
    onDelete?: (adjustmentId: string) => void
    loading?: boolean
}

const AdjustmentTable = ({ 
    data, 
    selectedAdjustments,
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete,
    loading = false
}: AdjustmentTableProps) => {

const columns = [
    { key: 'date', title: 'DATE' },
    { key: 'type', title: 'TYPE' },
    { key: 'note', title: 'NOTE' },
    { key: 'created_by', title: 'CREATED BY' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]


    const renderRow = (adjustment: AdjustmentType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>
                        {adjustment.date ? moment(adjustment.date).format('LL') : '-'}
                    </span>
                </TableCell>
                <TableCell>
                    <StatusChip 
                        status={adjustment.type === 'positive' ? 'positive' : 'negative'} 
                    />
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{adjustment.note || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{adjustment.created_by_name || '-'}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {adjustment.created_at ? moment(adjustment.created_at).format('LLL') : '-'}
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
                                key: 'view',
                                label: 'View',
                                icon: <EyeIcon className='size-4' />
                            },
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
                            if (!adjustment.id) return
                            const id = String(adjustment.id)
                            if (key === 'view') {
                                onView?.(id)
                            } else if (key === 'edit') {
                                onEdit?.(id)
                            } else if (key === 'delete') {
                                onDelete?.(id)
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
            rowKey={(item) => String(item.id || `adj-${Math.random()}`)}
            renderRow={renderRow}
            withCheckbox={!!onSelectionChange}
            onSelectionChange={onSelectionChange}
            loading={loading}
        />
    )
}

export default AdjustmentTable
