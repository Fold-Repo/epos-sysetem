// ==============================
// Profile API response types
// ==============================

export interface ProfileUser {
    user_id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    altphone: string | null;
    position: string;
    isVerify: boolean;
    is_business_owner: boolean;
    created_at: string;
    persona_verification_status?: string | null;
    persona_verified_at?: string | null;
    persona_verified?: boolean;
}

export interface ProfileRole {
    role_id: number;
    name: string;
    description: string;
}

export interface ProfileBusiness {
    business_id: number;
    businessname: string;
    businesstype: string;
    tin: string;
    website: string | null;
    business_registration_number: string;
    product_service: string;
    product_description: string;
    logo: string | null;
    created_at: string;
}

export interface ProfileStore {
    store_id: number;
    name: string;
    description: string;
    business_id: number;
    stripe_location_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileAddress {
    address_id: number;
    addressline1: string;
    addressline2: string | null;
    addressline3: string | null;
    city: string;
    country: string;
    postcode: string;
}

export interface ProfileData {
    user: ProfileUser;
    role: ProfileRole;
    business: ProfileBusiness;
    stores: ProfileStore[];
    address: ProfileAddress | null;
    isFoodOutlet: boolean;
}

export interface ProfileResponse {
    status: number;
    message: string;
    data: ProfileData;
}

// ==============================
// Update profile (PUT) payload
// ==============================
export interface UpdateProfileAddressPayload {
    addressline1: string;
    addressline2?: string | null;
    addressline3?: string | null;
    city: string;
    country: string;
    postcode: string;
}

export interface UpdateProfilePayload {
    logo?: string | null;
    address?: UpdateProfileAddressPayload;
}
