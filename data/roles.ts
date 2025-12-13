import { RoleType } from '@/types';

export const rolesData: RoleType[] = [
    {
        id: '1',
        name: 'Admin',
        description: 'Full system access with all permissions',
        userCount: 3,
        permissionsCount: 45,
        status: 'active',
        created_at: new Date('2024-01-01')
    },
    {
        id: '2',
        name: 'Manager',
        description: 'Manage inventory, sales, and reports',
        userCount: 5,
        permissionsCount: 32,
        status: 'active',
        created_at: new Date('2024-01-05')
    },
    {
        id: '3',
        name: 'Cashier',
        description: 'Process sales and handle transactions',
        userCount: 8,
        permissionsCount: 15,
        status: 'active',
        created_at: new Date('2024-01-10')
    },
    {
        id: '4',
        name: 'Warehouse Staff',
        description: 'Manage inventory and stock movements',
        userCount: 4,
        permissionsCount: 20,
        status: 'active',
        created_at: new Date('2024-01-15')
    },
    {
        id: '5',
        name: 'Viewer',
        description: 'Read-only access to reports and data',
        userCount: 2,
        permissionsCount: 8,
        status: 'inactive',
        created_at: new Date('2024-01-20')
    },
];

