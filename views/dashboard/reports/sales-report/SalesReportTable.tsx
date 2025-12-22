'use client'

import { TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'
import Image from 'next/image'

interface ProductSalesData {
    id: string
    sku: string
    productName: string
    productImage: string
    brand: string
    category: string
    soldQty: number
    soldAmount: number
    instockQty: number
}

interface SalesReportTableProps {
    data: ProductSalesData[]
}

const columns = [
    { key: 'sku', title: 'SKU' },
    { key: 'productName', title: 'PRODUCT NAME' },
    { key: 'brand', title: 'BRAND' },
    { key: 'category', title: 'CATEGORY' },
    { key: 'soldQty', title: 'SOLD QTY' },
    { key: 'soldAmount', title: 'SOLD AMOUNT' },
    { key: 'instockQty', title: 'INSTOCK QTY' }
]

const SalesReportTable = ({ data }: SalesReportTableProps) => {

    const renderRow = (item: ProductSalesData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{item.sku}</span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Image 
                            src={item.productImage} 
                            alt={item.productName}
                            width={40} 
                            height={40} 
                            className='size-10 rounded-md object-cover' 
                            loading='lazy' 
                        />
                        <span className='text-xs'>{item.productName}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.brand}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.soldQty.toString().padStart(2, '0')}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.soldAmount)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.instockQty}</span>
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
            withCheckbox={false}
            loading={false}
        />
    )
}

export default SalesReportTable
