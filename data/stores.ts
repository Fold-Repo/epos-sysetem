import { StoreType } from '@/types';

export const storesData: StoreType[] = [
    { id: '1', name: 'Main Store', status: 'active', created_at: new Date('2024-01-01') },
    { id: '2', name: 'Warehouse A', status: 'active', created_at: new Date('2024-01-05') },
    { id: '3', name: 'Warehouse B', status: 'active', created_at: new Date('2024-01-10') },
    { id: '4', name: 'Branch Store 1', status: 'inactive', created_at: new Date('2024-01-15') },
    { id: '5', name: 'Branch Store 2', status: 'active', created_at: new Date('2024-01-20') },
];

