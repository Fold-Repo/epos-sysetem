import { QuotationType } from '@/types';

export const quotationsData: QuotationType[] = [
    {
        id: '1',
        reference: 'QT-2024-001',
        customer: 'John Doe',
        customerId: '1',
        status: 'Sent',
        grandTotal: 129.99,
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        reference: 'QT-2024-002',
        customer: 'Jane Smith',
        customerId: '2',
        status: 'Draft',
        grandTotal: 245.50,
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        reference: 'QT-2024-003',
        customer: 'ABC Corporation',
        customerId: '3',
        status: 'Approved',
        grandTotal: 1899.99,
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        reference: 'QT-2024-004',
        customer: 'XYZ Company',
        customerId: '4',
        status: 'Sent',
        grandTotal: 89.50,
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        reference: 'QT-2024-005',
        customer: 'Tech Solutions Ltd',
        customerId: '5',
        status: 'Rejected',
        grandTotal: 450.00,
        created_at: new Date('2024-02-15')
    }
];

