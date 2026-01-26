import { PaginationResponse } from './type';

/**
 * Expense Category from API
 */
export interface ExpenseCategory {
    id: number;
    business_id?: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Active Expense Category (simplified for dropdowns)
 */
export interface ActiveExpenseCategory {
    id: number;
    name: string;
}

/**
 * Expense Categories list response from API
 */
export interface ExpenseCategoriesListResponse {
    status: number;
    data: ExpenseCategory[];
    pagination: PaginationResponse;
}

/**
 * Create expense category payload
 */
export interface CreateExpenseCategoryPayload {
    name: string;
    description?: string;
    is_active: boolean;
}

/**
 * Create expense category response
 */
export interface CreateExpenseCategoryResponse {
    status: number;
    message: string;
    data: ExpenseCategory;
}

/**
 * Update expense category payload
 */
export interface UpdateExpenseCategoryPayload {
    name?: string;
    description?: string;
    is_active?: boolean;
}

/**
 * Update expense category response
 */
export interface UpdateExpenseCategoryResponse {
    status: number;
    message: string;
    data: {
        id: number;
        name: string;
        is_active: boolean;
    };
}

/**
 * Delete expense category response
 */
export interface DeleteExpenseCategoryResponse {
    status: number;
    message: string;
}

/**
 * Active expense categories response
 */
export interface ActiveExpenseCategoriesResponse {
    status: number;
    data: ActiveExpenseCategory[];
}

// ==============================
// Legacy type (for backward compatibility)
// ==============================
export interface ExpenseCategoryType {
    id?: string | number;
    name: string;
    created_at?: string | Date;
}

