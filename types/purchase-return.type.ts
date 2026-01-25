// ================================
// PURCHASE RETURN TYPES
// ================================

// ================================
// PURCHASE RETURN ITEM (API)
// ================================
export interface PurchaseReturnItem {
    purchase_return_item_id?: number;
    product_id: number;
    product_name: string;
    product_sku: string;
    product_price?: number;
    product_cost?: number;
    variation_id: number | null;
    variation_type: string | null;
    variation_value: string | null;
    variation_sku: string | null;
    variation_price?: number | null;
    variation_cost?: number | null;
    quantity: number;
    unit_cost: number;
}

// ================================
// PURCHASE RETURN (API LIST ITEM)
// ================================
export interface PurchaseReturnListItem {
    purchase_return_id: number;
    purchase_id: number;
    purchase_reference: string;
    store_id: number;
    store_name: string;
    supplier_name: string;
    total_deducted: number;
    reason: string;
    user_id: number;
    user_name: string;
    items: PurchaseReturnItem[];
    created_at: string;
}

// ================================
// PURCHASE RETURN (API DETAIL)
// ================================
export interface PurchaseReturnDetail {
    purchase_return_id: number;
    purchase_id: number;
    purchase_reference: string;
    store_id: number;
    store_name: string;
    supplier_name: string;
    total_deducted: number;
    reason: string;
    user_id: number;
    user_name: string;
    items: PurchaseReturnItem[];
    created_at: string;
}

// ================================
// PURCHASE RETURN TYPE (UI)
// ================================
export interface PurchaseReturnType {
    id?: string | number;
    purchase_id?: number;
    purchase_reference?: string;
    store_name?: string;
    supplier_name?: string;
    total_deducted?: number;
    reason?: string;
    user_name?: string;
    created_at?: string | Date;
}

// ================================
// PURCHASE RETURN ITEM FORM DATA
// ================================
export interface PurchaseReturnItemFormData {
    product_id: number;
    quantity: number;
    variation_id?: number;
}

// ================================
// CREATE PURCHASE RETURN PAYLOAD
// ================================
export interface CreatePurchaseReturnPayload {
    purchase_id: number;
    reason: string;
    store_id: number;
    items: Array<{
        product_id: number;
        quantity: number;
        variation_id?: number;
    }>;
}

// ================================
// CREATE PURCHASE RETURN RESPONSE
// ================================
export interface CreatePurchaseReturnResponse {
    status: number;
    message: string;
    data: {
        purchase_return_id: number;
        total_deducted: number;
    };
}

// ================================
// PURCHASE RETURNS LIST RESPONSE
// ================================
export interface PurchaseReturnsListResponse {
    status: number;
    data: PurchaseReturnListItem[];
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
// SINGLE PURCHASE RETURN RESPONSE
// ================================
export interface SinglePurchaseReturnResponse {
    status: number;
    data: PurchaseReturnDetail;
}

// ================================
// PURCHASE RETURN QUERY PARAMS
// ================================
export interface PurchaseReturnQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    store_id?: number;
    startDate?: string;
    endDate?: string;
    sort?: string;
}
