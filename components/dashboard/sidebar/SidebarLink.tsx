import React from 'react'
import Link from 'next/link';

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    text: string;
    isActive?: boolean;
    onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, isActive, onClick }) => {

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link href={href} className={`text-xs my-0 flex items-center whitespace-nowrap rounded-xl text-[#0B1221] transition-all mb-1 gap-x-2 py-2 px-4 
            ${isActive ? 'bg-white font-medium text-secondary shadow-[0px_0px_0px_1px_#653424,0px_0px_0px_3px_#6534244D]' : ''}`} onClick={handleClick}>

            {icon}

            <span className="duration-300 opacity-100 pointer-events-none text-xs">
                {text}
            </span>

        </Link>
    )
};

export default SidebarLink