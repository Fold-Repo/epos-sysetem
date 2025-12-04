import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { ProductCategoryType } from '@/types/category.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'
import { Chip } from '@heroui/react'
import Image from 'next/image'

interface CategoryTableProps {
    data: ProductCategoryType[]
    selectedCategories?: ProductCategoryType[]
    onSelectionChange?: (selected: ProductCategoryType[]) => void
    onDelete?: (categoryId: string) => void
}

const columns = [
    { key: 'category', title: 'Product category', className: 'px-0' },
    { key: 'productCount', title: 'Product Count' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'last_modified', title: 'Last modified' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Action' }
]

const CategoryTable = ({ data, onSelectionChange, onDelete }: CategoryTableProps) => {

    const renderRow = (category: ProductCategoryType) => {
        return (
            <>
                <TableCell className='px-0'>
                    <div className="flex items-center gap-2">
                        {category.image && (
                            <Image 
                                src={category.image} 
                                alt={category.name}
                                width={100} 
                                height={100} 
                                className='size-9 rounded-md' 
                                loading='lazy' 
                            />
                        )}
                        <span className='text-xs line-clamp-1'>
                            {category.name}
                        </span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{category.productCount}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {category.created_at instanceof Date
                            ? category.created_at.toLocaleDateString()
                            : new Date(category.created_at).toLocaleDateString()}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {category.last_modified instanceof Date
                            ? category.last_modified.toLocaleDateString()
                            : new Date(category.last_modified).toLocaleDateString()}
                    </span>
                </TableCell>

                <TableCell>
                    <Chip size="sm"
                        variant="flat"
                        className={category.status === 'active' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-gray-100 text-gray-600'}>
                        {category.status === 'active' ? 'Active' : 'Inactive'}
                    </Chip>
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
                                console.log('Edit category:', category)
                            } else if (key === 'delete') {
                                onDelete?.(category.id)
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

export default CategoryTable

