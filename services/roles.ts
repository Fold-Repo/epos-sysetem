import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { CreateRolePayload, CreateRoleResponse, PermissionItem, RolesListResponse, RoleListItem, RolePermissionDetailsResponse } from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { snakeToCamel } from "@/utils";
import { RoleType } from "@/types";

/**
 * PermissionState type from RoleForm
 */
interface PermissionState {
    [key: string]: {
        view: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    };
}

/**
 * Transform RoleForm permissions to API format
 * @param permissions - PermissionState from RoleForm (camelCase keys)
 * @param permissionsData - Array of PermissionItem from API (to map back to permission_id)
 * @returns Array of RolePermissionPayload for API
 */
export function transformPermissionsToAPI(
    permissions: PermissionState,
    permissionsData: PermissionItem[]
): CreateRolePayload['permissions'] {
    const result: CreateRolePayload['permissions'] = [];
    const permissionIdMap = new Map<string, number>();

    // Create a map of permission name (snake_case) to permission_id
    permissionsData.forEach(item => {
        if (item.permission && !permissionIdMap.has(item.permission)) {
            permissionIdMap.set(item.permission, item.permission_id);
        }
    });

    // Transform PermissionState to API format
    Object.keys(permissions).forEach(camelKey => {
        const modulePermissions = permissions[camelKey];
        
        // Convert camelCase back to snake_case to find the permission name
        // We need to find the original permission name from permissionsData
        const permissionItem = permissionsData.find(item => {
            if (!item.permission) return false;
            const itemCamelKey = snakeToCamel(item.permission);
            return itemCamelKey === camelKey;
        });

        if (!permissionItem || !permissionItem.permission) return;

        const permissionId = permissionItem.permission_id;
        const privileges: ('view' | 'create' | 'update' | 'delete')[] = [];

        // Only include privileges that are true
        if (modulePermissions.view) privileges.push('view');
        if (modulePermissions.create) privileges.push('create');
        if (modulePermissions.update) privileges.push('update');
        if (modulePermissions.delete) privileges.push('delete');

        // Only add if at least one privilege is selected
        if (privileges.length > 0) {
            result.push({
                permission_id: permissionId,
                privileges
            });
        }
    });

    return result;
}

/**
 * Create a role
 * @param payload - Role data including name, description, and permissions
 * @returns Promise with the created role response
 */
export async function createRole(payload: CreateRolePayload): Promise<CreateRoleResponse> {
    const response = await client.post(ENDPOINT.AUTH.ROLES, payload);
    return response.data;
}

/**
 * Update a role
 * @param id - Role ID
 * @param payload - Role data including name, description, and permissions
 * @returns Promise with the updated role response
 */
export async function updateRole(id: number, payload: CreateRolePayload): Promise<CreateRoleResponse> {
    const response = await client.patch(`${ENDPOINT.AUTH.ROLES}/${id}`, payload);
    return response.data;
}

/**
 * React Query mutation hook for creating roles
 * @returns Mutation object with mutate function and state
 */
export const useCreateRole = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (roleData: CreateRolePayload) => createRole(roleData),
        onSuccess: (data, variables) => {

            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['roles-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Role created successfully';
            showSuccess(message, 'The role has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating roles
 * @returns Mutation object with mutate function and state
 */
export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, roleData }: { id: number; roleData: CreateRolePayload }) => 
            updateRole(id, roleData),
        onSuccess: (data, variables) => {

            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['roles-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Role updated successfully';
            showSuccess(message, 'The role has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update role', getErrorMessage(error));
        },
    });
};

/**
 * Get all roles
 * @returns Promise with the roles list response
 */
export async function getRoles(): Promise<RolesListResponse> {
    const response = await client.get(ENDPOINT.AUTH.ROLES);
    return response.data;
}

/**
 * Transform API role response to RoleType
 * @param role - RoleListItem from API
 * @returns RoleType for use in components
 */
function transformRoleToRoleType(role: RoleListItem): RoleType {
    return {
        id: role.role_id,
        name: role.name,
        description: role.description,
        userCount: role.userCount,
        permissionsCount: role.permissionsCount,
        created_at: role.created_at,
    };
}

/**
 * React Query hook to get roles list
 * @returns Query result with data (RoleType[]), isLoading, and error
 */
export const useGetRoles = () => {
    const { data, isLoading, error } = useQuery<RoleType[]>({
        queryKey: ['roles-list'],
        queryFn: async () => {
            const response = await getRoles();
            // Transform the API response to match RoleType
            return response.data.map(transformRoleToRoleType);
        },
    });

    return { 
        data: data || [], 
        isLoading, 
        error,
        roles: data || [] // Alias for convenience
    };
};

/**
 * Delete a role
 * @param id - Role ID
 * @returns Promise with the delete response
 */
export async function deleteRole(id: number): Promise<{ status: number; data: { message: string } }> {
    const response = await client.delete(`${ENDPOINT.AUTH.ROLES}/${id}`);
    return response.data;
}

/**
 * React Query mutation hook for deleting roles
 * @returns Mutation object with mutate function and state
 */
export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteRole(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['roles-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Role deleted successfully';
            showSuccess(message, 'The role has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete role', getErrorMessage(error));
        },
    });
};

/**
 * Get role permissions details
 * @param roleId - Role ID
 * @returns Promise with the role permissions details response
 */
export async function getRolePermissionDetails(roleId: number): Promise<RolePermissionDetailsResponse> {
    const response = await client.get(`${ENDPOINT.AUTH.ROLE_PERMISSION_DETAILS}/${roleId}/permission`);
    return response.data;
}

/**
 * Transform role permissions API response to PermissionState format
 * @param data - RolePermissionDetailsData from API (permissions object with snake_case keys)
 * @returns PermissionState object with camelCase keys
 */
export function transformRolePermissionsToState(
    data: RolePermissionDetailsResponse['data']
): PermissionState {
    const result: PermissionState = {};

    // Convert permissions object keys from snake_case to camelCase
    Object.keys(data.permissions).forEach(snakeKey => {
        const camelKey = snakeToCamel(snakeKey);
        result[camelKey] = {
            view: data.permissions[snakeKey].view,
            create: data.permissions[snakeKey].create,
            update: data.permissions[snakeKey].update,
            delete: data.permissions[snakeKey].delete,
        };
    });

    return result;
}

/**
 * React Query hook to get role permissions
 * @param roleId - Role ID
 * @returns Query result with role data (name, description, permissions), isLoading, and error
 */
export const useGetRolePermissions = (roleId: number | string | undefined) => {
    const { data, isLoading, error } = useQuery<{
        name: string;
        description: string;
        permissions: PermissionState;
    }>({
        queryKey: ['role-permissions', roleId],
        queryFn: async () => {
            if (!roleId) throw new Error('Role ID is required');
            const response = await getRolePermissionDetails(Number(roleId));
            return {
                name: response.data.name,
                description: response.data.description,
                permissions: transformRolePermissionsToState(response.data)
            };
        },
        enabled: !!roleId,
        staleTime: 0,
    });

    return { 
        data: data || { name: '', description: '', permissions: {} }, 
        isLoading, 
        error
    };
};

