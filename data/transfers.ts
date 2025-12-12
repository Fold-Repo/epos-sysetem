import { TransferType } from '@/types';

export const transfersData: TransferType[] = [
    {
        id: '1',
        reference: 'TRF-2024-001',
        fromStore: 'Main Store',
        toStore: 'Warehouse A',
        items: 5,
        grandTotal: 1250.00,
        status: 'Sent',
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        reference: 'TRF-2024-002',
        fromStore: 'Warehouse A',
        toStore: 'Main Store',
        items: 3,
        grandTotal: 850.50,
        status: 'Approved',
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        reference: 'TRF-2024-003',
        fromStore: 'Main Store',
        toStore: 'Warehouse B',
        items: 8,
        grandTotal: 2100.00,
        status: 'Draft',
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        reference: 'TRF-2024-004',
        fromStore: 'Warehouse B',
        toStore: 'Main Store',
        items: 2,
        grandTotal: 450.75,
        status: 'Rejected',
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        reference: 'TRF-2024-005',
        fromStore: 'Main Store',
        toStore: 'Warehouse A',
        items: 6,
        grandTotal: 1800.25,
        status: 'Sent',
        created_at: new Date('2024-02-15')
    }
];

