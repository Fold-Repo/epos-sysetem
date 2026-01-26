import { PaginationResponse } from './type';

/**
 * Expense from API (GET response)
 */
export interface Expense {
    expense_id: number;
    reference: string;
    user: string;
    user_firstname?: string;
    user_lastname?: string;
    title: string;
    expense_category: string;
    category_id: number;
    amount: number;
    created_on: string;
    expense_date: string;
    payment_method: string;
    vendor?: string;
    receipt_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    store_id: number;
    store_name?: string;
}

/**
 * Expense from API (POST response)
 */
export interface ExpenseDetail {
    expense_id: number;
    business_id: number;
    store_id: number;
    reference: string;
    title: string;
    category: string | null;
    description: string;
    amount: string;
    expense_date: string;
    payment_method: string;
    vendor: string;
    receipt_url: string;
    status: 'pending' | 'approved' | 'rejected';
    notes: string;
    created_by: number;
    approved_by: number | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
    category_id: number;
}

/**
 * Expenses list response from API
 */
export interface ExpensesListResponse {
    status: number;
    data: Expense[];
    pagination: PaginationResponse;
}

/**
 * Create expense payload
 */
export interface CreateExpensePayload {
    title: string;
    category_id: number;
    amount: number;
    expense_date: string;
    notes: string;
    payment_method: string;
    vendor: string;
    receipt_url?: string;
    store_id: number;
    status?: 'pending' | 'approved' | 'rejected';
}

/**
 * Create expense response
 */
export interface CreateExpenseResponse {
    status: number;
    message: string;
    data: ExpenseDetail;
}

/**
 * Update expense payload
 */
export interface UpdateExpensePayload {
    title?: string;
    category_id?: number;
    amount?: number;
    expense_date?: string;
    notes?: string;
    payment_method?: string;
    vendor?: string;
    receipt_url?: string;
    store_id?: number;
    status?: 'pending' | 'approved' | 'rejected';
}

/**
 * Update expense response
 */
export interface UpdateExpenseResponse {
    status: number;
    message: string;
    data: ExpenseDetail;
}

/**
 * Delete expense response
 */
export interface DeleteExpenseResponse {
    status: number;
    message: string;
}

// ==============================
// Legacy type (for backward compatibility)
// ==============================
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

