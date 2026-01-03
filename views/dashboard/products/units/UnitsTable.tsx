import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { Unit } from '@/types/unit.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'

interface UnitsTableProps {
    data: Unit[]
    isLoading?: boolean
    onEdit?: (unit: Unit) => void
    onDelete?: (unitId: number) => void
}

const columns = [
    { key: 'name', title: 'Name' },
    { key: 'short_name', title: 'Short Name' },
    { key: 'actions', title: 'Action' }
]

// ==============================
// Helper functions
// ==============================
const getInitials = (name: string): string => {
    if (name.length <= 2) return name.toUpperCase()
    return name.substring(0, 2).toUpperCase()
}

// ==============================
// Helper functions
// ==============================
const getColorForName = (name: string): string => {
    const colors = [
        'bg-purple-500',
        'bg-orange-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-pink-500',
        'bg-indigo-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
}

const UnitsTable = ({ data, isLoading = false, onEdit, onDelete }: UnitsTableProps) => {

    const renderRow = (unit: Unit) => {

        const initials = getInitials(unit.name)
        const colorClass = getColorForName(unit.name)
        
        return (
            <>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className={`${colorClass} size-8 rounded-lg flex items-center justify-center 
                        text-white text-[11px] font-medium`}>
                            {initials}
                        </div>
                        <span className='text-xs font-medium'>
                            {unit.name}
                        </span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{unit.short_name}</span>
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
                                onEdit?.(unit)
                            } else if (key === 'delete') {
                                onDelete?.(unit.id)
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

export default UnitsTable

