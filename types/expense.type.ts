export interface ExpenseType {
    id?: string | number;
    reference?: string;
    user?: string;
    userId?: string;
    expenseTitle?: string;
    expenseCategory?: string;
    expenseCategoryId?: string;
    amount?: number;
    created_at?: string | Date;
}

