import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { DashboardLink } from '@/constants';

interface SidebarLinkProps {
    link: DashboardLink;
    isActive?: boolean;
    onClick?: () => void;
    root: string;
    pathname: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ link, isActive, onClick, root, pathname }) => {
    const hasChildren = link.children && link.children.length > 0;
    
    // Check if any child link is active
    const hasActiveChild = hasChildren && link.children?.some(childLink => 
        pathname === childLink.href || pathname.startsWith(childLink.href + '/')
    );
    
    const [isExpanded, setIsExpanded] = useState(hasActiveChild || false);
    
    // Update expanded state when pathname changes
    useEffect(() => {
        if (hasActiveChild) {
            setIsExpanded(true);
        }
    }, [pathname, hasActiveChild]);

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        } else {
            if (onClick) {
                onClick();
            }
        }
    };

    const isLinkActive = link.href === root
        ? pathname === root
        : pathname === link.href || pathname.startsWith(link.href + '/')

    return (
        <div className="w-full">
            <Link href={hasChildren ? '#' : link.href} 
                className={`text-xs my-0 flex items-center whitespace-nowrap rounded-lg text-dark cursor-pointer
                    transition-all mb-0.5 gap-x-2 py-2.5 px-3 
                    ${isLinkActive || isActive ? 'bg-primary text-white mt-1' : ''}`}
                onClick={handleClick}>
                <div className="shink-0">
                    {link.icon}
                </div>
                <span className="duration-300 pointer-events-none flex-1">
                    {link.text}
                </span>
                {hasChildren && (
                    <div className="shink-0">
                        {isExpanded ? (
                            <ChevronDownIcon className='size-3.5' />
                        ) : (
                            <ChevronRightIcon className='size-3.5' />
                        )}
                    </div>
                )}
            </Link>

            {hasChildren && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="ml-4 mt-1 mb-2 border-l border-gray-200 pl-1">
                        <ul className="flex flex-col pl-0 mb-0 list-none">
                            {link.children?.map((childLink, index) => {
                                const isChildActive = pathname === childLink.href || pathname.startsWith(childLink.href + '/')
                                return (
                                    <li key={index} className="w-full">
                                        <Link href={childLink.href}
                                            className={`text-xs my-0 flex items-center whitespace-nowrap cursor-pointer rounded-lg text-dark
                                                transition-all mb-0.5 gap-x-2 py-2 px-3 
                                                ${isChildActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-primary'}`}
                                            onClick={onClick}>
                                            <div className="shink-0">
                                                {childLink.icon}
                                            </div>
                                            <span className="duration-300 pointer-events-none">
                                                {childLink.text}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
};

export default SidebarLink
