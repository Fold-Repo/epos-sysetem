import { TableCell, TableComponent, MenuDropdown, TrashIcon } from '@/components'
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
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'totalProducts', title: 'TOTAL PRODUCTS' },
    { key: 'created_at', title: 'CREATED ON' },
    { key: 'actions', title: 'ACTION' }
]

const AdjustmentTable = ({ 
    data, 
    onSelectionChange, 
    onView, 
    onEdit, 
    onDelete 
}: AdjustmentTableProps) => {

    const renderRow = (adjustment: AdjustmentType) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{adjustment.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{adjustment.totalProducts}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {moment(adjustment.created_at).format('LLL')}
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
                            if (key === 'view') {
                                onView?.(adjustment.id)
                            } else if (key === 'edit') {
                                onEdit?.(adjustment.id)
                            } else if (key === 'delete') {
                                onDelete?.(adjustment.id)
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
            rowKey={(item) => item.id || `adj-${Math.random()}`}
            renderRow={renderRow}
            withCheckbox={true}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default AdjustmentTable
