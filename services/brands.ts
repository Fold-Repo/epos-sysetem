import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateBrandPayload, 
    CreateBrandResponse, 
    BrandsListResponse, 
    Brand,
    UpdateBrandResponse,
    DeleteBrandResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all brands
 * @returns Promise with the brands list response
 */
export async function getBrands(): Promise<BrandsListResponse> {
    const response = await client.get(ENDPOINT.BRANDS);
    return response.data;
}

/**
 * Create a brand
 * @param payload - Brand data including name and short_name
 * @returns Promise with the created brand response
 */
export async function createBrand(payload: CreateBrandPayload): Promise<CreateBrandResponse> {
    const response = await client.post(ENDPOINT.BRANDS, payload);
    return response.data;
}

/**
 * Update a brand
 * @param id - Brand ID
 * @param payload - Brand data including name and short_name
 * @returns Promise with the updated brand response
 */
export async function updateBrand(id: number, payload: CreateBrandPayload): Promise<UpdateBrandResponse> {
    const response = await client.patch(`${ENDPOINT.BRANDS}/${id}`, payload);
    return response.data;
}

/**
 * Delete a brand
 * @param id - Brand ID
 * @returns Promise with the delete response
 */
export async function deleteBrand(id: number): Promise<DeleteBrandResponse> {
    const response = await client.delete(`${ENDPOINT.BRANDS}/${id}`);
    return response.data;
}

/**
 * React Query hook to get brands list
 * @returns Query result with data (Brand[]), isLoading, and error
 */
export const useGetBrands = () => {
    const { data, isLoading, error } = useQuery<Brand[]>({
        queryKey: ['brands-list'],
        queryFn: async () => {
            const response = await getBrands();
            return response.data;
        },
    });

    return { 
        data: data || [], 
        isLoading, 
        error,
        brands: data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating brands
 * @returns Mutation object with mutate function and state
 */
export const useCreateBrand = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (brandData: CreateBrandPayload) => createBrand(brandData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['brands-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Brand created successfully';
            showSuccess(message, 'The brand has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating brands
 * @returns Mutation object with mutate function and state
 */
export const useUpdateBrand = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, brandData }: { id: number; brandData: CreateBrandPayload }) => 
            updateBrand(id, brandData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['brands-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Brand updated successfully';
            showSuccess(message, 'The brand has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update brand', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting brands
 * @returns Mutation object with mutate function and state
 */
export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteBrand(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['brands-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Brand deleted successfully';
            showSuccess(message, 'The brand has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete brand', getErrorMessage(error));
        },
    });
};

