import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    RolePermissionsResponse,
    RolePermissionsListResponse
} from "@/types";

export async function getRolePermissions(): Promise<RolePermissionsListResponse> {
    const response = await client.get(ENDPOINT.AUTH.ROLE_PERMISSIONS);
    return response.data;
}

export async function getPermissions(): Promise<RolePermissionsResponse> {
    const response = await client.get(ENDPOINT.AUTH.PERMISSIONS);
    return response.data;
}

/**
 * React Query hook to get role permissions list
 * @returns Query result with data, isLoading, and error
 */
export const useGetRolePermissionsList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['role-permissions-list'],
        queryFn: () => getRolePermissions(),
    });

    return { data, isLoading, error };
};

