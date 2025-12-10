export interface QuotationType {
    id?: string | number;
    reference?: string;
    customer?: string;
    customerId?: string;
    status?: string;
    grandTotal?: number;
    created_at?: string | Date;
}

// Backend API form data structure for quotation items
export interface QuotationItemFormData {
    product_id: number;
    quantity: number;
    net_unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    quotation_item_id?: string; // For updates only
}

// Backend API form data structure for creating quotation
export interface CreateQuotationFormData {
    customer_id: string | number;
    quotation_items: QuotationItemFormData[];
    order_tax: number; // Percentage
    order_discount: number; // Fixed amount
    shipping: number; // Fixed amount
    status: string;
    note?: string;
    grand_total: number;
}

// Backend API form data structure for updating quotation
export interface UpdateQuotationFormData {
    quotation_id: string | number;
    customer_id: string | number;
    quotation_items: QuotationItemFormData[];
    order_tax: number; // Percentage
    order_discount: number; // Fixed amount
    shipping: number; // Fixed amount
    status: string;
    note?: string;
    grand_total: number;
}

