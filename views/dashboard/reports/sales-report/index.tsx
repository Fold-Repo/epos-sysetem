'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { CurrencyDollarIcon, BanknotesIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { formatCurrency } from '@/lib';
import SalesReportTable from './SalesReportTable';
import Image from 'next/image';

const SalesReportView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Hardcoded product sales data
    const productSalesData = [
        {
            id: '1',
            sku: 'PT001',
            productName: 'Lenovo IdeaPad 3',
            productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
            brand: 'Lenovo',
            category: 'Computers',
            soldQty: 5,
            soldAmount: 3000,
            instockQty: 100
        },
        {
            id: '2',
            sku: 'PT002',
            productName: 'Beats Pro',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            brand: 'Beats',
            category: 'Electronics',
            soldQty: 10,
            soldAmount: 1600,
            instockQty: 140
        },
        {
            id: '3',
            sku: 'PT003',
            productName: 'Nike Jordan',
            productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            brand: 'Nike',
            category: 'Shoe',
            soldQty: 8,
            soldAmount: 880,
            instockQty: 300
        },
        {
            id: '4',
            sku: 'PT004',
            productName: 'Apple Series 5 Watch',
            productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            brand: 'Apple',
            category: 'Electronics',
            soldQty: 10,
            soldAmount: 1200,
            instockQty: 450
        },
        {
            id: '5',
            sku: 'PT005',
            productName: 'Amazon Echo Dot',
            productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
            brand: 'Amazon',
            category: 'Electronics',
            soldQty: 5,
            soldAmount: 400,
            instockQty: 320
        },
        {
            id: '6',
            sku: 'PT006',
            productName: 'Sanford Chair Sofa',
            productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
            brand: 'Modern Wave',
            category: 'Furniture',
            soldQty: 7,
            soldAmount: 2240,
            instockQty: 650
        },
        {
            id: '7',
            sku: 'PT007',
            productName: 'Red Premium Satchel',
            productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
            brand: 'Dior',
            category: 'Bags',
            soldQty: 15,
            soldAmount: 900,
            instockQty: 700
        },
        {
            id: '8',
            sku: 'PT008',
            productName: 'Iphone 14 Pro',
            productImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop',
            brand: 'Apple',
            category: 'Phone',
            soldQty: 12,
            soldAmount: 6480,
            instockQty: 630
        }
    ];

    // Calculate metrics
    const totalAmount = productSalesData.reduce((sum, item) => sum + item.soldAmount, 0);
    const totalPaid = Math.floor(totalAmount * 0.56); // 56% paid
    const totalUnpaid = Math.floor(totalAmount * 0.33); // 33% unpaid
    const overdue = Math.floor(totalAmount * 0.11); // 11% overdue

    const metricsData = [
        {
            title: "Total Amount",
            value: formatCurrency(totalAmount),
            description: "Total sales amount",
            colorClass: "text-[#16A34A]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Total Paid",
            value: formatCurrency(totalPaid),
            description: "Amount received",
            colorClass: "text-[#2563EB]",
            icon: <BanknotesIcon className='size-4' />
        },
        {
            title: "Total Unpaid",
            value: formatCurrency(totalUnpaid),
            description: "Pending payments",
            colorClass: "text-[#F97316]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Overdue",
            value: formatCurrency(overdue),
            description: "Overdue amount",
            colorClass: "text-[#DC2626]",
            icon: <ExclamationCircleIcon className='size-4' />
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

    return (
        <>
            <DashboardBreadCrumb
                title="Sales Report"
                description="View and analyze your sales performance"
            />

            <div className="p-3 space-y-4">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metricsData.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            description={metric.description}
                            colorClass={metric.colorClass}
                            icon={metric.icon}
                        />
                    ))}
                </div>

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by SKU, product name, or brand',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    {/* ================= TABLE ================= */}
                    <SalesReportTable
                        data={productSalesData}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={productSalesData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Products"
                    />

                </DashboardCard>

            </div>
        </>
    )
}

export default SalesReportView
