'use client'

import { ExportButton, FilterBar, Pagination, StackIcon, TableCell, TableComponent } from '@/components'
import { useState } from 'react'
import Image from 'next/image'

const StockHistoryTab = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Hardcoded stock history data
    const stockHistoryData = [
        {
            id: '1',
            sku: 'PT001',
            productName: 'Lenovo IdeaPad 3',
            productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
            initialQty: 6000,
            addedQty: 100,
            soldQty: 100,
            defectiveQty: 100,
            finalQty: 100
        },
        {
            id: '2',
            sku: 'PT002',
            productName: 'Beats Pro',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            initialQty: 10,
            addedQty: 140,
            soldQty: 140,
            defectiveQty: 140,
            finalQty: 140
        },
        {
            id: '3',
            sku: 'PT003',
            productName: 'Nike Jordan',
            productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            initialQty: 8,
            addedQty: 300,
            soldQty: 300,
            defectiveQty: 300,
            finalQty: 300
        },
        {
            id: '4',
            sku: 'PT004',
            productName: 'Apple Series 5 Watch',
            productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            initialQty: 10,
            addedQty: 450,
            soldQty: 450,
            defectiveQty: 450,
            finalQty: 450
        },
        {
            id: '5',
            sku: 'PT005',
            productName: 'Amazon Echo Dot',
            productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
            initialQty: 5,
            addedQty: 320,
            soldQty: 320,
            defectiveQty: 320,
            finalQty: 320
        },
        {
            id: '6',
            sku: 'PT006',
            productName: 'Sanford Chair Sofa',
            productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
            initialQty: 7,
            addedQty: 650,
            soldQty: 650,
            defectiveQty: 650,
            finalQty: 650
        }
    ]

    const filterItems = [
        {
            type: 'dateRange' as const,
            label: 'Date Range',
            placeholder: 'Select date range'
        },
        {
            type: 'dropdown' as const,
            label: 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Computers', key: 'computers' },
                { label: 'Electronics', key: 'electronics' },
                { label: 'Shoe', key: 'shoe' },
                { label: 'Furniture', key: 'furniture' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
            }
        }
    ]

    const columns = [
        { key: 'sku', title: 'SKU' },
        { key: 'product', title: 'PRODUCT' },
        { key: 'initialQty', title: 'INITIAL QUANTITY' },
        { key: 'addedQty', title: 'ADDED QUANTITY' },
        { key: 'soldQty', title: 'SOLD QUANTITY' },
        { key: 'defectiveQty', title: 'DEFECTIVE QUANTITY' },
        { key: 'finalQty', title: 'FINAL QUANTITY' }
    ]

    const renderRow = (item: typeof stockHistoryData[0]) => {
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
                    <span className='text-xs font-medium'>{item.initialQty}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.addedQty}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.soldQty}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.defectiveQty}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.finalQty}</span>
                </TableCell>
            </>
        )
    }

    return (
        <div className="space-y-4">
            <FilterBar
                searchInput={{
                    placeholder: 'Search by SKU or product name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
                endContent={<ExportButton />}
            />

            <TableComponent
                className='border border-gray-200 overflow-hidden rounded-xl'
                columns={columns}
                data={stockHistoryData}
                rowKey={(item) => item.id}
                renderRow={renderRow}
                withCheckbox={false}
                loading={false}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={stockHistoryData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => {
                    setCurrentPage(page)
                    console.log('Page changed:', page)
                }}
                showingText="Products"
            />
        </div>
    )
}

export default StockHistoryTab

