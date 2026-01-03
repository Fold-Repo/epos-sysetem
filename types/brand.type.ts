/**
 * Brand from API
 */
export interface Brand {
    id: number;
    name: string;
    short_name: string;
    user_id: number;
    business_id: number;
    created_at: string;
    updated_at: string;
    productCount?: number;
    status?: 'active' | 'inactive';
}

/**
 * Brands list response from API
 */
export interface BrandsListResponse {
    status: number;
    data: Brand[];
}

/**
 * Create/Update brand payload
 */
export interface CreateBrandPayload {
    name: string;
    short_name: string;
}

/**
 * Create brand response
 */
export interface CreateBrandResponse {
    status: number;
    data: Brand;
}

/**
 * Update brand response
 */
export interface UpdateBrandResponse {
    status: number;
    data: Brand;
}

/**
 * Delete brand response
 */
export interface DeleteBrandResponse {
    status: number;
    message: string;
}

// ==============================
// Legacy types (for backward compatibility)
// ==============================

/**
 * Product Brand type definition (legacy)
 */
export interface ProductBrandType {
    id: string;
    name: string;
    image?: string;
    productCount: number;
    created_at: string | Date;
    last_modified: string | Date;
    status: 'active' | 'inactive';
}
