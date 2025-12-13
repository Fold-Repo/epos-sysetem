'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure, DeleteModal } from '@/components'
import UserTable from './UserTable'
import PasswordResetModal from './PasswordResetModal'
import { usersData } from '@/data'
import { UserType } from '@/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface OrgUsersViewProps {
    onAddClick?: (handler: () => void) => void
}

const OrgUsersView = ({ onAddClick }: OrgUsersViewProps) => {

    const router = useRouter()

    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const { isOpen: isPasswordResetModalOpen, onOpen: onPasswordResetModalOpen, onClose: onPasswordResetModalClose } = useDisclosure()
    const [deleteUserId, setDeleteUserId] = useState<string | undefined>(undefined)
    const [resetPasswordUser, setResetPasswordUser] = useState<UserType | undefined>(undefined)

    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                router.push('/dashboard/people/users/create')
            })
        }
    }, [onAddClick, router])

    const confirmDelete = () => {
        console.log('Delete user:', deleteUserId)
        onDeleteModalClose()
        setDeleteUserId(undefined)
    }

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: 'Role: All',
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
                console.log('Role changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Store: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Main Store', key: 'main-store' },
                { label: 'Warehouse A', key: 'warehouse-a' },
                { label: 'Warehouse B', key: 'warehouse-b' },
                { label: 'Branch Store 1', key: 'branch-1' },
                { label: 'Branch Store 2', key: 'branch-2' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Store changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Sort By: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'Name (A-Z)', key: 'name_asc' },
                { label: 'Name (Z-A)', key: 'name_desc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Sort changed:', key)
            }
        },
        {
            type: 'dateRange' as const,
            label: 'Data',
            placeholder: 'Select date range'
        },
    ]

    return (
        <>
            <DashboardCard bodyClassName='space-y-4'>
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by name, email, or phone',
                        className: 'w-full md:w-72'
                    }}
                    items={filterItems}
                />

                <UserTable
                    data={usersData}
                    onEdit={(user) => {
                        if (user.id) {
                            router.push(`/dashboard/people/users/${user.id}/edit`)
                        }
                    }}
                    onDelete={(userId) => {
                        setDeleteUserId(userId)
                        onDeleteModalOpen()
                    }}
                    onResetPassword={(user) => {
                        setResetPasswordUser(user)
                        onPasswordResetModalOpen()
                    }}
                />

                <Pagination
                    currentPage={1}
                    totalItems={100}
                    itemsPerPage={25}
                    onPageChange={(page) => {
                        console.log('Page changed:', page)
                    }}
                    showingText="Users"
                />
            </DashboardCard>

            <DeleteModal
                title="user"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteUserId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />

            <PasswordResetModal
                isOpen={isPasswordResetModalOpen}
                onClose={() => {
                    setResetPasswordUser(undefined)
                    onPasswordResetModalClose()
                }}
                user={resetPasswordUser}
            />
        </>
    )
}

export default OrgUsersView