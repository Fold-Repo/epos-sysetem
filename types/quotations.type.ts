// ================================
// QUOTATION SUMMARY TYPES
// ================================
export interface QuotationSummaryMetric {
    count: number;
    last_month: number;
    percentage_change: number;
}

export interface QuotationSummaryResponse {
    status: number;
    data: {
        total_quotations: QuotationSummaryMetric;
        sent_quotations: QuotationSummaryMetric;
        approved_quotations: QuotationSummaryMetric;
        draft_quotations: QuotationSummaryMetric;
    };
}

// ================================
// QUOTATION TYPE (UI)
// ================================
export interface QuotationType {
    id?: string | number;
    reference?: string;
    customer_name?: string;
    store_name?: string;
    customerId?: string;
    status?: string;
    grandTotal?: number;
    created_at?: string | Date;
}

// ================================
// QUOTATION ITEM FORM DATA
// ================================
export interface QuotationItemFormData {
    product_id: number;
    quantity: number;
    net_unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    variation_id?: number;
    quotation_item_id?: string;
}

// ================================
// CREATE QUOTATION PAYLOAD
// ================================
export interface CreateQuotationPayload {
    store_id: number;
    customer_id: number;
    order_tax: number;
    order_discount: number;
    shipping: number;
    grand_total: number;
    status: string;
    note?: string;
    order_tax_type?: 'percent' | 'fixed';
    order_discount_type?: 'percent' | 'fixed';
    items: Array<{
        product_id: number;
        quantity: number;
        unit_price: number;
        tax: number;
        discount: number;
        subtotal: number;
        variation_id?: number;
        quotation_item_id?: string;
    }>;
}

// ================================
// CREATE QUOTATION RESPONSE
// ================================
export interface CreateQuotationResponse {
    status: number;
    data: {
        quotation_id: number;
        business_id: number;
        customer_id: number;
        order_tax: string;
        order_discount: string;
        shipping: string;
        grand_total: string;
        status: string;
        note?: string;
        reference: string;
        created_by: number;
        created_at: string;
        order_tax_type: string | null;
        order_discount_type: string | null;
    };
}

// ================================
// CREATE QUOTATION FORM DATA
// ================================
export interface CreateQuotationFormData {
    store_id: string | number;
    customer_id: string | number;
    quotation_items: QuotationItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: string;
    note?: string;
    grand_total: number;
    order_tax_type: 'percent' | 'fixed';
    order_discount_type: 'percent' | 'fixed';
}

// ================================
// UPDATE QUOTATION FORM DATA
// ================================
export interface UpdateQuotationFormData {
    quotation_id: string | number;
    store_id: string | number;
    customer_id: string | number;
    quotation_items: QuotationItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: string;
    note?: string;
    grand_total: number;
    order_tax_type: 'percent' | 'fixed';
    order_discount_type: 'percent' | 'fixed';
}

// ================================
// QUOTATION LIST ITEM (API RESPONSE)
// ================================
export interface QuotationListItem {
    quotation_id: number;
    reference: string;
    business_id: number;
    store_id: number;
    customer_id: number;
    order_tax: string;
    order_discount: string;
    shipping: string;
    grand_total: string;
    status: string;
    note?: string;
    created_by: number;
    created_at: string;
    user_name?: string;
    business_name?: string;
    customer_name?: string;
    store_name?: string;
}

// ================================
// QUOTATIONS LIST RESPONSE
// ================================
export interface QuotationsListResponse {
    status: number;
    data: QuotationListItem[];
    pagination: {
        page: string | number;
        limit: string | number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ================================
// QUOTATION DETAIL ITEM
// ================================
export interface QuotationDetailItem {
    id: number;
    quotation_id: number;
    product: {
        id: number;
        name: string;
        sku: string;
    };
    variation: {
        id: number;
        type: string;
        value: string;
        sku: string;
        tax?: {
            amount: number | string;
            type: string | null;
        };
    } | null;
    quantity: number;
    unit_cost: string;
    tax: {
        amount: string;
        type: string | null;
    };
    discount: string;
    subtotal: string;
}

// ================================
// QUOTATION DETAIL RESPONSE
// ================================
export interface QuotationDetailResponse {
    quotation_id: number;
    reference: string;
    business_id: number;
    customer: {
        id: number;
        name: string;
        email?: string;
        phone?: string;
        address?: string;
    };
    store: {
        id: number;
        name: string | null;
    };
    tax: {
        amount: string;
        type: 'percent' | 'fixed' | null;
    };
    discount: {
        amount: string;
        type: 'percent' | 'fixed' | null;
    };
    shipping: string;
    grand_total: string;
    status: string;
    note?: string;
    created_at: string;
    updated_at: string;
    items: QuotationDetailItem[];
}

// ================================
// QUOTATION DETAIL API RESPONSE
// ================================
export interface QuotationDetailApiResponse {
    status: number;
    data: QuotationDetailResponse;
}

