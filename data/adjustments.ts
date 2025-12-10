import { AdjustmentType } from '@/types';

export const adjustmentsData: AdjustmentType[] = [
    {
        id: '1',
        reference: 'ADJ-2024-001',
        totalProducts: 2,
        items: [
            {
                productId: '1',
                quantity: 1,
                type: 'addition'
            },
            {
                productId: '2',
                quantity: 1,
                type: 'subtraction'
            }
        ],
        created_at: new Date('2024-01-15'),
        date: '2024-01-15'
    },
    {
        id: '2',
        reference: 'ADJ-2024-002',
        totalProducts: 1,
        items: [
            {
                productId: '3',
                quantity: 1,
                type: 'subtraction'
            }
        ],
        created_at: new Date('2024-01-14'),
        date: '2024-01-14'
    }
];

