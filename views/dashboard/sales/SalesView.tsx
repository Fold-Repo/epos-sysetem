'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, useDisclosure, TrashIcon, StackIcon } from '@/components'
import { DeleteModal } from '@/components/modal'
import { BuildingStorefrontIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import { LuChartSpline } from 'react-icons/lu';
import { useState } from 'react';
import { SaleType } from '@/types';
import SalesTable from './SalesTable';
import { salesData } from '@/data';
import { useRouter } from 'next/navigation';

const SalesView = () => {

    const router = useRouter()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedSales, setSelectedSales] = useState<SaleType[]>([]);
    const [deleteSaleId, setDeleteSaleId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    const metricsData = [
        {
            title: "Total Sales",
            value: "1,247",
            description: "+12% from last month",
            colorClass: "text-[#16A34A]",
            icon: <LuChartSpline className='size-4' />
        },
        {
            title: "Completed",
            value: "89",
            description: "-5% from last month",
            colorClass: "text-[#2563EB]",
            icon: <BuildingStorefrontIcon className='size-4' />
        },
        {
            title: "Pending",
            value: "634",
            description: "+8% from last month",
            colorClass: "text-[#9333EA]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Cancelled",
            value: "524",
            description: "+3% from last month",
            colorClass: "text-[#EA580C]",
            icon: <UserGroupIcon className='size-4' />
        }
    ]

    const handleDelete = (saleId: string) => {
        setDeleteSaleId(saleId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = () => {
        if (isBulkDelete) {
            console.log('Delete sales:', selectedSales.map(s => s.id))
            setSelectedSales([])
        } else {
            console.log('Delete sale:', deleteSaleId)
        }
        onDeleteModalClose()
    }

    const filterItems = [
        {
            type: 'dateRange' as const,
            label: 'Data',
            placeholder: 'Select date range'
        },
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Completed', key: 'completed' },
                { label: 'Pending', key: 'pending' },
                { label: 'Cancelled', key: 'cancelled' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Status changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Payment Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Unpaid', key: 'unpaid' },
                { label: 'Paid', key: 'paid' },
                { label: 'Partial', key: 'partial' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Payment status changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Sort By: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'Reference (A-Z)', key: 'reference_asc' },
                { label: 'Reference (Z-A)', key: 'reference_desc' },
                { label: 'Customer (A-Z)', key: 'customer_asc' },
                { label: 'Customer (Z-A)', key: 'customer_desc' },
                { label: 'Grand Total (High to Low)', key: 'total_desc' },
                { label: 'Grand Total (Low to High)', key: 'total_asc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Sort changed:', key)
            }
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Sales"
                description="Manage your sales here."
                endContent={
                    <Button 
                        onPress={() => router.push('/dashboard/sales/create')} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Sale
                    </Button>
                }
            />

            <div className="p-3 space-y-3">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                            placeholder: 'Search by reference',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <SalesTable
                        data={salesData}
                        selectedSales={selectedSales}
                        onSelectionChange={setSelectedSales}
                        onView={(saleId) => router.push(`/dashboard/sales/${saleId}`)}
                        onEdit={(saleId) => router.push(`/dashboard/sales/${saleId}/edit`)}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={1}
                        totalItems={100}
                        itemsPerPage={25}
                        onPageChange={(page) => {
                            console.log('Page changed:', page)
                        }}
                        showingText="Sales"
                    />

                </DashboardCard>

            </div>

            <DeleteModal
                title={isBulkDelete ? `sales (${selectedSales.length})` : "sale"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default SalesView

