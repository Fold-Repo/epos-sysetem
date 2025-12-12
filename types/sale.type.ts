export interface SaleType {
    id?: string | number;
    reference?: string;
    user?: string;
    userId?: string;
    customer?: string;
    customerId?: string;
    status?: 'completed' | 'pending' | 'cancelled';
    grandTotal?: number;
    paid?: number;
    due?: number;
    paymentStatus?: 'unpaid' | 'paid' | 'partial';
    paymentType?: string;
    created_at?: string | Date;
}

// Backend API form data structure for sale items
export interface SaleItemFormData {
    product_id: number;
    quantity: number;
    net_unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    sale_item_id?: string; // For updates only
}

// Backend API form data structure for creating sale
export interface CreateSaleFormData {
    user_id: string | number;
    customer_id: string | number;
    sale_items: SaleItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: 'completed' | 'pending' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'partial';
    payment_type?: string;
    payment_amount?: number;
    note?: string;
    grand_total: number;
}

// Backend API form data structure for updating sale
export interface UpdateSaleFormData {
    sale_id: string | number;
    user_id: string | number;
    customer_id: string | number;
    sale_items: SaleItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: 'completed' | 'pending' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'partial';
    payment_type?: string;
    payment_amount?: number;
    note?: string;
    grand_total: number;
}

