'use client'

import { DashboardBreadCrumb, MetricCard, FilterBar, Pagination, StackIcon, ExportIcon, DashboardCard, useDisclosure, TrashIcon } from '@/components'
import { DeleteModal } from '@/components/modal'
import { BuildingStorefrontIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import { LuChartSpline } from 'react-icons/lu';
import { useState } from 'react';
import { AdjustmentType } from '@/types';
import AdjustmentTable from './AdjustmentTable';
import { adjustmentsData } from '@/data';
import { useRouter } from 'next/navigation';
import ViewAdjustmentModal from './ViewAdjustmentModal';

const AdjustmentView = () => {

    const router = useRouter()
    const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [selectedAdjustments, setSelectedAdjustments] = useState<AdjustmentType[]>([]);
    const [deleteAdjustmentId, setDeleteAdjustmentId] = useState<string | undefined>(undefined)
    const [viewAdjustmentId, setViewAdjustmentId] = useState<string | undefined>(undefined)
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
            // ===========================
            // Delete adjustments logic here
            // ===========================
            // await deleteAdjustments(selectedAdjustments.map(a => a.id))
            console.log('Delete adjustments:', selectedAdjustments.map(a => a.id))
            setSelectedAdjustments([])
        } else if (deleteAdjustmentId) {
            // ===========================
            // Delete adjustment logic here
            // ===========================
            console.log('Delete adjustment with id:', deleteAdjustmentId)
            // await deleteAdjustment(deleteAdjustmentId)
        }
        onDeleteModalClose()
    }

    const filterItems = [
        ...(selectedAdjustments.length > 0 ? [{
            type: 'button' as const,
            label: 'Delete',
            icon: <TrashIcon className="size-4 text-slate-400" />,
            onPress: handleBulkDelete
        }] : []),
        {
            type: 'dropdown' as const,
            label: 'Type: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Positive', key: 'positive' },
                { label: 'Negative', key: 'negative' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Type changed:', key)
            }
        },
        {
            type: 'dateRange' as const,
            buttonIcon: <StackIcon className="text-slate-400" />,
            onChange: (value: Date | { startDate: Date; endDate: Date }) => {
                console.log('Date range changed:', value)
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
                            placeholder: 'Search by reference',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <AdjustmentTable
                        data={adjustmentsData}
                        selectedAdjustments={selectedAdjustments}
                        onSelectionChange={setSelectedAdjustments}
                        onView={(adjustmentId) => {
                            setViewAdjustmentId(adjustmentId)
                            onViewModalOpen()
                        }}
                        onEdit={(adjustmentId) => router.push(`/dashboard/adjustments/${adjustmentId}/edit`)}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={1}
                        totalItems={100}
                        itemsPerPage={25}
                        onPageChange={(page) => {
                            console.log('Page changed:', page)
                        }}
                        showingText="Adjustments"
                    />

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

            <ViewAdjustmentModal 
                isOpen={isViewModalOpen} 
                onClose={onViewModalClose} 
                adjustmentId={viewAdjustmentId}
            />

        </>
    )
}

export default AdjustmentView