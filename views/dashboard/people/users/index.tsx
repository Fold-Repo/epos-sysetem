'use client'

import { DashboardCard, FilterBar, Pagination, StackIcon, useDisclosure, DeleteModal } from '@/components'
import UserTable from './UserTable'
import PasswordResetModal from './PasswordResetModal'
import { StaffUserType, RoleType, StoreType } from '@/types'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetBusinessUsers, useDeleteBusinessUser } from '@/services'
import { useAppSelector, selectRoles, selectStores } from '@/store'

interface OrgUsersViewProps {
    onAddClick?: (handler: () => void) => void
}

const OrgUsersView = ({ onAddClick }: OrgUsersViewProps) => {

    const router = useRouter()

    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const { isOpen: isPasswordResetModalOpen, onOpen: onPasswordResetModalOpen, onClose: onPasswordResetModalClose } = useDisclosure()
    const [deleteUserId, setDeleteUserId] = useState<number | undefined>(undefined)
    const [resetPasswordUser, setResetPasswordUser] = useState<StaffUserType | undefined>(undefined)
    
    // Filter states
    const [page, setPage] = useState(1)
    const [limit] = useState(25)
    const [search, setSearch] = useState('')
    const [roleId, setRoleId] = useState<number | undefined>(undefined)
    const [storeId, setStoreId] = useState<number | undefined>(undefined)
    const [sort, setSort] = useState<'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'role_asc' | 'role_desc' | undefined>(undefined)

    // ================================
    // GET ROLES AND STORES FROM REDUX STATE
    // ================================
    const rolesData = useAppSelector(selectRoles)
    const storesData = useAppSelector(selectStores)
    
    // Transform to RoleType and StoreType format
    const roles: RoleType[] = rolesData.map(role => ({
        id: role.role_id,
        name: role.name,
        description: role.description,
        created_at: role.created_at
    }))
    
    const stores: StoreType[] = storesData.map(store => ({
        id: store.store_id,
        name: store.name,
        description: store.description,
        created_at: store.created_at
    }))

    // Fetch data
    const { data: usersData, isLoading: usersLoading } = useGetBusinessUsers({
        page,
        limit,
        search: search || undefined,
        role_id: roleId,
        store_id: storeId,
        sort
    })

    const deleteUserMutation = useDeleteBusinessUser()
    
    useEffect(() => {
        if (onAddClick) {
            onAddClick(() => {
                router.push('/dashboard/people/users/create')
            })
        }
    }, [onAddClick, router])

    const confirmDelete = () => {
        if (deleteUserId) {
            deleteUserMutation.mutate(deleteUserId, {
                onSuccess: () => {
                    onDeleteModalClose()
                    setDeleteUserId(undefined)
                }
            })
        }
    }

    const roleOptions = useMemo(() => {
        const options = [{ label: 'All', key: 'all' }]
        roles.forEach(role => {
            options.push({ label: role.name, key: String(role.id) })
        })
        return options
    }, [roles])

    const storeOptions = useMemo(() => {
        const options = [{ label: 'All', key: 'all' }]
        stores.forEach(store => {
            options.push({ label: store.name, key: String(store.id) })
        })
        return options
    }, [stores])

    const getRoleLabel = () => {
        if (!roleId) return 'Role: All'
        const role = roles.find(r => r.id === roleId)
        return role ? `Role: ${role.name}` : 'Role: All'
    }

    const getStoreLabel = () => {
        if (!storeId) return 'Store: All'
        const store = stores.find(s => s.id === storeId)
        return store ? `Store: ${store.name}` : 'Store: All'
    }

    const getSortLabel = () => {
        if (!sort) return 'Sort By: All'
        const sortLabels: Record<string, string> = {
            'newest': 'Newest First',
            'oldest': 'Oldest First',
            'name_asc': 'Name (A-Z)',
            'name_desc': 'Name (Z-A)',
            'role_asc': 'Role (A-Z)',
            'role_desc': 'Role (Z-A)'
        }
        return `Sort By: ${sortLabels[sort] || 'All'}`
    }

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: getRoleLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: roleOptions,
            value: roleId ? String(roleId) : 'all',
            onChange: (key: string) => {
                setRoleId(key === 'all' ? undefined : Number(key))
                setPage(1)
            }
        },
        {
            type: 'dropdown' as const,
            label: getStoreLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: storeOptions,
            value: storeId ? String(storeId) : 'all',
            onChange: (key: string) => {
                setStoreId(key === 'all' ? undefined : Number(key))
                setPage(1)
            }
        },
        {
            type: 'dropdown' as const,
            label: getSortLabel(),
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Name (A-Z)', key: 'name_asc' },
                { label: 'Name (Z-A)', key: 'name_desc' },
                { label: 'Role (A-Z)', key: 'role_asc' },
                { label: 'Role (Z-A)', key: 'role_desc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
            ],
            value: sort || 'all',
            onChange: (key: string) => {
                setSort(key === 'all' ? undefined : key as any)
                setPage(1)
            }
        },
    ]

    return (
        <>
            <DashboardCard bodyClassName='space-y-4'>
                <FilterBar
                    searchInput={{
                        placeholder: 'Search by name, email, or phone',
                        className: 'w-full md:w-72',
                        onSearch: (value: string) => {
                            setSearch(value)
                            setPage(1)
                        }
                    }}
                    items={filterItems}
                />

                <UserTable
                    isLoading={usersLoading}
                    data={usersData?.users || []}
                    onEdit={(user) => {
                        if (user.staff_id || user.id) {
                            router.push(`/dashboard/people/users/${user.staff_id || user.id}/edit`)
                        }
                    }}
                    onDelete={(userId) => {
                        setDeleteUserId(Number(userId))
                        onDeleteModalOpen()
                    }}
                    onResetPassword={(user) => {
                        setResetPasswordUser(user)
                        onPasswordResetModalOpen()
                    }}
                />

                <Pagination
                    currentPage={page}
                    totalItems={usersData?.pagination?.total || 0}
                    itemsPerPage={limit}
                    onPageChange={(newPage) => {
                        setPage(newPage)
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