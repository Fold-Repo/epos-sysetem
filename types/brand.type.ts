/**
 * Product Brand type definition
 */
export interface ProductBrandType {
    id: string;
    name: string;
    image?: string;
    productCount: number;
    created_at: string | Date;
    last_modified: string | Date;
    status: 'active' | 'inactive';
}

