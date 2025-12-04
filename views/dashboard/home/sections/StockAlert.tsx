'use client'

import { FilterBar, DashboardCard, StackIcon, TableComponent, TableCell, Pagination } from '@/components'
import { Chip, Image } from '@heroui/react'
import { getStockAlertData } from '@/data'
import { getStockCountColor } from '@/utils'
import React, { useState } from 'react'

const columns = [
    { key: "productName", title: "Product Name" },
    { key: "code", title: "Code" },
    { key: "warehouse", title: "Warehouse" },
    { key: "currentStock", title: "Current Stock" },
    { key: "quantity", title: "Quantity" },
    { key: "alertQuantity", title: "Alert Quantity" }
];

const StockAlert = () => {

    const stockData = getStockAlertData();
    const [currentPage, setCurrentPage] = useState(1)
    const totalItems = 400
    const itemsPerPage = 25

    return (
        <DashboardCard
            headerClassName='pb-1'
            bodyClassName='space-y-4'
            title="Stock Alert">

            <FilterBar
                searchInput={{
                    placeholder: 'Search by product name, code or warehouse',
                }}
                items={[
                    {
                        type: 'dropdown',
                        label: 'Warehouse: All',
                        startContent: <StackIcon className="text-slate-400" />,
                        showChevron: false,
                        items: [
                            { label: 'All', key: 'all' },
                            { label: 'General Warehouse', key: 'general' },
                            { label: 'Warehouse', key: 'warehouse' }
                        ],
                        value: '',
                        onChange: (key) => {
                            console.log('Warehouse changed:', key)
                        }
                    }
                ]}
            />

            <TableComponent
                className='border border-gray-100 overflow-hidden rounded-xl'
                columns={columns}
                data={stockData}
                rowKey={(item) => `${item.code}-${item.warehouse}`}
                renderRow={(item) => {
                    return (
                        <>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {item.productImage && (
                                        <Image 
                                            src={item.productImage} 
                                            alt={item.productName}
                                            className="w-full h-full min-w-8 max-h-8 object-cover rounded-md shrink-0"
                                            fallbackSrc="/img/file-blank.png"
                                        />
                                    )}
                                    <span className='text-xs text-dark'>{item.productName}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>{item.code}</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>{item.warehouse}</span>
                            </TableCell>
                            <TableCell>
                                <Chip size="md" 
                                    variant="flat"
                                    className="bg-yellow-50 text-yellow-600 text-[11px]">
                                    {item.currentStock} {item.currentStockUnit}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>
                                    <span className={`font-medium ${getStockCountColor(item.quantity)}`}>
                                        {item.quantity}
                                    </span> {item.quantityUnit}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className='text-xs text-dark'>
                                    <span className={`font-medium ${getStockCountColor(item.alertQuantity)}`}>
                                        {item.alertQuantity}
                                    </span> {item.alertQuantityUnit}
                                </span>
                            </TableCell>
                        </>
                    );
                }}
            />

            <Pagination
                className='px-4'
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showingText="items"
            />

        </DashboardCard>
    )
}

export default StockAlert

