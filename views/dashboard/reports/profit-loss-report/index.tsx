'use client'

import { DashboardCard, FilterBar, FilterTabs, DashboardBreadCrumb } from '@/components'
import { useQueryParams } from '@/hooks'
import { useState } from 'react'
import ChartViewTab from './ChartViewTab'
import ListViewTab from './ListViewTab'
import { ProfitLossReportQueryParams, useGetProfitLossReport } from '@/services'

const ProfitLossReportView = () => {
    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'chart')

    const queryParams: ProfitLossReportQueryParams = {
        view: activeTab === 'chart' ? 'chart' : 'list',
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
    }

    const { data, isLoading } = useGetProfitLossReport(queryParams)
    const reportData = data?.profitLoss ?? []
    const chartLabels = data?.labels ?? []
    const incomeOverview = data?.incomeOverview ?? []
    const trend = data?.trend ?? []

    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'chart':
                return <ChartViewTab labels={chartLabels} incomeOverview={incomeOverview} trend={trend} loading={isLoading} />
            case 'list':
                return <ListViewTab data={reportData} loading={isLoading} />
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

                    <FilterBar
                        items={[
                            {
                                type: 'dateRange' as const,
                                startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
                                endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
                                onChange: (value: Date | { startDate: Date; endDate: Date }) => {
                                    if ('startDate' in value && 'endDate' in value) {
                                        updateQueryParams({
                                            startDate: value.startDate.toISOString().split('T')[0],
                                            endDate: value.endDate.toISOString().split('T')[0],
                                        })
                                    }
                                }
                            }
                        ]}
                    />

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

