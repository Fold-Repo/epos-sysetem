import { PurchaseType } from '@/types';

export const purchasesData: PurchaseType[] = [
    {
        id: '1',
        reference: 'PUR-2024-001',
        supplier: 'ABC Suppliers Inc.',
        supplierId: '1',
        status: 'received',
        paymentStatus: 'paid',
        paymentMethod: 'Bank Transfer',
        grandTotal: 2500.00,
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        reference: 'PUR-2024-002',
        supplier: 'XYZ Trading Company',
        supplierId: '2',
        status: 'pending',
        paymentStatus: 'unpaid',
        grandTotal: 1800.50,
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        reference: 'PUR-2024-003',
        supplier: 'Global Supply Chain Ltd',
        supplierId: '3',
        status: 'orders',
        paymentStatus: 'partial',
        paymentMethod: 'Cash',
        paymentAmount: 1000.00,
        grandTotal: 2100.00,
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        reference: 'PUR-2024-004',
        supplier: 'Premium Goods Distributors',
        supplierId: '4',
        status: 'received',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        grandTotal: 3200.75,
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        reference: 'PUR-2024-005',
        supplier: 'Wholesale Merchants Co.',
        supplierId: '5',
        status: 'pending',
        paymentStatus: 'partial',
        paymentMethod: 'Bank Transfer',
        paymentAmount: 500.00,
        grandTotal: 1500.00,
        created_at: new Date('2024-02-15')
    }
];

