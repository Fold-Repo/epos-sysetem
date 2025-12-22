'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { CurrencyDollarIcon, BanknotesIcon, ShoppingCartIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { formatCurrency } from '@/lib';
import PurchaseReportTable from './PurchaseReportTable';

const PurchaseReportView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Hardcoded purchase data
    const purchaseData = [
        {
            id: '1',
            reference: 'PO2025',
            sku: 'PT001',
            dueDate: '2024-12-24',
            productName: 'Lenovo IdeaPad 3',
            productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
            category: 'Computers',
            instockQty: 100,
            purchaseQty: 5,
            purchaseAmount: 500
        },
        {
            id: '2',
            reference: 'PO2026',
            sku: 'PT002',
            dueDate: '2024-12-25',
            productName: 'Beats Pro',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            category: 'Electronics',
            instockQty: 140,
            purchaseQty: 10,
            purchaseAmount: 800
        },
        {
            id: '3',
            reference: 'PO2027',
            sku: 'PT003',
            dueDate: '2024-12-26',
            productName: 'Nike Jordan',
            productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            category: 'Shoe',
            instockQty: 300,
            purchaseQty: 8,
            purchaseAmount: 640
        },
        {
            id: '4',
            reference: 'PO2028',
            sku: 'PT004',
            dueDate: '2024-12-27',
            productName: 'Apple Series 5 Watch',
            productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            category: 'Electronics',
            instockQty: 450,
            purchaseQty: 10,
            purchaseAmount: 1200
        },
        {
            id: '5',
            reference: 'PO2029',
            sku: 'PT005',
            dueDate: '2024-12-28',
            productName: 'Amazon Echo Dot',
            productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
            category: 'Electronics',
            instockQty: 320,
            purchaseQty: 5,
            purchaseAmount: 250
        },
        {
            id: '6',
            reference: 'PO2030',
            sku: 'PT006',
            dueDate: '2024-12-29',
            productName: 'Sanford Chair Sofa',
            productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
            category: 'Furniture',
            instockQty: 650,
            purchaseQty: 7,
            purchaseAmount: 1400
        },
        {
            id: '7',
            reference: 'PO2031',
            sku: 'PT007',
            dueDate: '2024-12-30',
            productName: 'Red Premium Satchel',
            productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
            category: 'Bags',
            instockQty: 700,
            purchaseQty: 15,
            purchaseAmount: 600
        },
        {
            id: '8',
            reference: 'PO2032',
            sku: 'PT008',
            dueDate: '2025-01-01',
            productName: 'Iphone 14 Pro',
            productImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop',
            category: 'Phone',
            instockQty: 630,
            purchaseQty: 12,
            purchaseAmount: 4800
        }
    ];

    // Calculate metrics
    const totalPurchases = purchaseData.length;
    const totalAmount = purchaseData.reduce((sum, item) => sum + item.purchaseAmount, 0);
    const totalPaid = Math.floor(totalAmount * 0.65); // 65% paid
    const totalUnpaid = Math.floor(totalAmount * 0.35); // 35% unpaid
    const totalQty = purchaseData.reduce((sum, item) => sum + item.purchaseQty, 0);

    const metricsData = [
        {
            title: "Total Purchases",
            value: totalPurchases.toString(),
            description: `${totalQty} items purchased`,
            colorClass: "text-[#16A34A]",
            icon: <ShoppingCartIcon className='size-4' />
        },
        {
            title: "Total Amount",
            value: formatCurrency(totalAmount),
            description: "Total purchase amount",
            colorClass: "text-[#2563EB]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Total Paid",
            value: formatCurrency(totalPaid),
            description: "Amount paid",
            colorClass: "text-[#9333EA]",
            icon: <BanknotesIcon className='size-4' />
        },
        {
            title: "Total Unpaid",
            value: formatCurrency(totalUnpaid),
            description: "Pending payments",
            colorClass: "text-[#DC2626]",
            icon: <CurrencyDollarIcon className='size-4' />
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
                { label: 'Bags', key: 'bags' },
                { label: 'Phone', key: 'phone' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Category changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Received', key: 'received' },
                { label: 'Pending', key: 'pending' },
                { label: 'Ordered', key: 'ordered' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Status changed:', key)
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Purchase Report"
                description="View and analyze your purchase performance"
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
                            placeholder: 'Search by reference, SKU, or product name',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    {/* ================= TABLE ================= */}
                    <PurchaseReportTable
                        data={purchaseData}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={purchaseData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Purchases"
                    />

                </DashboardCard>

            </div>
        </>
    )
}

export default PurchaseReportView

