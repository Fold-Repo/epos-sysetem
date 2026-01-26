// ================================
// SALES RETURN TYPES
// ================================

// ================================
// SALES RETURN ITEM (API)
// ================================
export interface SaleReturnItem {
    sale_return_item_id?: number;
    product_id: number;
    product_name: string;
    product_sku: string;
    product_price?: number | null;
    product_cost?: number | null;
    variation_id: number | null;
    variation_type: string | null;
    variation_value: string | null;
    variation_sku: string | null;
    variation_price?: number | null;
    variation_cost?: number | null;
    quantity: number;
    price: number;
}

// ================================
// SALES RETURN (API LIST ITEM)
// ================================
export interface SaleReturnListItem {
    sale_return_id: number;
    sale_id: number;
    sale_reference: string;
    store_id: number;
    store_name: string;
    customer_name: string;
    total_refund: number;
    reason: string;
    user_id: number;
    user_name: string;
    items: SaleReturnItem[];
    created_at: string;
}

// ================================
// SALES RETURN (API DETAIL)
// ================================
export interface SaleReturnDetail {
    sale_return_id: number;
    sale_id: number;
    sale_reference: string;
    store_id: number;
    store_name: string;
    customer_name: string;
    total_refund: number;
    reason: string;
    user_id: number;
    user_name: string;
    items: SaleReturnItem[];
    created_at: string;
}

// ================================
// SALES RETURN TYPE (UI)
// ================================
export interface SaleReturnType {
    id?: string | number;
    sale_id?: number;
    sale_reference?: string;
    store_name?: string;
    customer_name?: string;
    total_refund?: number;
    reason?: string;
    user_name?: string;
    created_at?: string | Date;
}

// ================================
// SALES RETURN ITEM FORM DATA
// ================================
export interface SaleReturnItemFormData {
    product_id: number;
    quantity: number;
    variation_id?: number;
}

// ================================
// CREATE SALES RETURN PAYLOAD
// ================================
export interface CreateSaleReturnPayload {
    sale_id: number;
    reason: string;
    store_id: number;
    items: Array<{
        product_id: number;
        quantity: number;
        variation_id?: number;
    }>;
}

// ================================
// CREATE SALES RETURN RESPONSE
// ================================
export interface CreateSaleReturnResponse {
    status: number;
    message: string;
    data: {
        sale_return_id: number;
        total_refund: number;
        refund_id: number;
    };
}

// ================================
// SALES RETURNS LIST RESPONSE
// ================================
export interface SaleReturnsListResponse {
    status: number;
    data: SaleReturnListItem[];
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
// SINGLE SALES RETURN RESPONSE
// ================================
export interface SingleSaleReturnResponse {
    status: number;
    data: SaleReturnDetail;
}

// ================================
// SALES RETURN QUERY PARAMS
// ================================
export interface SaleReturnQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    store_id?: number;
    startDate?: string;
    endDate?: string;
    sort?: string;
}
