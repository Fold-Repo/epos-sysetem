import React from 'react';
import {
    HomeIcon,
    BuildingStorefrontIcon,
    CubeIcon,
    DocumentTextIcon,
    TruckIcon,
    UsersIcon,
    ChartBarIcon,
    KeyIcon,
    DocumentDuplicateIcon,
    ChartPieIcon,
    TagIcon,
    BanknotesIcon,
    CurrencyDollarIcon,
    ReceiptRefundIcon,
    Cog6ToothIcon,
    LanguageIcon,
    ComputerDesktopIcon,
    AdjustmentsVerticalIcon,
} from '@heroicons/react/24/outline';
import { PermissionKey } from '@/types/permissions';

// Dashboard root paths
export const DASHBOARD_ROOT = '/dashboard';
export const SALES_DASHBOARD_ROOT = '/sales/dashboard';

export interface DashboardLink {
    href: string;
    icon: React.ReactNode;
    text: string;
    permissionKey?: string;
}

export interface DashboardSection {
    title: string;
    links: DashboardLink[];
}


export const getDashboardSections = (root: string): DashboardSection[] => [
    {
        title: 'Main',
        links: [
            {
                href: root,
                icon: <HomeIcon className='size-5' />,
                text: 'Dashboard',
                permissionKey: PermissionKey.MANAGE_DASHBOARD
            },
            {
                href: `${root}/stores`,
                icon: <BuildingStorefrontIcon className='size-5' />,
                text: 'Stores',
                permissionKey: PermissionKey.MANAGE_STORES
            },
        ],
    },
    {
        title: 'Inventory',
        links: [
            {
                href: `${root}/products`,
                icon: <CubeIcon className='size-5' />,
                text: 'Products',
                permissionKey: PermissionKey.MANAGE_PRODUCTS
            },
            {
                href: `${root}/adjustments`,
                icon: <AdjustmentsVerticalIcon className='size-5' />,
                text: 'Adjustments',
                permissionKey: PermissionKey.MANAGE_ADJUSTMENTS
            },
            {
                href: `${root}/transfers`,
                icon: <TruckIcon className='size-5' />,
                text: 'Transfers',
                permissionKey: PermissionKey.MANAGE_TRANSFERS
            },
        ],
    },
    {
        title: 'Sales & Orders',
        links: [
            {
                href: `${root}/sales`,
                icon: <ChartPieIcon className='size-5' />,
                text: 'Sales',
                permissionKey: PermissionKey.MANAGE_SALES
            },
            {
                href: `${root}/purchases`,
                icon: <TagIcon className='size-5' />,
                text: 'Purchases',
                permissionKey: PermissionKey.MANAGE_PURCHASES
            },
            {
                href: `${root}/quotations`,
                icon: <DocumentTextIcon className='size-5' />,
                text: 'Quotations',
                permissionKey: PermissionKey.MANAGE_QUOTATIONS
            },
        ],
    },
    {
        title: 'Financial',
        links: [
            {
                href: `${root}/payment-methods`,
                icon: <BanknotesIcon className='size-5' />,
                text: 'Payment Methods',
                permissionKey: PermissionKey.MANAGE_PAYMENT_METHODS
            },
            {
                href: `${root}/currencies`,
                icon: <CurrencyDollarIcon className='size-5' />,
                text: 'Currencies',
                permissionKey: PermissionKey.MANAGE_CURRENCY
            },
            {
                href: `${root}/expenses`,
                icon: <ReceiptRefundIcon className='size-5' />,
                text: 'Expenses',
                permissionKey: PermissionKey.MANAGE_EXPENSES
            },
        ],
    },
    {
        title: 'People & Access',
        links: [
            {
                href: `${root}/people`,
                icon: <UsersIcon className='size-5' />,
                text: 'People',
                permissionKey: PermissionKey.MANAGE_USERS
            },
            {
                href: `${root}/roles-permissions`,
                icon: <KeyIcon className='size-5' />,
                text: 'Roles/Permissions',
                permissionKey: PermissionKey.MANAGE_ROLES_PERMISSIONS
            },
        ],
    },
    {
        title: 'Reports & Analytics',
        links: [
            {
                href: `${root}/reports`,
                icon: <ChartBarIcon className='size-5' />,
                text: 'Reports',
                permissionKey: PermissionKey.MANAGE_REPORTS
            },
        ],
    },
    {
        title: 'Settings',
        links: [
            {
                href: `${root}/settings`,
                icon: <Cog6ToothIcon className='size-5' />,
                text: 'Settings',
                permissionKey: PermissionKey.MANAGE_SETTINGS
            }
            // {
            //     href: `${root}/templates`,
            //     icon: <DocumentDuplicateIcon className='size-5' />,
            //     text: 'Templates',
            //     permissionKey: PermissionKey.MANAGE_EMAIL_TEMPLATES
            // },
        ],
    },
];

export const DASHBOARD_SECTIONS: DashboardSection[] = getDashboardSections(DASHBOARD_ROOT);

// export const getSalesDashboardSections = (root: string): DashboardSection[] => [
//     {
//         title: 'Main',
//         links: [
//             {
//                 href: root,
//                 icon: <HomeIcon className='size-5' />,
//                 text: 'Dashboard',
//                 permissionKey: PermissionKey.MANAGE_DASHBOARD
//             },
//         ],
//     },
//     {
//         title: 'Sales',
//         links: [
//             {
//                 href: `${root}/sales`,
//                 icon: <ChartPieIcon className='size-5' />,
//                 text: 'Sales',
//                 permissionKey: PermissionKey.MANAGE_SALES
//             },
//             {
//                 href: `${root}/purchases`,
//                 icon: <TagIcon className='size-5' />,
//                 text: 'Purchases',
//                 permissionKey: PermissionKey.MANAGE_PURCHASES
//             },
//             {
//                 href: `${root}/payment-methods`,
//                 icon: <BanknotesIcon className='size-5' />,
//                 text: 'Payment Methods',
//                 permissionKey: PermissionKey.MANAGE_PAYMENT_METHODS
//             },
//             {
//                 href: `${root}/currencies`,
//                 icon: <CurrencyDollarIcon className='size-5' />,
//                 text: 'Currencies',
//                 permissionKey: PermissionKey.MANAGE_CURRENCY
//             },
//             {
//                 href: `${root}/expenses`,
//                 icon: <ReceiptRefundIcon className='size-5' />,
//                 text: 'Expenses',
//                 permissionKey: PermissionKey.MANAGE_EXPENSES
//             },
//         ],
//     },
//     {
//         title: 'Settings',
//         links: [
//             {
//                 href: `${root}/settings`,
//                 icon: <Cog6ToothIcon className='size-5' />,
//                 text: 'Settings',
//                 permissionKey: PermissionKey.MANAGE_SETTINGS
//             },
//         ],
//     },
// ];

// export const SALES_DASHBOARD_SECTIONS: DashboardSection[] = getSalesDashboardSections(SALES_DASHBOARD_ROOT);
