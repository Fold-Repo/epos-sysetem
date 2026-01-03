export interface StoreType {
    id?: string | number;
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
    created_at?: string | Date;
}

// ==============================
// Store API Types
// ==============================
export interface StoreListItem {
    store_id: number;
    name: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string | null;
    userCount?: number; // To be added later
    status?: string; // To be added later
}

export interface StoresListResponse {
    status: number;
    data: StoreListItem[];
}

export interface CreateStorePayload {
    name: string;
    description: string;
}

export interface CreateStoreResponse {
    status: number;
    data: {
        store_id: number;
        name: string;
        description: string;
        user_id: number;
        created_at: string;
        updated_at: string | null;
    };
}

