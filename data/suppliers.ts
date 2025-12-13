import { SupplierType } from '@/types';

export const suppliersData: SupplierType[] = [
    { 
        id: '1', 
        name: 'ABC Suppliers Inc.',
        email: 'contact@abcsuppliers.com',
        phone: '+1-555-0101',
        country: 'United States',
        city: 'New York',
        address: '123 Business St, NY 10001',
        contactPerson: 'John Doe',
        created_at: new Date('2024-01-15')
    },
    { 
        id: '2', 
        name: 'XYZ Trading Company',
        email: 'info@xyztrading.com',
        phone: '+1-555-0102',
        country: 'United States',
        city: 'Los Angeles',
        address: '456 Commerce Ave, CA 90001',
        contactPerson: 'Jane Smith',
        created_at: new Date('2024-01-20')
    },
    { 
        id: '3', 
        name: 'Global Supply Chain Ltd',
        email: 'sales@globalsupply.com',
        phone: '+44-20-7946-0958',
        country: 'United Kingdom',
        city: 'London',
        address: '789 Trade Road, London SW1A 1AA',
        contactPerson: 'Mike Johnson',
        created_at: new Date('2024-02-01')
    },
    { 
        id: '4', 
        name: 'Premium Goods Distributors',
        email: 'contact@premiumgoods.com',
        phone: '+1-555-0104',
        country: 'Canada',
        city: 'Toronto',
        address: '321 Distribution Blvd, ON M5H 2N2',
        contactPerson: 'Sarah Williams',
        created_at: new Date('2024-02-10')
    },
    { 
        id: '5', 
        name: 'Wholesale Merchants Co.',
        email: 'info@wholesalemerchants.com',
        phone: '+1-555-0105',
        country: 'United States',
        city: 'Chicago',
        address: '654 Wholesale Way, IL 60601',
        contactPerson: 'David Brown',
        created_at: new Date('2024-02-15')
    },
];

