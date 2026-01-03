/**
 * Unit from API
 */
export interface Unit {
    id: number;
    name: string;
    short_name: string;
}

/**
 * Units list response from API
 */
export interface UnitsListResponse {
    status: number;
    data: Unit[];
}

/**
 * Create/Update unit payload
 */
export interface CreateUnitPayload {
    name: string;
    short_name: string;
}

/**
 * Create unit response
 */
export interface CreateUnitResponse {
    status: number;
    data: Unit;
}

/**
 * Update unit response
 */
export interface UpdateUnitResponse {
    status: number;
    data: Unit;
}

/**
 * Delete unit response
 */
export interface DeleteUnitResponse {
    status: number;
    message: string;
}

// ==============================
// Legacy types (for backward compatibility)
// ==============================

/**
 * Product Unit type definition (legacy)
 */
export interface ProductUnitType {
    id: string;
    name: string;
    shortName: string;
    baseName: string;
    created_at: string | Date;
}
