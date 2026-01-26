'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, useDisclosure, StackIcon, TrendIndicator } from '@/components'
import { DeleteModal } from '@/components/modal'
import { BuildingStorefrontIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@/components/icons'
import { Button } from '@heroui/react';
import { LuChartSpline } from 'react-icons/lu';
import { useState, useMemo } from 'react';
import { PurchaseType } from '@/types';
import PurchaseTable from './PurchaseTable';
import { useRouter } from 'next/navigation';
import { useGetPurchases, useDeletePurchase, useGetPurchaseSummary, PurchaseQueryParams, downloadPurchasePDF } from '@/services';
import { useQueryParams, useToast } from '@/hooks';
import { getErrorMessage } from '@/utils';

// ================================
// CONSTANTS
// ================================
const LIMIT = 25

const SORT_OPTIONS = [
    { label: 'Newest First', key: 'newest' },
    { label: 'Oldest First', key: 'oldest' },
    { label: 'Date (Newest)', key: 'date_desc' },
    { label: 'Date (Oldest)', key: 'date_asc' },
    { label: 'Total (High to Low)', key: 'total_desc' },
    { label: 'Total (Low to High)', key: 'total_asc' }
]

const STATUS_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Received', key: 'received' },
    { label: 'Pending', key: 'pending' },
    { label: 'Orders', key: 'orders' }
]

const PAYMENT_STATUS_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Unpaid', key: 'unpaid' },
    { label: 'Paid', key: 'paid' }
]

const PurchaseView = () => {

    const router = useRouter()
    const { searchParams, updateQueryParams } = useQueryParams()
    
    // ================================
    // GET QUERY PARAMS FROM URL
    // ================================
    const queryParams: PurchaseQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        payment_status: searchParams.get('payment_status') || undefined,
        sort: searchParams.get('sort') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    }
    
    // ================================
    // FETCH PURCHASES
    // ================================
    const { data, isLoading } = useGetPurchases(queryParams)
    const { purchases, pagination } = data || {}
    
    // ================================
    // FETCH PURCHASE SUMMARY
    // ================================
    const { data: summaryData } = useGetPurchaseSummary()
    const summary = summaryData?.data
    
    // ================================
    // DELETE MUTATION
    // ================================
    const deletePurchaseMutation = useDeletePurchase()
    
    // ================================
    // TOAST HOOK
    // ================================
    const { showError, showSuccess } = useToast()
    
    // ================================
    // DELETE MODAL STATE
    // ================================
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedPurchases, setSelectedPurchases] = useState<PurchaseType[]>([]);
    const [deletePurchaseId, setDeletePurchaseId] = useState<string | undefined>(undefined)
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
                    title: "Total Purchases",
                    value: "0",
                    colorClass: "text-[#16A34A]",
                    icon: <LuChartSpline className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Received",
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
                    title: "Orders",
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
                title: "Total Purchases",
                value: formatNumber(summary.totalPurchases.count),
                colorClass: "text-[#16A34A]",
                icon: <LuChartSpline className='size-4' />,
                trend: getTrend(summary.totalPurchases.percentageChange),
                percentage: Math.abs(summary.totalPurchases.percentageChange),
                description: "from last month"
            },
            {
                title: "Received",
                value: formatNumber(summary.received.count),
                colorClass: "text-[#2563EB]",
                icon: <BuildingStorefrontIcon className='size-4' />,
                trend: getTrend(summary.received.percentageChange),
                percentage: Math.abs(summary.received.percentageChange),
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
                title: "Orders",
                value: formatNumber(summary.orders.count),
                colorClass: "text-[#EA580C]",
                icon: <UserGroupIcon className='size-4' />,
                trend: getTrend(summary.orders.percentageChange),
                percentage: Math.abs(summary.orders.percentageChange),
                description: "from last month"
            }
        ]
    }, [summary])

    // ================================
    // DELETE HANDLERS
    // ================================
    const handleBulkDelete = () => {
        if (selectedPurchases.length > 0) {
            setIsBulkDelete(true)
            setDeletePurchaseId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDelete = (purchaseId: string) => {
        setDeletePurchaseId(purchaseId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedPurchases.length > 0) {
            // ===========================
            // Bulk delete purchases
            // ===========================
            for (const purchase of selectedPurchases) {
                if (purchase.id) {
                    await deletePurchaseMutation.mutateAsync(Number(purchase.id))
                }
            }
            setSelectedPurchases([])
            onDeleteModalClose()
        } else if (deletePurchaseId) {
            // ===========================
            // Delete single purchase
            // ===========================
            deletePurchaseMutation.mutate(Number(deletePurchaseId), {
                onSuccess: () => {
                    onDeleteModalClose()
                    setDeletePurchaseId(undefined)
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
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
        ...(selectedPurchases.length > 0 ? [{
            type: 'button' as const,
            label: `Delete (${selectedPurchases.length})`,
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
                title="Purchases"
                description="Manage your purchases here."
                endContent={
                    <Button 
                        onPress={() => router.push('/dashboard/purchases/create')} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Purchase
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
                    <PurchaseTable
                        data={purchases ?? []}
                        selectedPurchases={selectedPurchases}
                        onSelectionChange={setSelectedPurchases}
                        onView={(purchaseId) => router.push(`/dashboard/purchases/${purchaseId}`)}
                        onEdit={(purchaseId) => router.push(`/dashboard/purchases/${purchaseId}/edit`)}
                        onDelete={handleDelete}
                        onDownloadPDF={async (purchaseId) => {
                            try {
                                await downloadPurchasePDF(Number(purchaseId));
                                showSuccess('PDF downloaded', 'Purchase PDF downloaded successfully.');
                            } catch (error: any) {
                                const errorMessage = getErrorMessage(error);
                                showError('Failed to download PDF', errorMessage);
                            }
                        }}
                        onCreateReturn={(purchaseId) => router.push(`/dashboard/purchase-returns/create?purchase_id=${purchaseId}`)}
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
                            showingText="Purchases"
                        />
                    )}

                </DashboardCard>

            </div>

            <DeleteModal
                title={isBulkDelete ? `purchases (${selectedPurchases.length})` : "purchase"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default PurchaseView

