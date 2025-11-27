'use client'

import { Avatar, Chip, User } from '@heroui/react'
import { useState, useRef } from 'react'
import {
    UserIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline'
import { LogoutIcon } from '@/components/icons'
import Link from 'next/link'
import { useClickOutside } from '@/hooks'

interface NavDropdownProps {
    openLogoutModal: () => void
    openChangePasswordModal: () => void
    root?: string
}

const NavDropdown = ({ openLogoutModal, openChangePasswordModal, root = '/dashboard' }: NavDropdownProps) => {

    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useClickOutside(dropdownRef, () => setIsOpen(false))

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 18) return 'Good Afternoon'
        return 'Good Evening'
    }

    return (
        <div className="relative pt-1" ref={dropdownRef}>

            <button onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none cursor-pointer">
                <User
                    as="div"
                    avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        radius: "full",
                        size: 'md'
                    }}
                    className="transition-transform"
                    description="Admin"
                    name="Oluwafemi Samson"
                    classNames={{
                        name: 'text-xs font-medium truncate max-w-32 pt-1 hidden sm:block',
                        description: 'text-[12px] truncate max-w-30 hidden sm:block -mt-0.5',
                        base: 'gap-x-2',
                    }}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white 
                rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

                    <div className="p-5 space-y-4">

                        <div className="flex flex-col items-center space-y-3 pb-5">

                            <div className="relative">
                                <Avatar size="lg" src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                                    color='primary' radius="full"
                                />
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-medium text-dark/80">{getGreeting()}</h2>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="text-sm text-black">Admin POS</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-sm text-purple-600">admin@Epos.com</span>
                                </div>
                            </div>

                            <Chip color='success' size='sm' variant='flat'>Online - Active</Chip>
                            
                        </div>

                        {/* ================= METRICS CARD ================= */}
                        <div className="bg-purple-50 rounded-xl py-2 border border-purple-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-medium text-black">100k</h3>
                                    <p className="text-xs text-purple-600 mt-1">Active Users</p>
                                </div>
                                <div className="text-center border-l border-purple-200">
                                    <h3 className="text-xl font-medium text-black">100k</h3>
                                    <p className="text-xs text-purple-600 mt-1">Today Order's</p>
                                </div>
                            </div>
                        </div>

                        {/* ================= ACTION LINKS ================= */}
                        <div className="space-y-2.5">

                            <Link href={`${root}/profile`} onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                <UserIcon className="size-5 text-gray-600" />
                                <span className="text-sm text-black">Profile Settings</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    openChangePasswordModal();
                                }}
                                className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <LockClosedIcon className="size-5 text-gray-600" />
                                <span className="text-sm text-black">Change Password</span>
                            </button>

                            <button onClick={() => {setIsOpen(false); openLogoutModal()}} className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                <LogoutIcon className="size-4 text-gray-600" />
                                <span className="text-sm text-black">Logout</span>
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}

export default NavDropdown
