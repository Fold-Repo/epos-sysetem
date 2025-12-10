/**
 * Product type definition
 */
export interface ProductType {
    id: string;
    name: string;
    code: string;
    description?: string;
    image?: string;
    brand: string;
    category: string;
    price: number;
    unit: string;
    stock: number;
    discount?: number;
    tax?: number;
    created_at: string | Date;
}

