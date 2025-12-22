'use client'

import { DashboardCard, FilterTabs, DashboardBreadCrumb } from '@/components'
import { useQueryParams } from '@/hooks'
import { useState } from 'react'
import ProductReportTab from './product-report'
import ExpiryTab from './expiry'
import QuantityAlertTab from './quantity-alert'

const ProductsReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'product-report')

    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'product-report':
                return <ProductReportTab />
            case 'expiry':
                return <ExpiryTab />
            case 'quantity-alert':
                return <QuantityAlertTab />
            default:
                return null
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                title='Products Report'
                description="View and analyze your products performance"
            />

            <div className="p-3">
                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= Tab Navigation ================= */}
                    <div className="flex flex-wrap items-center gap-3 justify-between border-y border-slate-200 py-2">
                        <FilterTabs
                            className='w-full md:w-fit'
                            items={[
                                { label: 'Product Reports', key: 'product-report' },
                                { label: 'Product Expiry Report', key: 'expiry' },
                                { label: 'Product Quantity Alert', key: 'quantity-alert' },
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

export default ProductsReportView

