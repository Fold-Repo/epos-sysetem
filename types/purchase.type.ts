export interface PurchaseType {
    id?: string | number;
    reference?: string;
    supplier?: string;
    supplierId?: string;
    status?: 'received' | 'pending' | 'orders';
    paymentStatus?: 'unpaid' | 'paid' | 'partial';
    paymentMethod?: string;
    paymentAmount?: number;
    grandTotal?: number;
    created_at?: string | Date;
}

// Backend API form data structure for purchase items
export interface PurchaseItemFormData {
    product_id: number;
    quantity: number;
    net_unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    purchase_item_id?: string; // For updates only
}

// Backend API form data structure for creating purchase
export interface CreatePurchaseFormData {
    supplier_id: string | number;
    purchase_items: PurchaseItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: 'received' | 'pending' | 'orders';
    payment_status: 'unpaid' | 'paid' | 'partial';
    payment_method?: string;
    payment_amount?: number;
    note?: string;
    grand_total: number;
}

// Backend API form data structure for updating purchase
export interface UpdatePurchaseFormData {
    purchase_id: string | number;
    supplier_id: string | number;
    purchase_items: PurchaseItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: 'received' | 'pending' | 'orders';
    payment_status: 'unpaid' | 'paid' | 'partial';
    payment_method?: string;
    payment_amount?: number;
    note?: string;
    grand_total: number;
}

