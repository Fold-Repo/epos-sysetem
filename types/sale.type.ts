// ================================
// SALE SUMMARY TYPES
// ================================
export interface SaleSummaryMetric {
    count: number;
    currentMonth: number;
    lastMonth: number;
    percentageChange: number;
}

export interface SaleSummaryResponse {
    status: number;
    data: {
        totalSales: SaleSummaryMetric;
        completed: SaleSummaryMetric;
        pending: SaleSummaryMetric;
        cancelled: SaleSummaryMetric;
    };
}

// ================================
// SALE TYPE (UI)
// ================================
export interface SaleType {
    id?: string | number;
    reference?: string;
    customer_name?: string;
    store_name?: string;
    customerId?: string;
    status?: 'completed' | 'pending' | 'cancelled';
    paymentStatus?: 'unpaid' | 'paid';
    paymentMethod?: string;
    grandTotal?: number;
    created_at?: string | Date;
}

// ================================
// SALE ITEM FORM DATA
// ================================
export interface SaleItemFormData {
    product_id: number;
    quantity: number;
    net_unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    sale_item_id?: string;
    variation_id?: number;
}

// ================================
// CREATE SALE PAYLOAD
// ================================
export interface CreateSalePayload {
    store_id: number;
    customer_id: number;
    order_tax: number;
    order_discount: number;
    shipping: number;
    grand_total: number;
    status: string;
    payment_status: string;
    note?: string;
    paymentmethod_id?: number;
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
        sale_item_id?: string;
    }>;
}

// ================================
// CREATE SALE RESPONSE
// ================================
export interface CreateSaleResponse {
    status: number;
    data: {
        sale_id: number;
        business_id: number;
        store_id: number;
        customer_id: number;
        order_tax: string;
        order_discount: string;
        shipping: string;
        grand_total: string;
        status: string;
        payment_status: string;
        note?: string;
        reference: string;
        created_by: number;
        created_at: string;
        paymentmethod_id: number | null;
        order_tax_type: string | null;
        order_discount_type: string | null;
        paymentLink: string | null;
    };
}

// ================================
// CREATE SALE FORM DATA
// ================================
export interface CreateSaleFormData {
    store_id: string | number;
    customer_id: string | number;
    sale_items: SaleItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: 'completed' | 'pending' | 'cancelled';
    payment_status: 'unpaid' | 'paid';
    payment_method?: string;
    note?: string;
    grand_total: number;
    order_tax_type: 'percent' | 'fixed';
    order_discount_type: 'percent' | 'fixed';
}

// ================================
// UPDATE SALE FORM DATA
// ================================
export interface UpdateSaleFormData extends CreateSaleFormData {
    sale_id: string | number;
}

// ================================
// SALE LIST ITEM (API RESPONSE)
// ================================
export interface SaleListItem {
    sale_id: number;
    reference: string;
    business_id: number;
    store_id: number;
    customer_id: number;
    order_tax: string;
    order_tax_type: string | null;
    order_discount: string;
    order_discount_type: string | null;
    shipping: string;
    grand_total: string;
    status: string;
    payment_status: string;
    paymentmethod_id: number | null;
    note: string | null;
    created_by: number;
    created_at: string;
    user_name: string;
    payment_type: string | null;
    business_name: string;
    store_name: string | null;
    customer_name: string;
}

// ================================
// SALES LIST RESPONSE
// ================================
export interface SalesListResponse {
    status: number;
    data: SaleListItem[];
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
// SALE DETAIL ITEM
// ================================
export interface SaleDetailItem {
    id: number;
    sale_id: number;
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
        tax: {
            amount: string;
            type: 'percent' | 'fixed';
        };
    } | null;
    quantity: number;
    unit_cost: string;
    tax: {
        amount: string;
        type: 'percent' | 'fixed';
    };
    discount: string;
    subtotal: string;
}

// ================================
// SALE DETAIL RESPONSE
// ================================
export interface SaleDetailResponse {
    sale_id: number;
    reference: string;
    business_id: number;
    customer: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        name: string;
    };
    store: {
        id: number;
        name: string;
    };
    business: {
        id: number;
        name: string;
    };
    tax: {
        amount: string;
        type: 'percent' | 'fixed';
    };
    discount: {
        amount: string;
        type: 'percent' | 'fixed';
    };
    shipping: string;
    grand_total: string;
    status: string;
    payment: {
        status: string;
        method: {
            id: number | null;
            type: string | null;
        };
    };
    note: string | null;
    created_at: string;
    items: SaleDetailItem[];
}

// ================================
// SALE DETAIL API RESPONSE
// ================================
export interface SaleDetailApiResponse {
    status: number;
    data: SaleDetailResponse;
}
