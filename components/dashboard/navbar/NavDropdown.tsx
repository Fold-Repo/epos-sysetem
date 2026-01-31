'use client'

import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectProfile } from '@/store/slice'

interface NavDropdownProps {
    openLogoutModal: () => void
    openChangePasswordModal: () => void
    root?: string
}

const NavDropdown = ({ openLogoutModal, openChangePasswordModal, root = '/dashboard' }: NavDropdownProps) => {

    const profile = useSelector(selectProfile)
    const user = profile?.user
    const displayName = user ? [user.firstname, user.lastname].filter(Boolean).join(' ') : null
    const initials = user
        ? [user.firstname?.[0], user.lastname?.[0]].filter(Boolean).join('').toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
        : '?'

    return (
        <Dropdown>

            <DropdownTrigger>
                <Avatar
                    isBordered
                    size="sm"
                    as="button"
                    className="transition-transform"
                    src={profile?.business?.logo ?? undefined}
                    name={displayName || undefined}
                    showFallback
                    getInitials={(name) => (name?.slice(0, 2) ?? initials).toUpperCase()}
                />
            </DropdownTrigger>

            <DropdownMenu variant="flat">

                <DropdownItem key="profile" className="h-12 gap-2 mb-2">
                    <p className="text-sm font-semibold">Signed in as</p>
                    <p className="text-xs truncate text-gray-600">{user?.email ?? '—'}</p>
                </DropdownItem>

                <DropdownItem as={Link} href={`${root}/settings`} classNames={{
                    title: 'text-xs'
                }} className='py-1' key="settings">Settings</DropdownItem>

                {/* <DropdownItem onPress={openChangePasswordModal} classNames={{
                    title: 'text-xs'
                }} className='py-1' key="password">Change Password</DropdownItem> */}

                <DropdownItem onPress={openLogoutModal} classNames={{
                    title: 'text-xs'
                }} className='py-1' key="logout" color="danger">
                    Log Out
                </DropdownItem>

            </DropdownMenu>

        </Dropdown>
    )
}

export default NavDropdown
