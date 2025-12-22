'use client'

import { DashboardCard, FilterTabs, DashboardBreadCrumb, ExportButton } from '@/components'
import { useQueryParams } from '@/hooks'
import { useState } from 'react'
import ChartViewTab from './ChartViewTab'
import ListViewTab from './ListViewTab'

const ProfitLossReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'chart')

    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'chart':
                return <ChartViewTab />
            case 'list':
                return <ListViewTab />
            default:
                return null
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                title='Profit & Loss Report'
                description="View and analyze your profit and loss performance"
            />

            <div className="p-3">
                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= Tab Navigation ================= */}
                    <div className="flex flex-wrap items-center gap-3 justify-between border-y border-slate-200 py-2">
                        <FilterTabs
                            className='w-full md:w-fit'
                            items={[
                                { label: 'Chart View', key: 'chart' },
                                { label: 'List View', key: 'list' },
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

export default ProfitLossReportView

