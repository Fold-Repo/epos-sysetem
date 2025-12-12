import { PaymentMethodType } from '@/types';

export const paymentMethodsData: PaymentMethodType[] = [
    {
        id: '1',
        name: 'Cash',
        status: 'active',
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        name: 'Bank Transfer',
        status: 'active',
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        name: 'Credit Card',
        status: 'active',
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        name: 'Debit Card',
        status: 'inactive',
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        name: 'Check',
        status: 'active',
        created_at: new Date('2024-02-15')
    }
];

