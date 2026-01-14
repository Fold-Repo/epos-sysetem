// ================================
// CUSTOMER TYPE (UI)
// ================================
export interface CustomerType {
    id?: string | number;
    customer_id?: number;
    name: string;
    email?: string;
    phone?: string;
    phonenumber?: string;
    country?: string;
    city?: string;
    address?: string;
    created_by?: number;
    created_by_name?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
}

// ================================
// CUSTOMER LIST ITEM (API RESPONSE)
// ================================
export interface CustomerListItem {
    customer_id: number;
    name: string;
    email: string | null;
    phonenumber: string | null;
    country: string | null;
    city: string | null;
    address: string | null;
    business_id: number;
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
}

// ================================
// CUSTOMERS LIST RESPONSE
// ================================
export interface CustomersListResponse {
    status: number;
    data: CustomerListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ================================
// CREATE CUSTOMER PAYLOAD
// ================================
export interface CreateCustomerPayload {
    name: string;
    email?: string;
    phonenumber?: string;
    country?: string;
    city?: string;
    address?: string;
}

// ================================
// CREATE CUSTOMER RESPONSE
// ================================
export interface CreateCustomerResponse {
    status: number;
    data: CustomerListItem;
}

// ================================
// CUSTOMER QUERY PARAMS
// ================================
export interface CustomerQueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
}
