import { TableCell, TableComponent, MenuDropdown } from '@/components'
import { formatCurrency } from '@/lib'
import { getStockCountColor } from '@/utils'
import { ProductType } from '@/types'
import Image from 'next/image'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { TrashIcon } from '@/components/icons'

interface ProductTableProps {
    data: ProductType[]
    selectedProducts?: ProductType[]
    onSelectionChange?: (selected: ProductType[]) => void
    onView?: (productId: string) => void
    onDelete?: (productId: string) => void
}

const columns = [
    { key: 'product', title: 'Product', className: 'px-0' },
    { key: 'code', title: 'Code' },
    { key: 'brand', title: 'Brand' },
    { key: 'category', title: 'Category' },
    { key: 'price', title: 'Price' },
    { key: 'unit', title: 'Unit' },
    { key: 'stock', title: 'Stock' },
    { key: 'created_at', title: 'Created At' },
    { key: 'actions', title: 'Actions' }
]

const ProductTable = ({ data, onSelectionChange, onView, onDelete }: ProductTableProps) => {

    const renderRow = (product: ProductType) => {
        return (
            <>

                <TableCell className='px-0'>
                    <div className="flex items-center gap-2">
                        <Image src={product.image || ''} alt={product.name}
                        width={100} height={100} className='size-9 rounded-md' 
                        loading='lazy' />
                        <span className='text-xs line-clamp-1'>
                            {product.name}
                        </span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className='text-xs'>{product.code}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{product.brand}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{product.category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{formatCurrency(product.price)}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{product.unit}</span>
                </TableCell>
                <TableCell>
                    <span className={`text-xs font-medium ${getStockCountColor(product.stock)}`}>
                        {product.stock}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {product.created_at instanceof Date
                            ? product.created_at.toLocaleDateString()
                            : new Date(product.created_at).toLocaleDateString()}
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
                            if (key === 'view') {
                                onView?.(product.id)
                            } else if (key === 'edit') {
                                console.log('Edit product:', product)
                            } else if (key === 'delete') {
                                onDelete?.(product.id)
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

export default ProductTable