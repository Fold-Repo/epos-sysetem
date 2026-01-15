import { PaginationResponse } from './type';

// ==============================
// Business User UI Type
// ==============================
export interface StaffUserType {
    id?: string | number;
    staff_id?: number;
    user_id?: number;
    firstname: string;
    lastname: string;
    full_name?: string;
    email?: string;
    phone?: string;
    role_id?: number;
    role_name?: string;
    role_description?: string;
    store_id?: number;
    store_name?: string;
    is_active?: boolean;
    created_at?: string | Date;
    updated_at?: string | Date;
}

// ==============================
// Business User API Types
// ==============================
export interface BusinessUserListItem {
    staff_id: number;
    user_id: number;
    business_id: number;
    store_id: number;
    role_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    full_name: string;
    store_name: string;
    role_name: string;
    role_description: string;
}

export interface BusinessUserDetail extends BusinessUserListItem {
    parent_user_id: number;
}

export interface BusinessUsersListResponse {
    status: number;
    data: BusinessUserListItem[];
    pagination: PaginationResponse;
}

export interface BusinessUserDetailResponse {
    status: number;
    data: BusinessUserDetail;
}

export interface CreateBusinessUserPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    role_id: number;
    store_id: number;
}

export interface UpdateBusinessUserPayload {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    password?: string;
    role_id?: number;
    store_id?: number;
    is_active?: boolean;
}

export interface CreateBusinessUserResponse {
    status: number;
    message: string;
    data: {
        user: {
            user_id: number;
            firstname: string;
            lastname: string;
            email: string;
            phone: string;
            altphone: string | null;
            position: string | null;
            created_at: string;
            isVerify: boolean;
            role_id: number;
            firebase_uid: string | null;
            auth_provider: string;
            profile_picture: string | null;
            is_verify: boolean;
            updated_at: string;
        };
        staffRecord: {
            id: number;
            user_id: number;
            business_id: number;
            parent_user_id: number;
            store_id: number;
            role_id: number;
            is_active: boolean;
            created_at: string;
            updated_at: string;
        };
    };
}

export interface UpdateBusinessUserResponse {
    status: number;
    message: string;
}

export interface BusinessUserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role_id?: number;
    store_id?: number;
    is_active?: boolean;
    sort?: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'role_asc' | 'role_desc';
}

