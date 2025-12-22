'use client'

import { TableCell, TableComponent } from '@/components'
import Image from 'next/image'
import moment from 'moment'

interface ExpiryData {
    id: string
    sku: string
    serialNo: string
    productName: string
    productImage: string
    manufacturedDate: string
    expiredDate: string
}

interface ExpiryProductTableProps {
    data: ExpiryData[]
}

const columns = [
    { key: 'sku', title: 'SKU' },
    { key: 'serialNo', title: 'SERIAL NO' },
    { key: 'productName', title: 'PRODUCT NAME' },
    { key: 'manufacturedDate', title: 'MANUFACTURED DATE' },
    { key: 'expiredDate', title: 'EXPIRED DATE' }
]

const ExpiryProductTable = ({ data }: ExpiryProductTableProps) => {

    const renderRow = (item: ExpiryData) => {
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
                    <span className='text-xs'>
                        {moment(item.manufacturedDate).format('DD MMM YYYY')}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>
                        {moment(item.expiredDate).format('DD MMM YYYY')}
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

export default ExpiryProductTable

