'use client'

import { ExportButton, FilterBar, Pagination, StackIcon, TableCell, TableComponent } from '@/components'
import { useState } from 'react'
import { formatCurrency } from '@/lib'
import Image from 'next/image'

const SoldStockTab = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Hardcoded sold stock data
    const soldStockData = [
        {
            id: '1',
            sku: 'PT001',
            productName: 'Lenovo IdeaPad 3',
            productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
            unit: 6000,
            quantity: 100,
            taxValue: 300,
            total: 300
        },
        {
            id: '2',
            sku: 'PT002',
            productName: 'Beats Pro',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            unit: 10,
            quantity: 140,
            taxValue: 10,
            total: 1600
        },
        {
            id: '3',
            sku: 'PT003',
            productName: 'Nike Jordan',
            productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            unit: 8,
            quantity: 300,
            taxValue: 80,
            total: 880
        },
        {
            id: '4',
            sku: 'PT004',
            productName: 'Apple Series 5 Watch',
            productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            unit: 10,
            quantity: 450,
            taxValue: 100,
            total: 1200
        },
        {
            id: '5',
            sku: 'PT005',
            productName: 'Amazon Echo Dot',
            productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
            unit: 5,
            quantity: 320,
            taxValue: 400,
            total: 400
        },
        {
            id: '6',
            sku: 'PT006',
            productName: 'Sanford Chair Sofa',
            productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
            unit: 7,
            quantity: 650,
            taxValue: 220,
            total: 2240
        },
        {
            id: '7',
            sku: 'PT007',
            productName: 'Red Premium Satchel',
            productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
            unit: 15,
            quantity: 700,
            taxValue: 90,
            total: 900
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
                { label: 'Furniture', key: 'furniture' },
                { label: 'Bags', key: 'bags' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
            }
        }
    ]

    const columns = [
        { key: 'sku', title: 'SKU' },
        { key: 'productName', title: 'PRODUCT NAME' },
        { key: 'unit', title: 'UNIT' },
        { key: 'quantity', title: 'QUANTITY' },
        { key: 'taxValue', title: 'TAX VALUE' },
        { key: 'total', title: 'TOTAL' }
    ]

    const renderRow = (item: typeof soldStockData[0]) => {
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
                    <span className='text-xs font-medium'>{item.unit}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.quantity}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.taxValue)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.total)}
                    </span>
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
                data={soldStockData}
                rowKey={(item) => item.id}
                renderRow={renderRow}
                withCheckbox={false}
                loading={false}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={soldStockData.length}
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

export default SoldStockTab

