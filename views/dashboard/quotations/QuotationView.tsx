'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, DashboardCard, useDisclosure, TrashIcon, StackIcon } from '@/components'
import { DeleteModal } from '@/components/modal'
import { BuildingStorefrontIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import { LuChartSpline } from 'react-icons/lu';
import { useState } from 'react';
import { QuotationType } from '@/types';
import QuotationTable from './QuotationTable';
import { useRouter } from 'next/navigation';
import { useGetQuotations, QuotationQueryParams } from '@/services';
import { useQueryParams } from '@/hooks';
import { useAppSelector, selectStores } from '@/store';

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
    { label: 'Status (Z-A)', key: 'status_desc' }
]

const STATUS_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Draft', key: 'draft' },
    { label: 'Sent', key: 'sent' },
    { label: 'Approved', key: 'approved' },
    { label: 'Rejected', key: 'rejected' }
]

const QuotationView = () => {

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
    const queryParams: QuotationQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        store_id: storeIdParam ? parseInt(storeIdParam, 10) : undefined,
        sort: searchParams.get('sort') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    }
    
    // ================================
    // FETCH QUOTATIONS
    // ================================
    const { data, isLoading } = useGetQuotations(queryParams)
    const { quotations, pagination } = data || {}
    
    // ================================
    // DELETE MODAL STATE
    // ================================
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedQuotations, setSelectedQuotations] = useState<QuotationType[]>([]);
    const [deleteQuotationId, setDeleteQuotationId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    const metricsData = [
        {
            title: "Total Quotations",
            value: "1,247",
            description: "+12% from last month",
            colorClass: "text-[#16A34A]",
            icon: <LuChartSpline className='size-4' />
        },
        {
            title: "Sent",
            value: "89",
            description: "-5% from last month",
            colorClass: "text-[#2563EB]",
            icon: <BuildingStorefrontIcon className='size-4' />
        },
        {
            title: "Approved",
            value: "634",
            description: "+8% from last month",
            colorClass: "text-[#9333EA]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Draft",
            value: "524",
            description: "+3% from last month",
            colorClass: "text-[#EA580C]",
            icon: <UserGroupIcon className='size-4' />
        }
    ]

    const handleBulkDelete = () => {
        if (selectedQuotations.length > 0) {
            setIsBulkDelete(true)
            setDeleteQuotationId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDelete = (quotationId: string) => {
        setDeleteQuotationId(quotationId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = () => {
        // TODO: Implement delete functionality
        if (isBulkDelete) {
            console.log('Delete quotations:', selectedQuotations.map(q => q.id))
            setSelectedQuotations([])
        } else {
            console.log('Delete quotation:', deleteQuotationId)
        }
        onDeleteModalClose()
    }

    // ================================
    // GET LABEL FOR CURRENT FILTER VALUE
    // ================================
    const getStatusLabel = () => {
        const current = STATUS_OPTIONS.find(o => o.key === queryParams.status)
        return current ? `Status: ${current.label}` : 'Status: All'
    }

    const getSortLabel = () => {
        const current = SORT_OPTIONS.find(o => o.key === queryParams.sort)
        return current ? `Sort: ${current.label}` : 'Sort By'
    }

    // ================================
    // STORE OPTIONS
    // ================================
    const storeOptions = stores
        .filter(s => s.store_id !== undefined)
        .map(s => ({ value: String(s.store_id), label: s.name }))

    const getStoreLabel = () => {
        if (!queryParams.store_id) return 'Store: All'
        const store = stores.find(s => s.store_id === queryParams.store_id)
        return store ? `Store: ${store.name}` : 'Store: All'
    }

    // ================================
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
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
                title="Quotations"
                description="Manage your quotations here."
                endContent={
                    <Button 
                        onPress={() => router.push('/dashboard/quotations/create')} 
                        size='sm' 
                        className='px-4 bg-primary text-white h-9'>
                        Create Quotation
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
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({ search: value || null, page: 1 })
                            }
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <QuotationTable
                        data={quotations ?? []}
                        selectedQuotations={selectedQuotations}
                        onSelectionChange={setSelectedQuotations}
                        onView={(quotationId) => router.push(`/dashboard/quotations/${quotationId}`)}
                        onEdit={(quotationId) => router.push(`/dashboard/quotations/${quotationId}/edit`)}
                        onDelete={handleDelete}
                        onCreateSale={(quotationId) => router.push(`/dashboard/sales/create?from_quotation=${quotationId}`)}
                        onDownloadPDF={(quotationId) => {
                            console.log('Download PDF for quotation:', quotationId)
                        }}
                        loading={isLoading}
                    />

                    {pagination && (
                        <Pagination
                            currentPage={typeof pagination.page === 'string' ? parseInt(pagination.page, 10) : pagination.page}
                            totalItems={pagination.total}
                            itemsPerPage={typeof pagination.limit === 'string' ? parseInt(pagination.limit, 10) : pagination.limit}
                            onPageChange={(page) => {
                                updateQueryParams({ page })
                            }}
                            showingText="Quotations"
                        />
                    )}

                </DashboardCard>

            </div>

            <DeleteModal
                title={isBulkDelete ? `quotations (${selectedQuotations.length})` : "quotation"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default QuotationView
