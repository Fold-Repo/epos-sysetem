import { PaginationResponse } from './type';

/**
 * Variation option from API
 */
export interface VariationOption {
    id: number;
    type_id: number;
    option: string;
    created_at: string;
    updated_at: string;
}

/**
 * Variation from API
 */
export interface Variation {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    options: VariationOption[];
}

// PaginationResponse is now exported from ./type.ts

/**
 * Variations list response from API
 */
export interface VariationsListResponse {
    status: number;
    data: Variation[];
    pagination: PaginationResponse;
}

/**
 * Create/Update variation payload
 */
export interface CreateVariationPayload {
    name: string;
    options: string[];
}

/**
 * Create variation response
 */
export interface CreateVariationResponse {
    status: number;
    data: Variation;
}

/**
 * Update variation response
 */
export interface UpdateVariationResponse {
    status: number;
    data: Variation;
}

/**
 * Delete variation response
 */
export interface DeleteVariationResponse {
    status: number;
    data: {
        message: string;
    };
}

// ==============================
// Legacy types (for backward compatibility)
// ==============================

/**
 * Variation type item - can be a simple string or an object with name and color code
 */
export type VariationTypeItem = string | {
    name: string;
    color?: string; // Hex color code (e.g., "#FF0000")
}

/**
 * Product Variation type definition (legacy)
 */
export interface ProductVariationType {
    id: string;
    name: string;
    type: 'Color' | 'Size' | 'Other';
    variationTypes: VariationTypeItem[];
    created_at: string | Date;
    last_modified: string | Date;
}
