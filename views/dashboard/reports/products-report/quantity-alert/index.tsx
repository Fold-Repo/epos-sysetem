'use client'

import { FilterBar, Pagination, StackIcon, ExportButton } from '@/components'
import { useState } from 'react'
import QuantityAlertTable from './QuantityAlertTable'

const QuantityAlertTab = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Hardcoded quantity alert data
    const quantityAlertData = [
        {
            id: '1',
            sku: 'PT001',
            serialNo: 'LNV-IP3-8GB-256SSD-BL',
            productName: 'Lenovo IdeaPad 3',
            productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
            totalQuantity: 98,
            alertQuantity: 79
        },
        {
            id: '2',
            sku: 'PT002',
            serialNo: 'LNV-IP3-8GB-256SSD-BL',
            productName: 'Beats Pro',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            totalQuantity: 156,
            alertQuantity: 66
        },
        {
            id: '3',
            sku: 'PT003',
            serialNo: 'LNV-IP3-8GB-256SSD-BL',
            productName: 'Nike Jordan',
            productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            totalQuantity: 89,
            alertQuantity: 69
        },
        {
            id: '4',
            sku: 'PT004',
            serialNo: 'LNV-IP3-8GB-256SSD-BL',
            productName: 'Apple Series 5 Watch',
            productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            totalQuantity: 569,
            alertQuantity: 68
        },
        {
            id: '5',
            sku: 'PT005',
            serialNo: 'LNV-IP3-8GB-256SSD-BL',
            productName: 'Amazon Echo Dot',
            productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
            totalQuantity: 548,
            alertQuantity: 33
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
                { label: 'Shoe', key: 'shoe' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
            }
        }
    ]

    return (
        <div className="space-y-4">
            <FilterBar
                searchInput={{
                    placeholder: 'Search by SKU, serial no, or product name',
                    className: 'w-full md:w-72'
                }}
                items={filterItems}
                endContent={<ExportButton />}
            />

            <QuantityAlertTable data={quantityAlertData} />

            <Pagination
                currentPage={currentPage}
                totalItems={quantityAlertData.length}
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

export default QuantityAlertTab

