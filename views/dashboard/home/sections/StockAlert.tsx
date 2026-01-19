'use client'

import { FilterBar, DashboardCard, StackIcon, TableComponent, TableCell } from '@/components'
import { Chip, Image, Spinner } from '@heroui/react'
import { useGetStockAlerts } from '@/services'
import { getStockCountColor } from '@/utils'
import React from 'react'

const columns = [
    { key: "productName", title: "Product Name" },
    { key: "code", title: "Code" },
    { key: "warehouse", title: "Store" },
    { key: "currentStock", title: "Current Stock" },
    { key: "quantity", title: "Quantity" },
    { key: "alertQuantity", title: "Alert Quantity" }
];

const StockAlert = () => {

    const { data: stockData = [], isLoading } = useGetStockAlerts();

    return (
        <DashboardCard
            headerClassName='pb-1'
            bodyClassName='space-y-4'
            title="Stock Alert">

            <TableComponent
                className='border border-gray-100 overflow-hidden rounded-xl'
                columns={columns}
                data={stockData}
                rowKey={(item) => `${item.code}-${item.warehouse}`}
                loading={isLoading}
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

        </DashboardCard>
    )
}

export default StockAlert

