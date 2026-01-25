'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, useDisclosure, StackIcon, TrendIndicator } from '@/components'
import { TrashIcon } from '@/components/icons'
import { DeleteModal } from '@/components/modal'
import { BuildingStorefrontIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import { LuChartSpline } from 'react-icons/lu';
import { useState, useMemo } from 'react';
import { SaleType } from '@/types';
import SalesTable from './SalesTable';
import { useRouter } from 'next/navigation';
import { useGetSales, useDeleteSale, useGetSaleSummary, SaleQueryParams, downloadSalePDF } from '@/services';
import { useQueryParams, useToast } from '@/hooks';
import { useAppSelector, selectStores } from '@/store';
import { getErrorMessage } from '@/utils';

// ================================
// CONSTANTS
// ================================
const LIMIT = 25

const SORT_OPTIONS = [
    { label: 'Newest First', key: 'newest' },
    { label: 'Oldest First', key: 'oldest' },
    { label: 'Total (High to Low)', key: 'total_desc' },
    { label: 'Total (Low to High)', key: 'total_asc' },
    { label: 'Status (A-Z)', key: 'status_asc' },
    { label: 'Status (Z-A)', key: 'status_desc' },
    { label: 'Reference (A-Z)', key: 'reference_asc' },
    { label: 'Reference (Z-A)', key: 'reference_desc' }
]

const STATUS_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Completed', key: 'completed' },
    { label: 'Pending', key: 'pending' },
    { label: 'Cancelled', key: 'cancelled' }
]

const PAYMENT_STATUS_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Unpaid', key: 'unpaid' },
    { label: 'Paid', key: 'paid' }
]

const SalesView = () => {

    const router = useRouter()
    const { searchParams, updateQueryParams } = useQueryParams()
    
    // ================================
    // GET STORES FROM REDUX STATE
    // ================================
    const stores = useAppSelector(selectStores)
    
    // ================================
    // GET QUERY PARAMS FROM URL
    // ================================
    const storeIdParam = searchParams.get('store_id')
    const queryParams: SaleQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        payment_status: searchParams.get('payment_status') || undefined,
        store_id: storeIdParam ? parseInt(storeIdParam, 10) : undefined,
        sort: searchParams.get('sort') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    }
    
    // ================================
    // FETCH SALES
    // ================================
    const { data, isLoading } = useGetSales(queryParams)
    const { sales, pagination } = data || {}
    
    // ================================
    // FETCH SALE SUMMARY
    // ================================
    const { data: summaryData } = useGetSaleSummary()
    const summary = summaryData?.data
    
    // ================================
    // DELETE MUTATION
    // ================================
    const deleteSaleMutation = useDeleteSale()
    
    // ================================
    // TOAST HOOK
    // ================================
    const { showError, showSuccess } = useToast()
    
    // ================================
    // DELETE MODAL STATE
    // ================================
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedSales, setSelectedSales] = useState<SaleType[]>([]);
    const [deleteSaleId, setDeleteSaleId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    // ================================
    // FORMAT NUMBER WITH COMMAS
    // ================================
    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US')
    }

    // ================================
    // METRICS DATA
    // ================================
    const metricsData = useMemo(() => {
        if (!summary) {
            return [
                {
                    title: "Total Sales",
                    value: "0",
                    colorClass: "text-[#16A34A]",
                    icon: <LuChartSpline className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Completed",
                    value: "0",
                    colorClass: "text-[#2563EB]",
                    icon: <BuildingStorefrontIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Pending",
                    value: "0",
                    colorClass: "text-[#9333EA]",
                    icon: <CurrencyDollarIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Cancelled",
                    value: "0",
                    colorClass: "text-[#EA580C]",
                    icon: <UserGroupIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                }
            ]
        }

        const getTrend = (percentageChange: number): 'up' | 'down' => {
            return percentageChange >= 0 ? 'up' : 'down'
        }

        return [
            {
                title: "Total Sales",
                value: formatNumber(summary.totalSales.count),
                colorClass: "text-[#16A34A]",
                icon: <LuChartSpline className='size-4' />,
                trend: getTrend(summary.totalSales.percentageChange),
                percentage: Math.abs(summary.totalSales.percentageChange),
                description: "from last month"
            },
            {
                title: "Completed",
                value: formatNumber(summary.completed.count),
                colorClass: "text-[#2563EB]",
                icon: <BuildingStorefrontIcon className='size-4' />,
                trend: getTrend(summary.completed.percentageChange),
                percentage: Math.abs(summary.completed.percentageChange),
                description: "from last month"
            },
            {
                title: "Pending",
                value: formatNumber(summary.pending.count),
                colorClass: "text-[#9333EA]",
                icon: <CurrencyDollarIcon className='size-4' />,
                trend: getTrend(summary.pending.percentageChange),
                percentage: Math.abs(summary.pending.percentageChange),
                description: "from last month"
            },
            {
                title: "Cancelled",
                value: formatNumber(summary.cancelled.count),
                colorClass: "text-[#EA580C]",
                icon: <UserGroupIcon className='size-4' />,
                trend: getTrend(summary.cancelled.percentageChange),
                percentage: Math.abs(summary.cancelled.percentageChange),
                description: "from last month"
            }
        ]
    }, [summary])

    // ================================
    // DELETE HANDLERS
    // ================================
    const handleBulkDelete = () => {
        if (selectedSales.length > 0) {
            setIsBulkDelete(true)
            setDeleteSaleId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDelete = (saleId: string) => {
        setDeleteSaleId(saleId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedSales.length > 0) {
            // ===========================
            // Bulk delete sales
            // ===========================
            for (const sale of selectedSales) {
                if (sale.id) {
                    await deleteSaleMutation.mutateAsync(Number(sale.id))
                }
            }
            setSelectedSales([])
            onDeleteModalClose()
        } else if (deleteSaleId) {
            // ===========================
            // Delete single sale
            // ===========================
            deleteSaleMutation.mutate(Number(deleteSaleId), {
                onSuccess: () => {
                    onDeleteModalClose()
                    setDeleteSaleId(undefined)
                }
            })
        }
    }

    // ================================
    // GET LABEL FOR CURRENT FILTER VALUE
    // ================================
    const getStatusLabel = () => {
        const current = STATUS_OPTIONS.find(o => o.key === queryParams.status)
        return current ? `Status: ${current.label}` : 'Status: All'
    }

    const getPaymentStatusLabel = () => {
        const current = PAYMENT_STATUS_OPTIONS.find(o => o.key === queryParams.payment_status)
        return current ? `Payment: ${current.label}` : 'Payment: All'
    }

    const getSortLabel = () => {
        const current = SORT_OPTIONS.find(o => o.key === queryParams.sort)
        return current ? `Sort: ${current.label}` : 'Sort By'
    }

    // ================================
    // STORE OPTIONS
    // ================================
    const storeOptions = useMemo(() => {
        return stores
            .filter(s => s.store_id !== undefined)
            .map(s => ({ value: String(s.store_id), label: s.name }))
    }, [stores])

    const getStoreLabel = () => {
        if (!queryParams.store_id) return 'Store: All'
        const store = stores.find(s => s.store_id === queryParams.store_id)
        return store ? `Store: ${store.name}` : 'Store: All'
    }

    // ================================
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
        ...(selectedSales.length > 0 ? [{
            type: 'button' as const,
            label: `Delete (${selectedSales.length})`,
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dateRange' as const,
            label: 'Date',
            startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
            endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
            onChange: (value: Date | { startDate: Date; endDate: Date }) => {
                if ('startDate' in value && 'endDate' in value) {
                    updateQueryParams({ 
                        startDate: value.startDate.toISOString().split('T')[0], 
                        endDate: value.endDate.toISOString().split('T')[0], 
                        page: 1 
                    })
                }
            }
        },
        {
            type: 'dropdown' as const,
            label: getStatusLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: STATUS_OPTIONS,
            value: queryParams.status || 'all',
            onChange: (key: string) => {
                updateQueryParams({ status: key === 'all' ? null : key, page: 1 })
            }
        },
        {
            type: 'dropdown' as const,
            label: getPaymentStatusLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: PAYMENT_STATUS_OPTIONS,
            value: queryParams.payment_status || 'all',
            onChange: (key: string) => {
                updateQueryParams({ payment_status: key === 'all' ? null : key, page: 1 })
            }
        },
        {
            type: 'dropdown' as const,
            label: getStoreLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                ...storeOptions.map(s => ({ label: s.label, key: s.value }))
            ],
            value: queryParams.store_id ? String(queryParams.store_id) : 'all',
            onChange: (key: string) => {
                updateQueryParams({ store_id: key === 'all' ? null : key, page: 1 })
            }
        },
        {
            type: 'dropdown' as const,
            label: getSortLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: SORT_OPTIONS,
            value: queryParams.sort || '',
            onChange: (key: string) => {
                updateQueryParams({ sort: key, page: 1 })
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
                            colorClass={metric.colorClass}
                            icon={metric.icon}
                        >
                            <TrendIndicator
                                trend={metric.trend}
                                percentage={metric.percentage}
                                description={metric.description}
                            />
                        </MetricCard>
                    ))}
                </div>

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by reference',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({ search: value || null, page: 1 })
                            }
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <SalesTable
                        data={sales ?? []}
                        selectedSales={selectedSales}
                        onSelectionChange={setSelectedSales}
                        onView={(saleId) => router.push(`/dashboard/sales/${saleId}`)}
                        onEdit={(saleId) => router.push(`/dashboard/sales/${saleId}/edit`)}
                        onDelete={handleDelete}
                        onDownloadPDF={async (saleId) => {
                            try {
                                await downloadSalePDF(Number(saleId));
                                showSuccess('PDF downloaded', 'Sale PDF downloaded successfully.');
                            } catch (error: any) {
                                const errorMessage = getErrorMessage(error);
                                showError('Failed to download PDF', errorMessage);
                            }
                        }}
                        onCreateReturn={(saleId) => router.push(`/dashboard/sale-returns/create?sale_id=${saleId}`)}
                        loading={isLoading}
                    />

                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Sales"
                        />
                    )}

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
