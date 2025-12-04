import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { ProductUnitType } from '@/types/unit.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'

interface UnitsTableProps {
    data: ProductUnitType[]
    selectedUnits?: ProductUnitType[]
    onSelectionChange?: (selected: ProductUnitType[]) => void
    onDelete?: (unitId: string) => void
}

const columns = [
    { key: 'name', title: 'Name', className: 'px-0' },
    { key: 'shortName', title: 'Short Name' },
    { key: 'baseName', title: 'Base Name' },
    { key: 'created_at', title: 'Created On' },
    { key: 'actions', title: 'Action' }
]

// Helper function to get initial letter(s) for icon
const getInitials = (name: string): string => {
    if (name.length <= 2) return name.toUpperCase()
    return name.substring(0, 2).toUpperCase()
}

// Helper function to get color based on name
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

const UnitsTable = ({ data, onSelectionChange, onDelete }: UnitsTableProps) => {

    const renderRow = (unit: ProductUnitType) => {
        const initials = getInitials(unit.name)
        const colorClass = getColorForName(unit.name)
        
        return (
            <>
                <TableCell className='px-0'>
                    <div className="flex items-center gap-2">
                        <div className={`${colorClass} size-8 rounded flex items-center justify-center text-white text-xs font-medium`}>
                            {initials}
                        </div>
                        <span className='text-xs font-medium'>
                            {unit.name}
                        </span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{unit.shortName}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{unit.baseName}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {unit.created_at instanceof Date
                            ? unit.created_at.toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })
                            : new Date(unit.created_at).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
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
                                console.log('Edit unit:', unit)
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
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={true}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default UnitsTable

