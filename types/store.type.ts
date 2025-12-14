export interface StoreType {
    id?: string | number;
    name: string;
    status?: 'active' | 'inactive';
    created_at?: string | Date;
}

