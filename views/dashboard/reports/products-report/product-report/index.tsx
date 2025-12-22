'use client'

import { FilterBar, Pagination, StackIcon, ExportButton, TableCell, TableComponent } from '@/components'
import { useState } from 'react'
import { formatCurrency } from '@/lib'
import Image from 'next/image'

const ProductReportTab = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Hardcoded product report data
    const productReportData = [
        {
            id: '1',
            sku: 'PT001',
            productName: 'Lenovo IdeaPad 3',
            productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
            category: 'Computers',
            brand: 'Lenovo',
            qty: 100,
            price: 600,
            totalOrdered: 5000,
            revenue: 787258
        },
        {
            id: '2',
            sku: 'PT002',
            productName: 'Beats Pro',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            category: 'Electronics',
            brand: 'Beats',
            qty: 140,
            price: 160,
            totalOrdered: 1200,
            revenue: 192000
        },
        {
            id: '3',
            sku: 'PT003',
            productName: 'Nike Jordan',
            productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            category: 'Shoe',
            brand: 'Nike',
            qty: 300,
            price: 110,
            totalOrdered: 800,
            revenue: 88000
        },
        {
            id: '4',
            sku: 'PT004',
            productName: 'Apple Series 5 Watch',
            productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            category: 'Electronics',
            brand: 'Apple',
            qty: 450,
            price: 120,
            totalOrdered: 1000,
            revenue: 120000
        },
        {
            id: '5',
            sku: 'PT005',
            productName: 'Amazon Echo Dot',
            productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
            category: 'Electronics',
            brand: 'Amazon',
            qty: 320,
            price: 80,
            totalOrdered: 500,
            revenue: 40000
        },
        {
            id: '6',
            sku: 'PT006',
            productName: 'Sanford Chair Sofa',
            productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
            category: 'Furniture',
            brand: 'Modern Wave',
            qty: 650,
            price: 320,
            totalOrdered: 700,
            revenue: 224000
        }
    ]

    const filterItems = [
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
        },
        {
            type: 'dropdown' as const,
            label: 'Brand: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Lenovo', key: 'lenovo' },
                { label: 'Beats', key: 'beats' },
                { label: 'Nike', key: 'nike' },
                { label: 'Apple', key: 'apple' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Brand changed:', key)
            }
        }
    ]

    const columns = [
        { key: 'sku', title: 'SKU' },
        { key: 'productName', title: 'PRODUCT NAME' },
        { key: 'category', title: 'CATEGORY' },
        { key: 'brand', title: 'BRAND' },
        { key: 'qty', title: 'QTY' },
        { key: 'price', title: 'PRICE' },
        { key: 'totalOrdered', title: 'TOTAL ORDERED' },
        { key: 'revenue', title: 'REVENUE' }
    ]

    const renderRow = (item: typeof productReportData[0]) => {
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
                    <span className='text-xs'>{item.category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.brand}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.qty}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.price)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.totalOrdered}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.revenue)}
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
                data={productReportData}
                rowKey={(item) => item.id}
                renderRow={renderRow}
                withCheckbox={false}
                loading={false}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={productReportData.length}
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

export default ProductReportTab

