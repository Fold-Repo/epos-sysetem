import { SaleType } from '@/types';

export const salesData: SaleType[] = [
    {
        id: '1',
        reference: 'SAL-2024-001',
        user: 'John Smith',
        userId: '1',
        customer: 'John Doe',
        customerId: '1',
        status: 'completed',
        grandTotal: 1250.00,
        paid: 1250.00,
        due: 0.00,
        paymentStatus: 'paid',
        paymentType: 'Cash',
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        reference: 'SAL-2024-002',
        user: 'Jane Doe',
        userId: '2',
        customer: 'Jane Smith',
        customerId: '2',
        status: 'pending',
        grandTotal: 850.50,
        paid: 0.00,
        due: 850.50,
        paymentStatus: 'unpaid',
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        reference: 'SAL-2024-003',
        user: 'Mike Johnson',
        userId: '3',
        customer: 'ABC Corporation',
        customerId: '3',
        status: 'completed',
        grandTotal: 2100.00,
        paid: 1000.00,
        due: 1100.00,
        paymentStatus: 'partial',
        paymentType: 'Bank Transfer',
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        reference: 'SAL-2024-004',
        user: 'Sarah Williams',
        userId: '4',
        customer: 'XYZ Company',
        customerId: '4',
        status: 'completed',
        grandTotal: 3200.75,
        paid: 3200.75,
        due: 0.00,
        paymentStatus: 'paid',
        paymentType: 'Credit Card',
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        reference: 'SAL-2024-005',
        user: 'David Brown',
        userId: '5',
        customer: 'Tech Solutions Ltd',
        customerId: '5',
        status: 'cancelled',
        grandTotal: 1500.00,
        paid: 0.00,
        due: 1500.00,
        paymentStatus: 'unpaid',
        created_at: new Date('2024-02-15')
    }
];

