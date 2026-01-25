'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard } from '@/components'
import { StackIcon } from '@/components'
import { Button } from '@heroui/react';
import { useState } from 'react';
import { PurchaseReturnType, PurchaseReturnQueryParams } from '@/types';
import PurchaseReturnTable from './PurchaseReturnTable';
import { useRouter } from 'next/navigation';
import { useGetPurchaseReturns } from '@/services';
import { useQueryParams } from '@/hooks';
import { useAppSelector, selectStores } from '@/store';

// ================================
// CONSTANTS
// ================================
const LIMIT = 25

const PurchaseReturnView = () => {

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
    const queryParams: PurchaseReturnQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: LIMIT,
        search: searchParams.get('search') || undefined,
        store_id: storeIdParam ? parseInt(storeIdParam, 10) : undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        sort: searchParams.get('sort') || undefined
    }
    
    // ================================
    // FETCH PURCHASE RETURNS
    // ================================
    const { data, isLoading } = useGetPurchaseReturns(queryParams)
    const { purchaseReturns, pagination } = data || {}
    
    // ================================
    // SELECTION STATE
    // ================================
    const [selectedReturns, setSelectedReturns] = useState<PurchaseReturnType[]>([])

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
        }
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Purchase Returns"
                description="Manage your purchase returns here."
            />

            <div className="p-3 space-y-3">

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by purchase reference',
                            className: 'w-full md:w-72',
                            onSearch: (value: string) => {
                                updateQueryParams({ search: value || null, page: 1 })
                            }
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <PurchaseReturnTable
                        data={purchaseReturns ?? []}
                        selectedReturns={selectedReturns}
                        onSelectionChange={setSelectedReturns}
                        onView={(returnId) => router.push(`/dashboard/purchase-returns/${returnId}`)}
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
                            showingText="Purchase Returns"
                        />
                    )}

                </DashboardCard>

            </div>

        </>
    )
}

export default PurchaseReturnView
