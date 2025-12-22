'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon, ExportButton } from '@/components'
import { useState } from 'react'
import RegisterReportTable from './RegisterReportTable'
import RegisterDetailsModal from './RegisterDetailsModal'
import moment from 'moment'

interface RegisterData {
    id: string
    openedOn: string
    closedOn: string
    user: string
    cashInHand: number
    cashInHandWhileClosing: number
    note: string
}

const RegisterReportView = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25
    const [selectedRegister, setSelectedRegister] = useState<RegisterData | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Hardcoded register data
    const registerData: RegisterData[] = [
        {
            id: '1',
            openedOn: '2024-12-09 08:00:00',
            closedOn: '2024-12-09 18:00:00',
            user: 'Admin',
            cashInHand: 0,
            cashInHandWhileClosing: 349.30,
            note: 'Daily register closure'
        },
        {
            id: '2',
            openedOn: '2024-12-08 08:00:00',
            closedOn: '2024-12-08 18:00:00',
            user: 'Manager',
            cashInHand: 0,
            cashInHandWhileClosing: 520.50,
            note: 'End of day'
        },
        {
            id: '3',
            openedOn: '2024-12-07 08:00:00',
            closedOn: '2024-12-07 18:00:00',
            user: 'Admin',
            cashInHand: 0,
            cashInHandWhileClosing: 680.75,
            note: 'Regular closure'
        },
        {
            id: '4',
            openedOn: '2024-12-06 08:00:00',
            closedOn: '2024-12-06 18:00:00',
            user: 'Cashier',
            cashInHand: 0,
            cashInHandWhileClosing: 425.20,
            note: 'Daily register'
        },
        {
            id: '5',
            openedOn: '2024-12-05 08:00:00',
            closedOn: '2024-12-05 18:00:00',
            user: 'Admin',
            cashInHand: 0,
            cashInHandWhileClosing: 750.00,
            note: 'End of business day'
        }
    ]

    const filterItems = [
        {
            type: 'dateRange' as const,
            label: 'Date Range',
            placeholder: 'Select date range'
        },
        {
            type: 'dropdown' as const,
            label: 'User: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Admin', key: 'admin' },
                { label: 'Manager', key: 'manager' },
                { label: 'Cashier', key: 'cashier' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('User changed:', key)
            }
        }
    ]

    const handleView = (register: RegisterData) => {
        setSelectedRegister(register)
        setIsModalOpen(true)
    }

    return (
        <>
            <DashboardBreadCrumb
                title='Register Report'
                description="View and analyze your register transactions"
            />

            <div className="p-3">
                <DashboardCard bodyClassName='space-y-4'>
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by user or note',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                        endContent={<ExportButton />}
                    />

                    <RegisterReportTable 
                        data={registerData} 
                        onView={handleView}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={registerData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            console.log('Page changed:', page)
                        }}
                        showingText="Registers"
                    />
                </DashboardCard>
            </div>

            {selectedRegister && (
                <RegisterDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedRegister(null)
                    }}
                    register={selectedRegister}
                />
            )}
        </>
    )
}

export default RegisterReportView

