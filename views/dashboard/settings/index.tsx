'use client'

import { DashboardBreadCrumb, DashboardCard, FilterTabs } from '@/components'
import React, { useState } from 'react'
import GeneralSettingsView from './general'
import ReceiptSettingsView from './ReceiptSettingsView'

const SettingsView = () => {

    const [activeTab, setActiveTab] = useState<string>('general')

    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'general':
                return <GeneralSettingsView />
            case 'receipt-settings':
                return <ReceiptSettingsView />
            default:
                return null
        }
    }


    return (
        <>

            <DashboardBreadCrumb
                title='Settings'
                description="Manage your settings here."
            />

            <div className="p-3">

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= Tab Navigation ================= */}
                    <div className="flex flex-wrap items-center gap-3 justify-between border-y border-slate-200 py-2">

                        <FilterTabs
                            className='w-full md:w-fit'
                            items={[
                                { label: 'General', key: 'general' },
                                { label: 'Receipt Settings', key: 'receipt-settings' },
                            ]}
                            activeKey={activeTab}
                            onTabChange={(key) => {
                                setActiveTab(key)
                            }}
                        />

                    </div>

                    {getTabContent(activeTab)}

                </DashboardCard>

            </div>

        </>
    )
}

export default SettingsView