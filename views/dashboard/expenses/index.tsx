'use client'

import { DashboardCard, FilterTabs, DashboardBreadCrumb } from '@/components'
import { useQueryParams } from '@/hooks'
import { useRef, useState } from 'react'
import ExpensesListView from './ex-list'
import ExpensesCategoryView from './ex-category'
import { Button } from '@heroui/react'

const ExpensesView = () => {

    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'expenses')

    const onClickHandlerRef = useRef<(() => void) | null>(null)

    const handleAddClick = () => {
        onClickHandlerRef.current?.()
    }

    const getTabContent = (tab: string) => {

        const registerHandler = (handler: () => void) => {
            onClickHandlerRef.current = handler
        }

        switch (tab) {
            case 'expenses':
                return <ExpensesListView onAddClick={registerHandler} />
            case 'category':
                return <ExpensesCategoryView onAddClick={registerHandler} />
            default:
                return null
        }
    }

    const getButtonTitle = (tab: string) => {
        switch (tab) {
            case 'expenses':
                return 'Add Expense'
            case 'category':
                return 'Add Category'
            default:
                return null
        }
    }

    return (
        <>

            <DashboardBreadCrumb title='Expenses' description="Manage your expenses here. Add, edit, and delete expenses as needed."
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
                                { label: 'Expenses', key: 'expenses' },
                                { label: 'Category', key: 'category' },
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

export default ExpensesView

