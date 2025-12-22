'use client'

import { TableCell, TableComponent } from '@/components'
import { formatCurrency } from '@/lib'
import Image from 'next/image'
import moment from 'moment'

interface PurchaseData {
    id: string
    reference: string
    sku: string
    dueDate: string
    productName: string
    productImage: string
    category: string
    instockQty: number
    purchaseQty: number
    purchaseAmount: number
}

interface PurchaseReportTableProps {
    data: PurchaseData[]
}

const columns = [
    { key: 'reference', title: 'REFERENCE' },
    { key: 'sku', title: 'SKU' },
    { key: 'dueDate', title: 'DUE DATE' },
    { key: 'productName', title: 'PRODUCT NAME' },
    { key: 'category', title: 'CATEGORY' },
    { key: 'instockQty', title: 'INSTOCK QTY' },
    { key: 'purchaseQty', title: 'PURCHASE QTY' },
    { key: 'purchaseAmount', title: 'PURCHASE AMOUNT' }
]

const PurchaseReportTable = ({ data }: PurchaseReportTableProps) => {

    const renderRow = (item: PurchaseData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{item.reference}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.sku}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {moment(item.dueDate).format('DD MMM YYYY')}
                    </span>
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
                    <span className='text-xs'>{item.category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.instockQty}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.purchaseQty.toString().padStart(2, '0')}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.purchaseAmount)}
                    </span>
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

export default PurchaseReportTable

