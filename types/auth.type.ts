import { UserPermissions } from './permissions';

export const AUTH_TOKEN_KEY = 'authToken'
export const EMAIL_ADDRESS_KEY = 'userEmail'

// Business types (for registration)
export interface BusinessType {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface BusinessTypesResponse {
    status: number;
    message: string;
    data: BusinessType[];
}

export interface ValidateCompanyPayload {
    company_number: string;
    businessname?: string;
}

export interface ValidateCompanyResponse {
    status: number;
    message: string;
    data: {
        success: boolean;
        company?: {
            company_name: string;
            company_status?: string;
            registered_office_address?: {
                address_line_1?: string;
                address_line_2?: string;
                country?: string;
                locality?: string;
                postal_code?: string;
            };
        };
        validation?: { isValid: boolean; mismatches?: Record<string, { provided: string; registered: string }> };
        officers?: unknown[];
    };
}

export interface PersonaVerificationCreatePayload {
    template_id: string;
    reference_id: string;
    redirect_uri: string;
}

export interface PersonaVerificationCreateResponse {
    status: number;
    message: string;
    data: {
        inquiry_id: string;
        client_token: string;
        status: string;
    };
}

export interface RegistrationPayload {
    businessname?: string;
    businesstype: string;
    tin: string;
    website: string | null;
    business_registration_number: string | null;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    altphone: string | null;
    product_service: string;
    product_description: string;
    product_brochure: FileList | null;
    terms_condition: string;
    certify_correct_data: string;
    role: string;
    position: string;
    addressline1: string;
    addressline2: string | null;
    addressline3: string | null;
    city: string;
    postcode: string;
}

export interface RegistrationResponse {
    status: number;
    data: {
        message: string;
        displayToken: string;
    };
}

export interface RequestOTPPayload {
    email: string;
    type?: 'verify_account' | 'reset_password';
}

export interface RequestOTPResponse {
    status: number;
    data: {
        message: string;
        email: string;
        displayToken: string;
    };
}

export interface VerifyAccountPayload {
    email: string;
    token: string;
}

export interface VerifyAccountResponse {
    status: number;
    data: {
        message: string;
        safeUser?: {
            user_id: number;
            firstname: string;
            lastname: string;
            email: string;
            phone: string;
            altphone: string;
            role: string;
            position: string;
            created_at: string;
            isVerify: number;
            permission: any[];
        };
        token?: string;
        email?: string;
    };
}

export interface ResetPasswordPayload {
    email: string;
    password: string;
    token: string;
}

export interface ResetPasswordResponse {
    status: number;
    data: {
        message: string;
        email: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: number;
    message?: string;
    isVerify?: boolean;
    data?: {
        token?: string;
        user?: {
            firstname: string;
            lastname: string;
            email: string;
            position: string;
            user_id: number;
        };
    };
}

export interface RolePermissionsResponse {
    status: number;
    data: {
        name: string;
        description?: string;
        permissions: UserPermissions;
    };
}

// ==============================
// Role Permissions Types
// ==============================
export interface PermissionItem {
    permission_id: number;
    permission: string;
    privilege: 'view' | 'create' | 'update' | 'delete' | null;
    value: boolean | null;
}

export interface RolePermissionsListResponse {
    status: number;
    data: PermissionItem[];
}

// ==============================
// Role Creation/Update Types
// ==============================
export interface RolePermissionPayload {
    permission_id: number;
    privileges: ('view' | 'create' | 'update' | 'delete')[];
}

export interface CreateRolePayload {
    name: string;
    description?: string;
    permissions: RolePermissionPayload[];
}

export interface CreateRoleResponse {
    status: number;
    data: {
        message: string;
    };
}

// ==============================
// Roles List Types
// ==============================
export interface RoleListItem {
    role_id: number;
    name: string;
    description: string;
    created_at: string;
    permission_count: number;
    user_count: number;
}

export interface RolesListResponse {
    status: number;
    data: RoleListItem[];
}

// ==============================
// Role Permission Details Types
// ==============================
export interface RolePermissionDetailsData {
    name: string;
    description: string;
    permissions: {
        [permissionName: string]: {
            view: boolean;
            create: boolean;
            update: boolean;
            delete: boolean;
        };
    };
}

export interface RolePermissionDetailsResponse {
    status: number;
    data: RolePermissionDetailsData;
}

// ==============================
// Google Authentication Types
// ==============================
export interface GoogleSignInPayload {
    idToken: string;
}

export interface GoogleSignUpPayload extends RegistrationPayload {
    idToken: string;
}

export interface GoogleSignInResponse extends LoginResponse {}

export interface GoogleSignUpResponse extends RegistrationResponse {}