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
        <Link href={href} className={`text-xs my-0 flex items-center whitespace-nowrap rounded-lg text-dark 
            transition-all mb-0.5 gap-x-2 py-2.5 px-3 
            ${isActive ? 'bg-primary text-white mt-1' : ''}`}
            onClick={handleClick}>

            <div className="shink-0">
                {icon}
            </div>

            <span className="duration-300 pointer-events-none">
                {text}
            </span>

        </Link>
    )
};

export default SidebarLink