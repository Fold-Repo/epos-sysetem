/**
 * Product Category type definition
 */
export interface ProductCategoryType {
    id: string;
    name: string;
    image?: string;
    productCount: number;
    created_at: string | Date;
    last_modified: string | Date;
    status: 'active' | 'inactive';
}

