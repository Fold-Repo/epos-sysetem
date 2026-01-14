import { PaginationResponse } from './type';

/**
 * Category from API
 */
export interface Category {
    category_id: number;
    category_name: string;
    user_id: number;
    image?: string;
    productCount?: number;
    created_at?: string;
    last_modified?: string;
    status?: 'active' | 'inactive';
}

// PaginationResponse is now exported from ./type.ts

/**
 * Categories list response from API
 */
export interface CategoriesListResponse {
    status: number;
    data: Category[];
    pagination: PaginationResponse;
}

/**
 * Create/Update category payload
 */
export interface CreateCategoryPayload {
    category_name: string;
    description?: string;
    image?: string;
}

/**
 * Create category response
 */
export interface CreateCategoryResponse {
    status: number;
    data: Category;
}

/**
 * Update category response
 */
export interface UpdateCategoryResponse {
    status: number;
    data: Category;
}

/**
 * Delete category response
 */
export interface DeleteCategoryResponse {
    status: number;
    message: string;
}

// ==============================
// Legacy types (for backward compatibility)
// ==============================

/**
 * Product Category type definition (legacy)
 */
export interface ProductCategoryType {
    id: string;
    name: string;
    image?: string;
    productCount: number;
    created_at: string | Date;
    last_modified: string | Date;
    status: 'active' | 'inactive';
}
