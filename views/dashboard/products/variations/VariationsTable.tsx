import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { ProductVariationType, VariationTypeItem } from '@/types/variation.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'
import { Chip } from '@heroui/react'

interface VariationsTableProps {
    data: ProductVariationType[]
    selectedVariations?: ProductVariationType[]
    onSelectionChange?: (selected: ProductVariationType[]) => void
    onDelete?: (variationId: string) => void
}

const columns = [
    { key: 'variation', title: 'Variation Name', className: 'px-0' },
    { key: 'types', title: 'Variation Types' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'last_modified', title: 'Last modified' },
    { key: 'actions', title: 'Action' }
]

// Helper function to determine text color based on background color
const getContrastColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '')
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

const VariationsTable = ({ data, onSelectionChange, onDelete }: VariationsTableProps) => {

    const getVariationDisplay = (item: VariationTypeItem) => {
        if (typeof item === 'string') {
            return { name: item, color: undefined }
        }
        return { name: item.name, color: item.color }
    }

    const renderRow = (variation: ProductVariationType) => {
        return (
            <>
                <TableCell className='px-0'>
                    <span className='text-xs font-medium'>
                        {variation.name}
                    </span>
                </TableCell>

                <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                        {variation.variationTypes.map((item, index) => {
                            const { name, color } = getVariationDisplay(item)
                            const isColor = variation.type === 'Color' && color
                            
                            return (
                                <Chip 
                                    key={index} 
                                    size="sm" 
                                    variant="flat"
                                    style={isColor ? { 
                                        backgroundColor: color,
                                        color: getContrastColor(color)
                                    } : undefined}
                                    className={!isColor ? 'bg-gray-100 text-gray-700' : ''}>
                                    {name}
                                </Chip>
                            )
                        })}
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {variation.created_at instanceof Date
                            ? variation.created_at.toLocaleDateString()
                            : new Date(variation.created_at).toLocaleDateString()}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {variation.last_modified instanceof Date
                            ? variation.last_modified.toLocaleDateString()
                            : new Date(variation.last_modified).toLocaleDateString()}
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
                                console.log('Edit variation:', variation)
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
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={true}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default VariationsTable

