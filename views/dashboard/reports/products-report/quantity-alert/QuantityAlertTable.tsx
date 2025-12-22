'use client'

import { TableCell, TableComponent } from '@/components'
import Image from 'next/image'

interface QuantityAlertData {
    id: string
    sku: string
    serialNo: string
    productName: string
    productImage: string
    totalQuantity: number
    alertQuantity: number
}

interface QuantityAlertTableProps {
    data: QuantityAlertData[]
}

const columns = [
    { key: 'sku', title: 'SKU' },
    { key: 'serialNo', title: 'SERIAL NO' },
    { key: 'productName', title: 'PRODUCT NAME' },
    { key: 'totalQuantity', title: 'TOTAL QUANTITY' },
    { key: 'alertQuantity', title: 'ALERT QUANTITY' }
]

const QuantityAlertTable = ({ data }: QuantityAlertTableProps) => {

    const renderRow = (item: QuantityAlertData) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{item.sku}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.serialNo}</span>
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
                    <span className='text-xs font-medium'>{item.totalQuantity}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.alertQuantity}</span>
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

export default QuantityAlertTable

