import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateVariationPayload, 
    CreateVariationResponse, 
    VariationsListResponse, 
    Variation,
    UpdateVariationResponse,
    DeleteVariationResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all variations
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 200 for Redux state)
 * @returns Promise with the variations list response
 */
export async function getVariations(page: number = 1, limit: number = 200): Promise<VariationsListResponse> {
    const response = await client.get(ENDPOINT.VARIATIONS, {
        params: { page, limit }
    });
    return response.data;
}

/**
 * Create a variation
 * @param payload - Variation data including name and options array
 * @returns Promise with the created variation response
 */
export async function createVariation(payload: CreateVariationPayload): Promise<CreateVariationResponse> {
    const response = await client.post(ENDPOINT.VARIATIONS, payload);
    return response.data;
}

/**
 * Update a variation
 * @param id - Variation ID
 * @param payload - Variation data including name and options array
 * @returns Promise with the updated variation response
 */
export async function updateVariation(id: number, payload: CreateVariationPayload): Promise<UpdateVariationResponse> {
    const response = await client.patch(`${ENDPOINT.VARIATIONS}/${id}`, payload);
    return response.data;
}

/**
 * Delete a variation
 * @param id - Variation ID
 * @returns Promise with the delete response
 */
export async function deleteVariation(id: number): Promise<DeleteVariationResponse> {
    const response = await client.delete(`${ENDPOINT.VARIATIONS}/${id}`);
    return response.data;
}

/**
 * React Query hook to get variations list with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 25)
 * @returns Query result with data (Variation[]), pagination, isLoading, and error
 */
export const useGetVariations = (page: number = 1, limit: number = 25) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['variations-list', page, limit],
        queryFn: async () => {
            const response = await getVariations(page, limit);
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
        variations: data?.data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating variations
 * @returns Mutation object with mutate function and state
 */
export const useCreateVariation = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (variationData: CreateVariationPayload) => createVariation(variationData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['variations-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Variation created successfully';
            showSuccess(message, 'The variation has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating variations
 * @returns Mutation object with mutate function and state
 */
export const useUpdateVariation = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, variationData }: { id: number; variationData: CreateVariationPayload }) => 
            updateVariation(id, variationData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['variations-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Variation updated successfully';
            showSuccess(message, 'The variation has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update variation', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting variations
 * @returns Mutation object with mutate function and state
 */
export const useDeleteVariation = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteVariation(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['variations-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Variation deleted successfully';
            showSuccess(message, 'The variation has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete variation', getErrorMessage(error));
        },
    });
};

