"use client";

import { NAV_CONSTANT } from "@/constants";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import React from "react";

interface MobileNavProps {
    setOpen: (open: boolean) => void;
    open: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ setOpen, open }) => {
    const pathname = usePathname();

    const onClose = () => setOpen(false);

    return (
        <div className={cn(
            "fixed inset-0 z-50 transition-all duration-300 ease-in-out md:hidden",
            open
                ? "opacity-100 pointer-events-auto translate-y-0"
                : "opacity-0 pointer-events-none -translate-y-2")}>

            {/*  ==== overlay ==== */}
            <div onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

            <div className="fixed top-4 right-4 w-full max-w-xs bg-white rounded-lg shadow-lg p-6 text-sm">

                <Button onPress={onClose} isIconOnly
                    className="absolute top-5 right-5 bg-transparent border-none">
                    <XMarkIcon className="text-black size-5" />
                </Button>

                {/* ==== Navigation links ===== */}
                <ul className="space-y-5 pt-10 text-gray-800 font-medium text-xs">
                    {NAV_CONSTANT.NAV_ITEMS.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "inline-block",
                                    pathname === item.href
                                        ? "text-primary font-semibold"
                                        : "hover:text-warning"
                                )}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-x-2 mt-5 pt-6 border-t border-slate-300">
                    {NAV_CONSTANT.NAV_BUTTONS.map((btn) =>
                        btn.variant === "link" ? (
                            <Button color="default" as={Link} key={btn.href} href={btn.href} variant='light' className='w-full text-black text-xs font-medium'>
                                Log in
                            </Button>
                        ) : (
                            <Button key={btn.href} as={Link} href={btn.href} onPress={onClose}
                                variant={btn.variant} radius={btn.radius} className="w-full bg-yellow text-white">
                                {btn.label}
                            </Button>
                        )
                    )}
                </div>

            </div>

        </div>
    );
};

export default MobileNav;

