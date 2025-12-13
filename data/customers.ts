import { CustomerType } from '@/types';

export const customersData: CustomerType[] = [
    { 
        id: '1', 
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        country: 'United States',
        city: 'New York',
        address: '123 Main St, NY 10001',
        created_at: new Date('2024-01-15')
    },
    { 
        id: '2', 
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0102',
        country: 'United States',
        city: 'Los Angeles',
        address: '456 Oak Ave, CA 90001',
        created_at: new Date('2024-01-20')
    },
    { 
        id: '3', 
        name: 'ABC Corporation',
        email: 'contact@abccorp.com',
        phone: '+1-555-0103',
        country: 'United States',
        city: 'Chicago',
        address: '789 Business Blvd, IL 60601',
        created_at: new Date('2024-02-01')
    },
    { 
        id: '4', 
        name: 'XYZ Company',
        email: 'info@xyzcompany.com',
        phone: '+44-20-7946-0958',
        country: 'United Kingdom',
        city: 'London',
        address: '321 Trade Road, London SW1A 1AA',
        created_at: new Date('2024-02-10')
    },
    { 
        id: '5', 
        name: 'Tech Solutions Ltd',
        email: 'sales@techsolutions.com',
        phone: '+1-555-0105',
        country: 'Canada',
        city: 'Toronto',
        address: '654 Tech Street, ON M5H 2N2',
        created_at: new Date('2024-02-15')
    },
];

