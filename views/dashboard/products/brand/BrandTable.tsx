import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { ProductBrandType } from '@/types/brand.type'
import { EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'
import { Chip } from '@heroui/react'
import Image from 'next/image'

interface BrandTableProps {
    data: ProductBrandType[]
    selectedBrands?: ProductBrandType[]
    onSelectionChange?: (selected: ProductBrandType[]) => void
    onDelete?: (brandId: string) => void
}

const columns = [
    { key: 'brand', title: 'Brand', className: 'px-0' },
    { key: 'productCount', title: 'Product Count' },
    { key: 'created_at', title: 'Date Created' },
    { key: 'last_modified', title: 'Last modified' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Action' }
]

const BrandTable = ({ data, onSelectionChange, onDelete }: BrandTableProps) => {

    const renderRow = (brand: ProductBrandType) => {
        return (
            <>
                <TableCell className='px-0'>
                    <div className="flex items-center gap-2">
                        {brand.image && (
                            <Image 
                                src={brand.image} 
                                alt={brand.name}
                                width={100} 
                                height={100} 
                                className='size-9 rounded-md' 
                                loading='lazy' 
                            />
                        )}
                        <span className='text-xs line-clamp-1'>
                            {brand.name}
                        </span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{brand.productCount}</span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {brand.created_at instanceof Date
                            ? brand.created_at.toLocaleDateString()
                            : new Date(brand.created_at).toLocaleDateString()}
                    </span>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>
                        {brand.last_modified instanceof Date
                            ? brand.last_modified.toLocaleDateString()
                            : new Date(brand.last_modified).toLocaleDateString()}
                    </span>
                </TableCell>

                <TableCell>
                    <Chip size="sm"
                        variant="flat"
                        className={brand.status === 'active' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-gray-100 text-gray-600'}>
                        {brand.status === 'active' ? 'Active' : 'Inactive'}
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
                                console.log('Edit brand:', brand)
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
            rowKey={(item) => item.id}
            renderRow={renderRow}
            withCheckbox={true}
            onSelectionChange={onSelectionChange}
            loading={false}
        />
    )
}

export default BrandTable

