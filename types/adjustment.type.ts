/**
 * Adjustment type definition
 */
export interface AdjustmentItem {
    productId: string;
    quantity: number;
    type: 'addition' | 'subtraction' | 'return';
}

export interface AdjustmentType {
    id?: string;
    reference?: string;
    totalProducts?: number;
    items: AdjustmentItem[];
    created_at?: string | Date;
    date?: string;
}

// Backend API form data structure
export interface AdjustmentItemFormData {
    product_id: number;
    quantity: number;
    method_type: number;
    adjustment_item_id: string;
}

export interface CreateAdjustmentFormData {
    date: string;
    note: string;
    adjustment_items: AdjustmentItemFormData[];
}

