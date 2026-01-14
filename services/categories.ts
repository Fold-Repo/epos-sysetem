import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateCategoryPayload, 
    CreateCategoryResponse, 
    CategoriesListResponse, 
    Category,
    UpdateCategoryResponse,
    DeleteCategoryResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all categories
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 200 for Redux state)
 * @returns Promise with the categories list response
 */
export async function getCategories(page: number = 1, limit: number = 200): Promise<CategoriesListResponse> {
    const response = await client.get(ENDPOINT.CATEGORIES, {
        params: { page, limit }
    });
    return response.data;
}

/**
 * Create a category
 * @param payload - Category data including category_name, description, and image
 * @returns Promise with the created category response
 */
export async function createCategory(payload: CreateCategoryPayload): Promise<CreateCategoryResponse> {
    const response = await client.post(ENDPOINT.CATEGORIES, payload);
    return response.data;
}

/**
 * Update a category
 * @param id - Category ID
 * @param payload - Category data including category_name, description, and image
 * @returns Promise with the updated category response
 */
export async function updateCategory(id: number, payload: CreateCategoryPayload): Promise<UpdateCategoryResponse> {
    const response = await client.patch(`${ENDPOINT.CATEGORIES}/${id}`, payload);
    return response.data;
}

/**
 * Delete a category
 * @param id - Category ID
 * @returns Promise with the delete response
 */
export async function deleteCategory(id: number): Promise<DeleteCategoryResponse> {
    const response = await client.delete(`${ENDPOINT.CATEGORIES}/${id}`);
    return response.data;
}

/**
 * React Query hook to get categories list with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 25)
 * @returns Query result with data (Category[]), pagination, isLoading, and error
 */
export const useGetCategories = (page: number = 1, limit: number = 25) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['categories-list', page, limit],
        queryFn: async () => {
            const response = await getCategories(page, limit);
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
        categories: data?.data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating categories
 * @returns Mutation object with mutate function and state
 */
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (categoryData: CreateCategoryPayload) => createCategory(categoryData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['categories-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Category created successfully';
            showSuccess(message, 'The category has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating categories
 * @returns Mutation object with mutate function and state
 */
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, categoryData }: { id: number; categoryData: CreateCategoryPayload }) => 
            updateCategory(id, categoryData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['categories-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Category updated successfully';
            showSuccess(message, 'The category has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update category', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting categories
 * @returns Mutation object with mutate function and state
 */
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['categories-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Category deleted successfully';
            showSuccess(message, 'The category has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete category', getErrorMessage(error));
        },
    });
};

