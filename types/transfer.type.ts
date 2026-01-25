import { PaginationResponse } from './type';

/**
 * Transfer from API (GET response)
 */
export interface Transfer {
    transfer_id: number;
    from_store_id: number;
    from_store_name: string;
    to_store_id: number;
    to_store_name: string;
    product_id: number;
    product_name: string;
    product_sku: string;
    variation_id: number | null;
    variation_type: string | null;
    variation_value: string | null;
    quantity: number;
    status: 'pending' | 'transferred' | 'received' | 'cancelled';
    notes: string;
    created_by: number;
    created_by_name: string;
    received_by: number | null;
    received_by_name: string | null;
    transferred_at: string | null;
    received_at: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Transfer detail from API (POST response)
 */
export interface TransferDetail {
    transfer_id: number;
    business_id: number;
    from_store_id: number;
    to_store_id: number;
    product_id: number;
    variation_id: number | null;
    quantity: number;
    status: 'pending' | 'transferred' | 'received' | 'cancelled';
    notes: string;
    created_by: number;
    received_by: number | null;
    transferred_at: string | null;
    received_at: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Transfers list response from API
 */
export interface TransfersListResponse {
    status: number;
    data: Transfer[];
    pagination: PaginationResponse;
}

/**
 * Create transfer payload
 */
export interface CreateTransferPayload {
    to_store_id: number;
    product_id: number;
    quantity: number;
    from_store_id: number;
    variation_id?: number | null;
    status?: 'pending' | 'transferred' | 'received' | 'cancelled';
    notes: string;
}

/**
 * Create transfer response from API
 */
export interface CreateTransferResponse {
    status: number;
    message: string;
    data: TransferDetail;
}

/**
 * Update transfer payload
 */
export interface UpdateTransferPayload {
    to_store_id?: number;
    product_id?: number;
    quantity?: number;
    from_store_id?: number;
    variation_id?: number | null;
    status?: 'pending' | 'transferred' | 'received' | 'cancelled';
    notes?: string;
}

/**
 * Update transfer response from API
 */
export interface UpdateTransferResponse {
    status: number;
    message: string;
    data: TransferDetail;
}

/**
 * Delete transfer response from API
 */
export interface DeleteTransferResponse {
    status: number;
    message: string;
}

/**
 * Single transfer response from API
 */
export interface SingleTransferResponse {
    status: number;
    data: Transfer;
}

/**
 * Transfer type for UI (transformed from API)
 */
export interface TransferType {
    id?: string | number;
    transfer_id?: number;
    from_store_id?: number;
    from_store_name?: string;
    to_store_id?: number;
    to_store_name?: string;
    product_id?: number;
    product_name?: string;
    product_sku?: string;
    variation_id?: number | null;
    variation_type?: string | null;
    variation_value?: string | null;
    quantity?: number;
    status?: 'pending' | 'transferred' | 'received' | 'cancelled';
    notes?: string;
    created_by?: number;
    created_by_name?: string;
    received_by?: number | null;
    received_by_name?: string | null;
    transferred_at?: string | null;
    received_at?: string | null;
    created_at?: string;
    updated_at?: string;
}