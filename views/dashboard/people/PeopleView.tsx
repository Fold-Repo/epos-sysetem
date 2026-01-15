'use client'

import { DashboardCard, FilterTabs, DashboardBreadCrumb } from '@/components'
import { useQueryParams } from '@/hooks'
import { useRef, useState } from 'react'
import { Button } from '@heroui/react'
import SuppliersView from './suppliers'
import CustomerView from './customer'
import OrgUsersView from './users'

const PeopleView = () => {

    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'suppliers')

    const onClickHandlerRef = useRef<(() => void) | null>(null)

    const handleAddClick = () => {
        onClickHandlerRef.current?.()
    }

    const getTabContent = (tab: string) => {

        const registerHandler = (handler: () => void) => {
            onClickHandlerRef.current = handler
        }

        switch (tab) {
            case 'suppliers':
                return <SuppliersView onAddClick={registerHandler} />
            case 'customers':
                return <CustomerView onAddClick={registerHandler} />
            case 'users':
                return <OrgUsersView onAddClick={registerHandler} />
            default:
                return null
        }
    }

    const getButtonTitle = (tab: string) => {
        switch (tab) {
            case 'suppliers':
                return 'Add Supplier'
            case 'customers':
                return 'Add Customer'
            case 'users':
                return 'Add User'
            default:
                return null
        }
    }

    return (
        <>

            <DashboardBreadCrumb 
                title='People'
                description="Manage your people here. Add, edit, and delete people as needed."
                endContent={
                    getButtonTitle(activeTab || '') && (
                        <Button size='sm' className='px-4 bg-primary text-white h-9'
                            onPress={handleAddClick}>
                                {getButtonTitle(activeTab || '')}
                            </Button>
                        )
                } />

            <div className="p-3">

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= Tab Navigation ================= */}
                    <div className="flex flex-wrap items-center gap-3 justify-between border-y border-slate-200 py-2">

                        <FilterTabs
                            className='w-full md:w-fit'
                            items={[
                                { label: 'Suppliers', key: 'suppliers' },
                                { label: 'Customers', key: 'customers' },
                                { label: 'Users', key: 'users' },
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

export default PeopleView

