import { NavItemType, NavButtonType, LogoVariantsType } from "@/types";

export const NAV_ITEMS: NavItemType[] = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
];

export const NAV_BUTTONS: NavButtonType[] = [
    {
        label: "Log in",
        href: "/signin",
        variant: "link",
        showOnMobile: false,
    },
    {
        label: "Get Started",
        href: "/signup",
        variant: "solid",
        radius: "full",
        showOnMobile: false,
    },
];

export const LOGOS: LogoVariantsType = {
    light: "/logo/logo_1.svg",
    dark: "/logo/logo_2.svg",
};

export const NAV_CONSTANT = {
    NAV_ITEMS,
    NAV_BUTTONS,
    LOGOS,
};

