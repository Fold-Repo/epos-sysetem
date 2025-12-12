export interface TransferType {
    id?: string | number;
    reference?: string;
    fromStore?: string;
    fromStoreId?: string;
    toStore?: string;
    toStoreId?: string;
    items?: number;
    grandTotal?: number;
    status?: string;
    created_at?: string | Date;
}

// Backend API form data structure for transfer items
export interface TransferItemFormData {
    product_id: number;
    quantity: number;
    transfer_item_id?: string; // For updates only
}

// Backend API form data structure for creating transfer
export interface CreateTransferFormData {
    from_store_id: string | number;
    to_store_id: string | number;
    transfer_items: TransferItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: string;
    note?: string;
    grand_total: number;
}

// Backend API form data structure for updating transfer
export interface UpdateTransferFormData {
    transfer_id: string | number;
    from_store_id: string | number;
    to_store_id: string | number;
    transfer_items: TransferItemFormData[];
    order_tax: number;
    order_discount: number;
    shipping: number;
    status: string;
    note?: string;
    grand_total: number;
}

