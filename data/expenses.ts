import { ExpenseType } from '@/types';

export const expensesData: ExpenseType[] = [
    {
        id: '1',
        reference: 'EXP-2024-001',
        user: 'John Smith',
        userId: '1',
        expenseTitle: 'Office Supplies Purchase',
        expenseCategory: 'Office Supplies',
        expenseCategoryId: '1',
        amount: 250.00,
        created_at: new Date('2024-01-15')
    },
    {
        id: '2',
        reference: 'EXP-2024-002',
        user: 'Jane Doe',
        userId: '2',
        expenseTitle: 'Electricity Bill',
        expenseCategory: 'Utilities',
        expenseCategoryId: '2',
        amount: 450.50,
        created_at: new Date('2024-01-20')
    },
    {
        id: '3',
        reference: 'EXP-2024-003',
        user: 'Mike Johnson',
        userId: '3',
        expenseTitle: 'Business Travel',
        expenseCategory: 'Travel',
        expenseCategoryId: '3',
        amount: 1200.00,
        created_at: new Date('2024-02-01')
    },
    {
        id: '4',
        reference: 'EXP-2024-004',
        user: 'Sarah Williams',
        userId: '4',
        expenseTitle: 'Marketing Campaign',
        expenseCategory: 'Marketing',
        expenseCategoryId: '4',
        amount: 3500.75,
        created_at: new Date('2024-02-10')
    },
    {
        id: '5',
        reference: 'EXP-2024-005',
        user: 'David Brown',
        userId: '5',
        expenseTitle: 'Equipment Maintenance',
        expenseCategory: 'Maintenance',
        expenseCategoryId: '5',
        amount: 850.00,
        created_at: new Date('2024-02-15')
    }
];

