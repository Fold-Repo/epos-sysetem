import React from "react";
import { cn } from "@/lib";
import Link from "next/link";

export interface NavLinkProps {
    link: string;
    label: string;
    className?: string;
}

export interface LinkGroupProps {
    header: string;
    className?: string;
    children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ link, label, className }) => {
    return (
        <li>
            <Link
                href={link}
                className={cn(
                    "inline-block text-xs leading-loose font-[300] text-white/80 ",
                    className
                )}>
                {label}
            </Link>
        </li>
    );
};

export const LinkGroup: React.FC<LinkGroupProps> = ({ header, className, children }) => {
    return (
        <div className={cn("w-1/2 px-4 sm:w-1/2 lg:w-2/12", className)}>
            <div className="mb-5 w-full">
                <h4 className="mb-5 text-sm font-semibold text-white">
                    {header}
                </h4>
                <ul className="space-y-3">{children}</ul>
            </div>
        </div>
    );
};
