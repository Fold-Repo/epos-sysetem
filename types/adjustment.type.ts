// ================================
// ADJUSTMENT ITEM (FORM DATA)
// ================================
export interface AdjustmentItemFormData {
    product_id: number;
    variation_id?: number;
    quantity: number;
    type: 'positive' | 'negative';
}

// ================================
// CREATE ADJUSTMENT PAYLOAD
// ================================
export interface CreateAdjustmentPayload {
    date: string;
    note?: string;
    items: AdjustmentItemFormData[];
}

// ================================
// CREATE ADJUSTMENT RESPONSE
// ================================
export interface CreateAdjustmentResponse {
    status: number;
    message: string;
    data: null;
}

// ================================
// CREATE ADJUSTMENT FORM DATA
// ================================
export interface CreateAdjustmentFormData {
    date: string;
    note?: string;
    items: AdjustmentItemFormData[];
}

// ================================
// ADJUSTMENT LIST ITEM (API RESPONSE)
// ================================
export interface AdjustmentListItem {
    adjustment_id: number;
    date: string;
    type: 'positive' | 'negative';
    note?: string;
    business_id: number;
    created_by: number;
    created_at: string;
    created_by_name?: string;
}

// ================================
// ADJUSTMENTS LIST RESPONSE
// ================================
export interface AdjustmentsListResponse {
    status: number;
    data: AdjustmentListItem[];
    pagination: {
        page: number | string;
        limit: number | string;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ================================
// ADJUSTMENT TYPE (UI)
// ================================
export interface AdjustmentType {
    id?: string | number;
    date?: string;
    type?: 'positive' | 'negative';
    note?: string;
    created_at?: string;
    created_by_name?: string;
}

// ================================
// ADJUSTMENT DETAIL ITEM
// ================================
export interface AdjustmentDetailItem {
    item_id: number;
    product_id: number;
    variation_id?: number;
    quantity: number;
    item_type: 'positive' | 'negative';
    product_name: string;
    product_sku: string;
    product_type: 'Simple' | 'Variation';
    variation_type?: string;
    variation_value?: string;
    variation_sku?: string;
}

// ================================
// ADJUSTMENT DETAIL RESPONSE
// ================================
export interface AdjustmentDetailResponse {
    adjustment_id: number;
    date: string;
    type: 'positive' | 'negative';
    note?: string;
    business_id: number;
    created_by: number;
    created_at: string;
    created_by_name?: string;
    items: AdjustmentDetailItem[];
}

// ================================
// ADJUSTMENT DETAIL API RESPONSE
// ================================
export interface AdjustmentDetailApiResponse {
    status: number;
    data: AdjustmentDetailResponse;
}

// ================================
// ADJUSTMENT QUERY PARAMS
// ================================
export interface AdjustmentQueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
}
