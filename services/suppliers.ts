import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateSupplierPayload, 
    CreateSupplierResponse, 
    SuppliersListResponse, 
    Supplier,
    UpdateSupplierResponse,
    DeleteSupplierResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all suppliers
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 200 for Redux state)
 * @returns Promise with the suppliers list response
 */
export async function getSuppliers(page: number = 1, limit: number = 200): Promise<SuppliersListResponse> {
    const response = await client.get(ENDPOINT.SUPPLIERS, {
        params: { page, limit }
    });
    return response.data;
}

/**
 * Create a supplier
 * @param payload - Supplier data including name, email, phone, and address
 * @returns Promise with the created supplier response
 */
export async function createSupplier(payload: CreateSupplierPayload): Promise<CreateSupplierResponse> {
    const response = await client.post(ENDPOINT.SUPPLIERS, payload);
    return response.data;
}

/**
 * Update a supplier
 * @param id - Supplier ID
 * @param payload - Supplier data including name, email, phone, and address
 * @returns Promise with the updated supplier response
 */
export async function updateSupplier(id: number, payload: CreateSupplierPayload): Promise<UpdateSupplierResponse> {
    const response = await client.patch(`${ENDPOINT.SUPPLIERS}/${id}`, payload);
    return response.data;
}

/**
 * Delete a supplier
 * @param id - Supplier ID
 * @returns Promise with the delete response
 */
export async function deleteSupplier(id: number): Promise<DeleteSupplierResponse> {
    const response = await client.delete(`${ENDPOINT.SUPPLIERS}/${id}`);
    return response.data;
}

/**
 * React Query hook to get suppliers list with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 25)
 * @returns Query result with data (Supplier[]), pagination, isLoading, and error
 */
export const useGetSuppliers = (page: number = 1, limit: number = 25) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['suppliers-list', page, limit],
        queryFn: async () => {
            const response = await getSuppliers(page, limit);
            return {
                data: response.data,
                pagination: response.pagination
            };
        },
    });

    return { 
        data: data?.data || [], 
        pagination: data?.pagination,
        isLoading, 
        error,
        suppliers: data?.data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating suppliers
 * @returns Mutation object with mutate function and state
 */
export const useCreateSupplier = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (supplierData: CreateSupplierPayload) => createSupplier(supplierData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['suppliers-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Supplier created successfully';
            showSuccess(message, 'The supplier has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating suppliers
 * @returns Mutation object with mutate function and state
 */
export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, supplierData }: { id: number; supplierData: CreateSupplierPayload }) => 
            updateSupplier(id, supplierData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['suppliers-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Supplier updated successfully';
            showSuccess(message, 'The supplier has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update supplier', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting suppliers
 * @returns Mutation object with mutate function and state
 */
export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteSupplier(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['suppliers-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Supplier deleted successfully';
            showSuccess(message, 'The supplier has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete supplier', getErrorMessage(error));
        },
    });
};

