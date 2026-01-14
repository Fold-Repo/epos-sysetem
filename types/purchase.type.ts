// ================================
// PURCHASE SUMMARY TYPES
// ================================
export interface PurchaseSummaryMetric {
    count: number;
    currentMonth: number;
    lastMonth: number;
    percentageChange: number;
}

export interface PurchaseSummaryResponse {
    status: number;
    data: {
        totalPurchases: PurchaseSummaryMetric;
        received: PurchaseSummaryMetric;
        pending: PurchaseSummaryMetric;
        orders: PurchaseSummaryMetric;
    };
}

// ================================
// PURCHASE TYPE (UI)
// ================================
export interface PurchaseType {
    id?: string | number;
    reference?: string;
    supplier_name?: string;
    store_name?: string;
    supplierId?: string;
    status?: 'received' | 'pending' | 'orders';
    paymentStatus?: 'unpaid' | 'paid';
    paymentMethod?: string;
    paymentAmount?: number;
    grandTotal?: number;
    created_at?: string | Date;
}

// ================================
// PURCHASE ITEM FORM DATA
// ================================
export interface PurchaseItemFormData {
    product_id: number;
    quantity: number;
    net_unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    purchase_item_id?: string;
    variation_id?: number;
}

// ================================
// CREATE PURCHASE PAYLOAD
// ================================
export interface CreatePurchasePayload {
    purchase: {
        supplier_id: number;
        store_id: number;
        purchase_date: string;
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
    };
    items: Array<{
        product_id: number;
        quantity: number;
        unit_cost: number;
        tax: number;
        discount: number;
        subtotal: number;
        variant_id?: number;
    }>;
}

// ================================
// CREATE PURCHASE RESPONSE
// ================================
export interface CreatePurchaseResponse {
    status: number;
    data: {
        purchase_id: number;
        reference: string;
        supplier_id: number;
        business_id: number;
        store_id: number;
        purchase_date: string;
        order_tax: string;
        order_discount: string;
        shipping: string;
        grand_total: string;
        status: string;
        payment_status: string;
        note?: string;
        created_at: string;
        updated_at: string;
        order_tax_type: string | null;
        order_discount_type: string | null;
        paymentmethod_id: number | null;
    };
}

// ================================
// CREATE PURCHASE FORM DATA
// ================================
export interface CreatePurchaseFormData {
    supplier_id: string | number;
    store_id: string | number;
    purchase_date?: string;
    purchase_items: PurchaseItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: 'received' | 'pending' | 'orders';
    payment_status: 'unpaid' | 'paid';
    payment_method?: string;
    payment_amount?: number;
    note?: string;
    grand_total: number;
    order_tax_type: 'percent' | 'fixed';
    order_discount_type: 'percent' | 'fixed';
}

// ================================
// UPDATE PURCHASE FORM DATA
// ================================
export interface UpdatePurchaseFormData extends CreatePurchaseFormData {
    purchase_id: string | number;
}

// ================================
// PURCHASE LIST ITEM (API RESPONSE)
// ================================
export interface PurchaseListItem {
    purchase_id: number;
    reference: string;
    supplier_id: number;
    business_id: number;
    store_id: number;
    purchase_date: string;
    order_tax: string;
    order_discount: string;
    shipping: string;
    grand_total: string;
    status: string;
    payment_status: string;
    note: string | null;
    created_at: string;
    updated_at: string;
    order_tax_type: string | null;
    order_discount_type: string | null;
    paymentmethod_id: number | null;
    store_name: string;
    supplier_name: string;
}

// ================================
// PURCHASES LIST RESPONSE
// ================================
export interface PurchasesListResponse {
    status: number;
    data: PurchaseListItem[];
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
// PURCHASE DETAIL ITEM
// ================================
export interface PurchaseDetailItem {
    id: number;
    purchase_id: number;
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
// PURCHASE DETAIL RESPONSE
// ================================
export interface PurchaseDetailResponse {
    purchase_id: number;
    reference: string;
    purchase_date: string;
    business_id: number;
    supplier: {
        id: number;
        name: string;
    };
    store: {
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
    updated_at: string;
    items: PurchaseDetailItem[];
}

// ================================
// PURCHASE DETAIL API RESPONSE
// ================================
export interface PurchaseDetailApiResponse {
    status: number;
    data: PurchaseDetailResponse;
}
