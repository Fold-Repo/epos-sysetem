'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, StackIcon, DashboardCard, useDisclosure, TrashIcon } from '@/components'
import { DeleteModal } from '@/components/modal'
import { BuildingStorefrontIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import { LuChartSpline } from 'react-icons/lu';
import { useState } from 'react';
import { AdjustmentType } from '@/types';
import AdjustmentTable from './AdjustmentTable';
import { useRouter } from 'next/navigation';
import { useGetAdjustments, AdjustmentQueryParams } from '@/services';
import { useQueryParams } from '@/hooks';

// ================================
// CONSTANTS
// ================================
const LIMIT = 25

const SORT_OPTIONS = [
    { label: 'Newest First', key: 'newest' },
    { label: 'Oldest First', key: 'oldest' },
    { label: 'Date (Newest)', key: 'date_desc' },
    { label: 'Date (Oldest)', key: 'date_asc' }
]

const TYPE_OPTIONS = [
    { label: 'All', key: 'all' },
    { label: 'Positive', key: 'positive' },
    { label: 'Negative', key: 'negative' }
]

const AdjustmentView = () => {

    const router = useRouter()
    const { searchParams, updateQueryParams } = useQueryParams()
    
    // ================================
    // GET QUERY PARAMS FROM URL
    // ================================
    const queryParams: AdjustmentQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        type: searchParams.get('type') || undefined,
        sort: searchParams.get('sort') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined
    }
    
    // ================================
    // FETCH ADJUSTMENTS
    // ================================
    const { data, isLoading } = useGetAdjustments(queryParams)
    const { adjustments, pagination } = data || {}
    
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedAdjustments, setSelectedAdjustments] = useState<AdjustmentType[]>([]);
    const [deleteAdjustmentId, setDeleteAdjustmentId] = useState<string | undefined>(undefined)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    const metricsData = [
        {
            title: "Total Adjustments",
            value: "1,247",
            description: "+12% from last month",
            colorClass: "text-[#16A34A]",
            icon: <LuChartSpline className='size-4' />
        },
        {
            title: "Purchase Returns",
            value: "89",
            description: "-5% from last month",
            colorClass: "text-[#2563EB]",
            icon: <BuildingStorefrontIcon className='size-4' />
        },
        {
            title: "Positive Adjustments",
            value: "634",
            description: "+8% from last month",
            colorClass: "text-[#9333EA]",
            icon: <CurrencyDollarIcon className='size-4' />
        },
        {
            title: "Negative Adjustments",
            value: "524",
            description: "+3% from last month",
            colorClass: "text-[#EA580C]",
            icon: <UserGroupIcon className='size-4' />
        }
    ]

    const handleBulkDelete = () => {
        if (selectedAdjustments.length > 0) {
            setIsBulkDelete(true)
            setDeleteAdjustmentId(undefined)
            onDeleteModalOpen()
        }
    }

    const handleDelete = (adjustmentId: string) => {
        setDeleteAdjustmentId(adjustmentId)
        setIsBulkDelete(false)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (isBulkDelete && selectedAdjustments.length > 0) {
            // TODO: Implement bulk delete
            console.log('Delete adjustments:', selectedAdjustments.map(a => a.id))
            setSelectedAdjustments([])
        } else if (deleteAdjustmentId) {
            // TODO: Implement delete
            console.log('Delete adjustment with id:', deleteAdjustmentId)
        }
        onDeleteModalClose()
    }

    // ================================
    // GET LABEL FOR CURRENT FILTER VALUE
    // ================================
    const getTypeLabel = () => {
        const current = TYPE_OPTIONS.find(o => o.key === queryParams.type)
        return current ? `Type: ${current.label}` : 'Type: All'
    }

    const getSortLabel = () => {
        const current = SORT_OPTIONS.find(o => o.key === queryParams.sort)
        return current ? `Sort: ${current.label}` : 'Sort By'
    }

    // ================================
    // FILTER ITEMS CONFIG
    // ================================
    const filterItems = [
        ...(selectedAdjustments.length > 0 ? [{
            type: 'button' as const,
            label: `Delete (${selectedAdjustments.length})`,
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
            label: getTypeLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: TYPE_OPTIONS,
            value: queryParams.type || 'all',
            onChange: (key: string) => {
                updateQueryParams({ type: key === 'all' ? null : key, page: 1 })
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
                title="Adjustments"
                description="Manage your adjustments here. Add, edit, and delete adjustments as needed."
                endContent={
                    <Button onPress={() => router.push('/dashboard/adjustments/create')} size='sm' className='px-4 bg-primary text-white h-9'>
                        Create Adjustment
                    </Button>
                }
            />

            <div className="p-3 space-y-3">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {metricsData.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            description={metric.description}
                            colorClass={metric.colorClass}
                            useColorForDescription={true}
                            icon={metric.icon}
                        />
                    ))}
                </div>

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search adjustments',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({ search: value || null, page: 1 })
                            }
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <AdjustmentTable
                        data={adjustments ?? []}
                        selectedAdjustments={selectedAdjustments}
                        onSelectionChange={setSelectedAdjustments}
                        onView={(adjustmentId) => router.push(`/dashboard/adjustments/${adjustmentId}`)}
                        onEdit={(adjustmentId) => router.push(`/dashboard/adjustments/${adjustmentId}/edit`)}
                        onDelete={handleDelete}
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
                            showingText="Adjustments"
                        />
                    )}

                </DashboardCard>

            </div>

            <DeleteModal
                title={isBulkDelete ? `adjustments (${selectedAdjustments.length})` : "adjustment"}
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) onDeleteModalClose()
                }}
                onDelete={confirmDelete}
            />


        </>
    )
}

export default AdjustmentView