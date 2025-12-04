"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Container from "../Container";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { Button } from "../ui";
import { NAV_CONSTANT } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import MobileNav from "./MobileNav";

const Navbar = () => {

    const [open, setOpen] = useState(false)
    const pathname = usePathname();

    return (
        <>

        <header className="py-4 z-10 bg-primary">
            <Container>
                <nav className="flex items-center justify-between">

                    <Link href="/">
                        <Image
                            src={NAV_CONSTANT.LOGOS.light}
                            className="w-24"
                            width={119}
                            height={52}
                            alt="E-POS Logo"
                        />
                    </Link>

                    <div className="hidden md:flex gap-x-10 lg:gap-x-16 text-sm text-white font-medium">
                        {NAV_CONSTANT.NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "inline-block transition-colors",
                                    pathname === item.href
                                        ? "text-yellow font-semibold" 
                                        : "text-white hover:text-warning"
                                )}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                <div className="flex items-center gap-x-4 lg:gap-x-3 xl:gap-x-4 shrink-0">
                    {NAV_CONSTANT.NAV_BUTTONS.map((btn) =>
                        btn.variant === "link" ? (
                            <Link
                                key={btn.href}
                                href={btn.href}
                                className="hidden md:block text-sm font-medium text-white">
                                {btn.label}
                            </Link>
                        ) : (
                            <div key={btn.href} className="hidden md:block">
                                <Button
                                    className="px-6 bg-yellow text-white"
                                    radius={btn.radius}
                                    as={Link}
                                    href={btn.href}
                                    variant={btn.variant}>
                                    {btn.label}
                                </Button>
                            </div>
                        )
                    )}

                    <div className="-mr-1 md:hidden relative z-20">
                        <Button
                            onPress={() => setOpen(true)}
                            isIconOnly
                            size="sm"
                            className="bg-transparent border-none">
                            <Bars3Icon className="text-white size-5" />
                        </Button>
                    </div>

                </div>

            </nav>

        </Container>

        </header >

        <MobileNav open={open} setOpen={setOpen} />

        </>
    );
};

export default Navbar;

