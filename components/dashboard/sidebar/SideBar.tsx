'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import SidebarLink from './SidebarLink';
import { LOGO, DashboardSection } from '@/constants';
import { LogoutIcon } from '@/components/icons';
import { UserPermissions } from '@/types';
import { filterLinksByPermissions } from '@/utils';


interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    sections: DashboardSection[];
    root: string;
    permissions?: UserPermissions | null;
    profile?: unknown
}

const SideBar: React.FC<SidebarProps> = ({ open, setOpen, sections = [], root, permissions }) => {

    const pathname = usePathname()
    
    // ===============================================
    // Expanded Sections
    // ===============================================
    const [expandedSections, setExpandedSections] = useState<Set<number>>(() => {
        const allSections = new Set<number>();
        if (sections && sections.length > 0) {
            sections.forEach((_, index) => {
                allSections.add(index);
            });
        }
        return allSections;
    });

    // ===============================================
    // Update expanded sections when sections change
    // ===============================================
    useEffect(() => {
        const allSections = new Set<number>();
        if (sections && sections.length > 0) {
            sections.forEach((_, index) => {
                allSections.add(index);
            });
        }
        setExpandedSections(allSections);
    }, [sections]);

    const toggleSection = (sectionIndex: number) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionIndex)) {
                newSet.delete(sectionIndex);
            } else {
                newSet.add(sectionIndex);
            }
            return newSet;
        });
    };

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

            <aside className={`sidebar fixed inset-y-0 left-0 flex flex-col overflow-x-hidden transition-all duration-200 -translate-x-full 
                bg-white border-r border-gray-100 z-30 ${open && 'translate-x-0'} max-w-66 w-66 xl:translate-x-0`}>

                <div className="flex items-center justify-between px-5 pb-2 pt-5">

                    <Link href={root} className="block" onClick={handleLinkClick}>
                        <Image src={LOGO.logo_1} alt="Logo" width={90} height={40} />
                    </Link>

                    <Button size='sm' onPress={() => setOpen(false)} isIconOnly className='bg-white border-none xl:hidden rounded-full'>
                        <XMarkIcon className='size-4 text-black' />
                    </Button>

                </div>

                <div className="flex flex-col flex-1 overflow-y-auto">

                    <div className="px-5 mb-4 py-3">

                        {/*  ================= LINKS ================= */}
                        {sections.map((section, sectionIndex) => {

                            const isExpanded = expandedSections.has(sectionIndex);

                            const filteredLinks = filterLinksByPermissions(section.links, permissions);
                            if (filteredLinks.length === 0) return null;

                            return (
                                <div key={sectionIndex} className="flex-1 pt-2">
                                    <button onClick={() => toggleSection(sectionIndex)}
                                        className="flex items-center gap-x-3 w-full hover:opacity-70 transition-opacity cursor-pointer">
                                        <h6 className='text-sm text-black font-medium'>{section.title}</h6>
                                        <div className="flex-1 h-px bg-gray-200 rounded-full" />
                                        {isExpanded ? (
                                            <ChevronUpIcon className='size-4 text-gray-600' />
                                        ) : (
                                            <ChevronDownIcon className='size-4 text-gray-600' />
                                        )}
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                            
                                        <div className="items-center block w-full h-auto grow basis-full pt-3">
                                            <ul className="flex flex-col pl-0 mb-0 list-none">
                                                {filteredLinks.map((link, linkIndex) => {
                                                    const isActive = link.href === root
                                                        ? pathname === root
                                                        : pathname === link.href || pathname.startsWith(link.href + '/')

                                                    return (
                                                        <li key={linkIndex} className="w-full">
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
                            )
                        })}

                    </div>

                    {/*  ================= LOGOUT ================= */}
                    <div className="px-5 py-2.5 w-full mt-auto border-t border-[#0B12211A]">

                        <Button fullWidth variant="light" className='flex items-center justify-start'>
                            <LogoutIcon className="text-[#0B1221]" />
                            <span className="text-sm text-text-color">Logout</span>
                        </Button>

                    </div>

                </div>

            </aside>

        </>
    )
}

export default SideBar