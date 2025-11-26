'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
    XMarkIcon,
    TrophyIcon,
    UserGroupIcon,
    AcademicCapIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import SidebarLink from './SidebarLink';
import { TbLayout2 } from 'react-icons/tb';
import { LuGitBranch } from 'react-icons/lu';
import { BsBoxes } from 'react-icons/bs';
import { IoWalletOutline } from 'react-icons/io5';


interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    profile?: unknown
}

const SideBar: React.FC<SidebarProps> = ({ open, setOpen }) => {

    const pathname = usePathname()

    const links = [
        {
            href: '/dashboard',
            icon: <TbLayout2 className='size-5' />,
            text: 'Dashboard'
        },
        {
            href: '/dashboard/genealogy',
            icon: <LuGitBranch className='size-5' />,
            text: 'Genealogy'
        },
        {
            href: '/dashboard/wallet',
            icon: <IoWalletOutline className='size-5' />,
            text: 'Earning & Wallet'
        },
        // {
        //     href: '/dashboard/communication',
        //     icon: <ChatBubbleLeftRightIcon className='size-5' />,
        //     text: 'Communication Forum'
        // },
        {
            href: '/dashboard/products',
            icon: <BsBoxes className='size-5' />,
            text: 'Products Management'
        },
        {
            href: '/dashboard/leadership',
            icon: <TrophyIcon className='size-5' />,
            text: 'Leadership & Achievement'
        },
        {
            href: '/dashboard/referrals',
            icon: <UserGroupIcon className='size-5' />,
            text: 'Referrals & Marketing Tools'
        },
        {
            href: '/dashboard/training',
            icon: <AcademicCapIcon className='size-5' />,
            text: 'Training & Resources'
        },
        {
            href: '/dashboard/settings',
            icon: <Cog6ToothIcon className='size-5' />,
            text: 'Settings'
        },
    ];

    const handleLinkClick = () => {
        setTimeout(() => {
            setOpen(false);
        }, 100);
    };

    return (
        <>

            {open && (
                <div className="fixed inset-0 bg-black/50 block xl:hidden z-20"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside className={`sidebar fixed inset-y-0 left-0 flex flex-col overflow-x-hidden transition-all duration-200 -translate-x-full bg-[#F5F2F0] border-0 z-30 ${open && 'translate-x-0'} max-w-66 w-66 xl:translate-x-0`}>

                <div className="flex items-center justify-between px-5 py-3 border-b border-[#6C72781A]">

                    <Link href="/dashboard" className="block" onClick={handleLinkClick}>
                        <Image className='w-14' src="/img/logo/logo.svg"
                            alt="Logo" width={100} height={100} />
                    </Link>

                    <Button size='sm' onPress={() => setOpen(false)} isIconOnly className='bg-white border-none xl:hidden rounded-full'>
                        <XMarkIcon className='size-4 text-black' />
                    </Button>

                </div>

                <div className="flex flex-col flex-1 overflow-y-auto">

                    <div className="px-5 mb-4 py-4">

                        {/*  ================= PROFILE ================= */}
                        <div className="space-y-2 pb-5">
                            <h2 className='text-base font-semibold text-[#0B1221] leading-5'>
                                Welcome back👋🏻 <br />
                                <span className="line-clamp-1">Oluwafemi Samson</span>
                            </h2>
                            <p className="text-xs text-secondary">
                                Control and manage your experience with ravella.
                            </p>
                        </div>

                        <div className="h-1.5 rounded-b-md bg-transparent shadow-[0px_4px_4px_0px_rgba(255,255,255,0.01)_inset,0px_1.5px_1.5px_0px_rgba(255,255,255,0.05)_inset,0px_1px_1px_0px_rgba(255,255,255,0.02)_inset,0px_0.5px_0.5px_0px_rgba(255,255,255,0.05)_inset,0px_2px_2px_-2px_rgba(0,0,0,0.16),0px_0.72px_0.72px_0px_rgba(0,0,0,0.05),0px_0.48px_0.48px_0px_rgba(255,255,255,0.04)_inset,0px_1.19px_1.19px_0px_rgba(0,0,0,0.05),0px_3.82px_3.82px_0px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(255,255,255,0.01)_inset]" />

                        {/*  ================= LINKS ================= */}

                        <div className="flex-1 pt-4">

                            <h6 className='text-xs text-[#0B12214D]'>MENU</h6>

                            <div className="items-center block w-full h-auto grow basis-full pt-4">

                                <ul className="flex flex-col pl-0 mb-0 list-none space-y-1.5">

                                    {links.map((link, index) => {
                                        const isActive = link.href === '/dashboard'
                                            ? pathname === '/dashboard'
                                            : pathname === link.href || pathname.startsWith(link.href + '/')
                                        
                                        return (
                                            <li key={index} className="w-full">
                                                <SidebarLink
                                                    href={link.href}
                                                    icon={link.icon}
                                                    text={link.text}
                                                    isActive={isActive}
                                                    onClick={handleLinkClick}
                                                />
                                            </li>
                                        )
                                    })}

                                </ul>

                            </div>

                        </div>

                    </div>

                    {/*  ================= LOGOUT ================= */}
                    <div className="px-5 py-2.5 w-full mt-auto border-t border-[#0B12211A]">

                        <Button fullWidth variant="light" className='flex items-center justify-start'>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.31083 16.1626H5.03C3.95345 16.2118 2.90081 15.8352 2.09983 15.1142C1.29884 14.3932 0.813931 13.3859 0.75 12.3101V4.60678C0.813931 3.531 1.29884 2.52365 2.09983 1.80268C2.90081 1.0817 3.95345 0.705071 5.03 0.754281H9.31" stroke="#0B1221" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15.4091 8.4585H4.28162" stroke="#0B1221" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                                <path d="M11.4825 12.7382L15.1525 9.06822C15.3134 8.90593 15.4036 8.6867 15.4036 8.45822C15.4036 8.22975 15.3134 8.01052 15.1525 7.84822L11.4825 4.17822" stroke="#0B1221" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm text-text-color">Logout</span>
                        </Button>

                    </div>

                </div>

            </aside>

        </>
    )
}

export default SideBar