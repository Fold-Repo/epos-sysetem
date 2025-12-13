import { UserType } from '@/types';

export const usersData: UserType[] = [
    { 
        id: '1', 
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'Admin',
        phone: '+1-555-0101',
        stores: ['1', '2'],
        storeNames: ['Main Store', 'Warehouse A'],
        created_at: new Date('2024-01-15')
    },
    { 
        id: '2', 
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'Manager',
        phone: '+1-555-0102',
        stores: ['1'],
        storeNames: ['Main Store'],
        created_at: new Date('2024-01-20')
    },
    { 
        id: '3', 
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'Cashier',
        phone: '+1-555-0103',
        stores: ['3', '4'],
        storeNames: ['Warehouse B', 'Branch Store 1'],
        created_at: new Date('2024-02-01')
    },
    { 
        id: '4', 
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        role: 'Manager',
        phone: '+1-555-0104',
        stores: ['2', '5'],
        storeNames: ['Warehouse A', 'Branch Store 2'],
        created_at: new Date('2024-02-10')
    },
    { 
        id: '5', 
        name: 'David Brown',
        email: 'david.brown@example.com',
        role: 'Cashier',
        phone: '+1-555-0105',
        stores: ['1', '3'],
        storeNames: ['Main Store', 'Warehouse B'],
        created_at: new Date('2024-02-15')
    },
];

