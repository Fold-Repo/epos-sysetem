'use client'

import { DashboardCard, FilterTabs, DashboardBreadCrumb, ExportButton } from '@/components'
import { useQueryParams } from '@/hooks'
import { useState } from 'react'
import InventoryTab from './InventoryTab'
import StockHistoryTab from './StockHistoryTab'
import SoldStockTab from './SoldStockTab'

const InventoryReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'inventory')

    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'inventory':
                return <InventoryTab />
            case 'stock-history':
                return <StockHistoryTab />
            case 'sold-stock':
                return <SoldStockTab />
            default:
                return null
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                title='Inventory Report'
                description="View and analyze your inventory performance"
            />

            <div className="p-3">
                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= Tab Navigation ================= */}
                    <div className="flex flex-wrap items-center gap-3 justify-between border-y border-slate-200 py-2">
                        <FilterTabs
                            className='w-full md:w-fit'
                            items={[
                                { label: 'Inventory', key: 'inventory' },
                                { label: 'Stock History', key: 'stock-history' },
                                { label: 'Sold Stock', key: 'sold-stock' },
                            ]}
                            activeKey={activeTab}
                            onTabChange={(key) => {
                                setActiveTab(key)
                                updateQueryParams({ tab: key })
                            }}
                        />
                    </div>

                    {getTabContent(activeTab)}

                </DashboardCard>
            </div>
        </>
    )
}

export default InventoryReportView

