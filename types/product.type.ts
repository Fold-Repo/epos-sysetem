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
    minPrice?: number;
    maxPrice?: number;
    unit: string;
    stock: number;
    discount?: number;
    tax?: number;
    created_at: string | Date;
}

// ==============================
// Product API Types
// ==============================

/**
 * Product image from API
 */
export interface ProductImage {
    url: string;
    public_id: string;
}

/**
 * Tax information for products
 */
export interface ProductTax {
    amount: number;
    type: 'percent' | 'fixed';
}

/**
 * Variation detail for variation products
 */
export interface ProductVariationDetail {
    variationType: string;
    value: string;
    sku: string;
    productCost: number;
    productPrice: number;
    productQuantity: number;
    stockAlert: number;
    tax: ProductTax;
}

/**
 * Create product payload - Variation type
 */
export interface CreateVariationProductPayload {
    name: string;
    description: string;
    sku: string;
    barcodeSymbology: string;
    category_id: number;
    brand_id: number;
    product_unit: number;
    quantityLimit: number;
    expiryDate?: string;
    status: 'Active' | 'Inactive';
    note?: string;
    productType: 'Variation';
    images: ProductImage[];
    variations: ProductVariationDetail[];
}

/**
 * Create product payload - Single/Simple type
 */
export interface CreateSingleProductPayload {
    name: string;
    description: string;
    sku: string;
    barcodeSymbology: string;
    category_id: number;
    brand_id: number;
    product_unit: number;
    quantityLimit: number;
    expiryDate?: string;
    status: 'Active' | 'Inactive';
    note?: string;
    productType: 'Simple';
    productCost: number;
    productPrice: number;
    stockAlert: number;
    tax: ProductTax;
    images: ProductImage[];
}

/**
 * Union type for create product payload
 */
export type CreateProductPayload = CreateSingleProductPayload | CreateVariationProductPayload;

/**
 * Create product response
 */
export interface CreateProductResponse {
    status: number;
    data: {
        message: string;
    };
}

/**
 * Product list item from API
 */
export interface ProductListItem {
    product_id: number;
    name: string;
    image_url: string | null; // JSON string containing { url, public_id }
    sku: string;
    category_name: string;
    brand_name: string;
    product_unit: string;
    status: 'Active' | 'Inactive';
    min_price: string;
    max_price: string;
    quantity_limit: number;
    created_at: string;
}

/**
 * Products pagination response
 */
export interface ProductsPaginationResponse {
    page: string;
    limit: string;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Products list response
 */
export interface ProductsListResponse {
    status: number;
    data: ProductListItem[];
    pagination: ProductsPaginationResponse;
}

/**
 * Delete product response
 */
export interface DeleteProductResponse {
    status: number;
    message: string;
}

/**
 * Product variation detail from API
 */
export interface ProductVariationDetailResponse {
    id: number;
    product_id?: number;
    variation_type: string;
    value: string;
    sku: string;
    product_cost: string;
    product_price: string;
    product_quantity: number;
    stock_alert: number;
    tax_amount: string;
    tax_type: 'percent' | 'fixed';
    created_at: string;
    updated_at?: string;
}

/**
 * Product image from detail API
 */
export interface ProductDetailImage {
    id: number;
    product_id: number;
    image_url: string;
    public_id: string;
    is_primary: string;
    created_at: string;
}

/**
 * Product detail response from API
 */
export interface ProductDetailResponse {
    product_id: number;
    name: string;
    sku: string;
    barcode_symbology: string;
    business_id: number;
    product_type: 'Simple' | 'Variation';
    category: {
        id: number;
        name: string;
    };
    subcategory: {
        name: string | null;
    };
    brand: {
        id: number;
        name: string;
    };
    unit: {
        id: string;
        name: string;
    };
    pricing: {
        cost_price: string | null;
        selling_price: string | null;
        min_price: string;
        max_price: string;
    };
    stock: {
        quantity: number;
        alert_level: number | null;
    };
    tax: {
        amount: string;
        type: 'percent' | 'fixed' | null;
    };
    description: string | null;
    note: string | null;
    status: 'Active' | 'Inactive';
    expiry_date: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    variations: ProductVariationDetailResponse[];
    images: ProductDetailImage[];
}

/**
 * Product detail API response
 */
export interface ProductDetailApiResponse {
    status: number;
    data: ProductDetailResponse;
}
