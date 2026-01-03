/**
 * Supplier from API
 */
export interface Supplier {
    supplier_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    business_id: number;
    created_at: string;
    updated_at: string;
}

/**
 * Suppliers list response from API
 */
export interface SuppliersListResponse {
    status: number;
    data: Supplier[];
}

/**
 * Create/Update supplier payload
 */
export interface CreateSupplierPayload {
    name: string;
    email: string;
    phone: string;
    address: string;
}

/**
 * Create supplier response
 */
export interface CreateSupplierResponse {
    status: number;
    data: Supplier;
}

/**
 * Update supplier response
 */
export interface UpdateSupplierResponse {
    status: number;
    data: Supplier;
}

/**
 * Delete supplier response
 */
export interface DeleteSupplierResponse {
    status: number;
    message: string;
}

// ==============================
// Legacy types (for backward compatibility)
// ==============================

export interface SupplierType {
    id?: string | number;
    name: string;
    email?: string;
    phone?: string;
    country?: string;
    city?: string;
    address?: string;
    contactPerson?: string;
    created_at?: string | Date;
}
