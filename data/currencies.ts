import { CurrencyType } from '@/types';

export const currenciesData: CurrencyType[] = [
    {
        id: '1',
        name: 'US Dollar',
        code: 'USD',
        symbol: '$',
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        name: 'British Pound',
        code: 'GBP',
        symbol: '£',
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        name: 'Euro',
        code: 'EUR',
        symbol: '€',
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        name: 'Nigerian Naira',
        code: 'NGN',
        symbol: '₦',
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        name: 'Japanese Yen',
        code: 'JPY',
        symbol: '¥',
        created_at: new Date('2024-02-15')
    }
];

