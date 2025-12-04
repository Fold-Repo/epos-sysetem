/**
 * Variation type item - can be a simple string or an object with name and color code
 */
export type VariationTypeItem = string | {
    name: string;
    color?: string; // Hex color code (e.g., "#FF0000")
}

/**
 * Product Variation type definition
 */
export interface ProductVariationType {
    id: string;
    name: string;
    type: 'Color' | 'Size' | 'Other';
    variationTypes: VariationTypeItem[];
    created_at: string | Date;
    last_modified: string | Date;
}

