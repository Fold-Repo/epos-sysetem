import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    StaffUserType,
    BusinessUserListItem,
    BusinessUserDetail,
    BusinessUsersListResponse,
    BusinessUserDetailResponse,
    CreateBusinessUserPayload,
    UpdateBusinessUserPayload,
    CreateBusinessUserResponse,
    UpdateBusinessUserResponse,
    BusinessUserQueryParams
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// TRANSFORM BUSINESS USER LIST ITEM
// ================================
function transformBusinessUserListItem(item: BusinessUserListItem): StaffUserType {
    return {
        id: item.staff_id,
        staff_id: item.staff_id,
        user_id: item.user_id,
        firstname: item.firstname,
        lastname: item.lastname,
        full_name: item.full_name,
        email: item.email,
        phone: item.phone,
        role_id: item.role_id,
        role_name: item.role_name,
        role_description: item.role_description,
        store_id: item.store_id,
        store_name: item.store_name,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at
    };
}

// ================================
// TRANSFORM BUSINESS USER DETAIL
// ================================
function transformBusinessUserDetail(item: BusinessUserDetail): StaffUserType {
    return {
        id: item.staff_id,
        staff_id: item.staff_id,
        user_id: item.user_id,
        firstname: item.firstname,
        lastname: item.lastname,
        full_name: item.full_name,
        email: item.email,
        phone: item.phone,
        role_id: item.role_id,
        role_name: item.role_name,
        role_description: item.role_description,
        store_id: item.store_id,
        store_name: item.store_name,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at
    };
}

// ================================
// GET BUSINESS USERS
// ================================
export async function getBusinessUsers(params: BusinessUserQueryParams = {}): Promise<{ users: StaffUserType[]; pagination: BusinessUsersListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search, role_id, store_id, is_active } = params
    
    const requestParams: Record<string, string | number | boolean> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (role_id) requestParams.role_id = role_id
    if (store_id) requestParams.store_id = store_id
    if (is_active !== undefined) requestParams.is_active = is_active
    
    const response = await client.get<BusinessUsersListResponse>(ENDPOINT.BUSINESS_USERS, {
        params: requestParams
    })
    
    return {
        users: response.data.data.map(transformBusinessUserListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET BUSINESS USERS HOOK
// ================================
export function useGetBusinessUsers(params: BusinessUserQueryParams = {}) {
    const { page = 1, limit = 25, sort, search, role_id, store_id, is_active } = params
    
    return useQuery({
        queryKey: ['business-users-list', page, limit, sort, search, role_id, store_id, is_active],
        queryFn: () => getBusinessUsers({ page, limit, sort, search, role_id, store_id, is_active }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// GET BUSINESS USER BY ID
// ================================
export async function getBusinessUserById(id: number): Promise<StaffUserType> {
    const response = await client.get<BusinessUserDetailResponse>(`${ENDPOINT.BUSINESS_USERS}/${id}`)
    return transformBusinessUserDetail(response.data.data)
}

// ================================
// USE GET BUSINESS USER BY ID HOOK
// ================================
export function useGetBusinessUserById(id: number | string | undefined) {
    return useQuery({
        queryKey: ['business-user', id],
        queryFn: () => getBusinessUserById(Number(id)),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// CREATE BUSINESS USER
// ================================
export async function createBusinessUser(payload: CreateBusinessUserPayload): Promise<CreateBusinessUserResponse> {
    const response = await client.post(ENDPOINT.BUSINESS_USERS, payload);
    return response.data;
}

// ================================
// USE CREATE BUSINESS USER HOOK
// ================================
export function useCreateBusinessUser() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: createBusinessUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-users-list'] });
            showSuccess('Staff user created', 'Staff user created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create staff user', errorMessage);
        },
    });
}

// ================================
// UPDATE BUSINESS USER
// ================================
export async function updateBusinessUser(id: number, payload: UpdateBusinessUserPayload): Promise<UpdateBusinessUserResponse> {
    const response = await client.patch(`${ENDPOINT.BUSINESS_USERS}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE BUSINESS USER HOOK
// ================================
export function useUpdateBusinessUser() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateBusinessUserPayload }) => 
            updateBusinessUser(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-users-list'] });
            queryClient.invalidateQueries({ queryKey: ['business-user'] });
            showSuccess('Staff user updated', 'Staff user updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update staff user', errorMessage);
        },
    });
}

// ================================
// DELETE BUSINESS USER
// ================================
export async function deleteBusinessUser(id: number): Promise<{ status: number; message: string }> {
    const response = await client.delete(`${ENDPOINT.BUSINESS_USERS}/${id}`);
    return response.data;
}

// ================================
// USE DELETE BUSINESS USER HOOK
// ================================
export function useDeleteBusinessUser() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: deleteBusinessUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-users-list'] });
            showSuccess('Staff user deleted', 'Staff user deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to delete staff user', errorMessage);
        },
    });
}

