'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { useState } from 'react';
import TaxReportTable from './TaxReportTable';

const TaxReportView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Hardcoded tax data
    const taxData = [
        {
            id: '1',
            reference: '#4237022',
            supplier: 'A-Z Store',
            date: '2024-11-06',
            store: 'Volt Vault',
            amount: 700,
            paymentMethod: 'Cash',
            discount: 700,
            taxAmount: 700
        },
        {
            id: '2',
            reference: '#4237300',
            supplier: 'Apex Computers',
            date: '2024-12-24',
            store: 'Electro Mart',
            amount: 200,
            paymentMethod: 'Stripe',
            discount: 200,
            taxAmount: 200
        },
        {
            id: '3',
            reference: '#7590321',
            supplier: 'Sigma Chairs',
            date: '2024-09-20',
            store: 'Urban Mart',
            amount: 450,
            paymentMethod: 'Stripe',
            discount: 450,
            taxAmount: 450
        },
        {
            id: '4',
            reference: '#7590325',
            supplier: 'Beats Headphones',
            date: '2024-12-10',
            store: 'Quantum Gadgets',
            amount: 50,
            paymentMethod: 'Paypal',
            discount: 50,
            taxAmount: 50
        },
        {
            id: '5',
            reference: '#7590365',
            supplier: 'Aesthetic Bags',
            date: '2024-10-14',
            store: 'Prime Mart',
            amount: 1200,
            paymentMethod: 'Paypal',
            discount: 1200,
            taxAmount: 1200
        },
        {
            id: '6',
            reference: '#8744439',
            supplier: 'Hatimi Hardwares',
            date: '2024-10-25',
            store: 'Elite Retail',
            amount: 1000,
            paymentMethod: 'Cash',
            discount: 1000,
            taxAmount: 1000
        },
        {
            id: '7',
            reference: '#8745225',
            supplier: 'Best Accessories',
            date: '2024-11-18',
            store: 'Gadget World',
            amount: 100,
            paymentMethod: 'Paypal',
            discount: 100,
            taxAmount: 100
        },
        {
            id: '8',
            reference: '#8745245',
            supplier: 'Zenith Bags',
            date: '2024-09-10',
            store: 'Travel Mart',
            amount: 300,
            paymentMethod: 'Cash',
            discount: 300,
            taxAmount: 300
        },
        {
            id: '9',
            reference: '#8745478',
            supplier: 'Alpha Mobiles',
            date: '2024-10-03',
            store: 'NeoTech Store',
            amount: 750,
            paymentMethod: 'Stripe',
            discount: 750,
            taxAmount: 750
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
            label: 'Store: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Volt Vault', key: 'volt' },
                { label: 'Electro Mart', key: 'electro' },
                { label: 'Urban Mart', key: 'urban' },
                { label: 'Quantum Gadgets', key: 'quantum' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Store changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Payment Method: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Cash', key: 'cash' },
                { label: 'Stripe', key: 'stripe' },
                { label: 'Paypal', key: 'paypal' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Payment Method changed:', key)
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title='Tax Report'
                description="View and analyze your tax transactions"
            />

            <div className="p-3">
                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by reference, supplier, or store',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    <TaxReportTable data={taxData} />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={taxData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Transactions"
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default TaxReportView

