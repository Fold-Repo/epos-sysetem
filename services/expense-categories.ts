import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateExpenseCategoryPayload, 
    CreateExpenseCategoryResponse, 
    ExpenseCategoriesListResponse, 
    ExpenseCategory,
    UpdateExpenseCategoryPayload,
    UpdateExpenseCategoryResponse,
    DeleteExpenseCategoryResponse,
    ActiveExpenseCategoriesResponse,
    ActiveExpenseCategory
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all expense categories
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 200 for Redux state)
 * @returns Promise with the expense categories list response
 */
export async function getExpenseCategories(page: number = 1, limit: number = 200): Promise<ExpenseCategoriesListResponse> {
    const response = await client.get(ENDPOINT.EXPENSE_CATEGORIES, {
        params: { page, limit }
    });
    return response.data;
}

/**
 * Get active expense categories
 * @returns Promise with the active expense categories response
 */
export async function getActiveExpenseCategories(): Promise<ActiveExpenseCategoriesResponse> {
    const response = await client.get(`${ENDPOINT.EXPENSE_CATEGORIES}/active`);
    return response.data;
}

/**
 * Create an expense category
 * @param payload - Expense category data including name, description, and is_active
 * @returns Promise with the created expense category response
 */
export async function createExpenseCategory(payload: CreateExpenseCategoryPayload): Promise<CreateExpenseCategoryResponse> {
    const response = await client.post(ENDPOINT.EXPENSE_CATEGORIES, payload);
    return response.data;
}

/**
 * Update an expense category
 * @param id - Expense category ID
 * @param payload - Expense category data including name, description, and is_active
 * @returns Promise with the updated expense category response
 */
export async function updateExpenseCategory(id: number, payload: UpdateExpenseCategoryPayload): Promise<UpdateExpenseCategoryResponse> {
    const response = await client.patch(`${ENDPOINT.EXPENSE_CATEGORIES}/${id}`, payload);
    return response.data;
}

/**
 * Delete an expense category
 * @param id - Expense category ID
 * @returns Promise with the delete response
 */
export async function deleteExpenseCategory(id: number): Promise<DeleteExpenseCategoryResponse> {
    const response = await client.delete(`${ENDPOINT.EXPENSE_CATEGORIES}/${id}`);
    return response.data;
}

/**
 * React Query hook to get expense categories list with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 25)
 * @returns Query result with data (ExpenseCategory[]), pagination, isLoading, and error
 */
export const useGetExpenseCategories = (page: number = 1, limit: number = 25) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['expense-categories-list', page, limit],
        queryFn: async () => {
            const response = await getExpenseCategories(page, limit);
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
 * React Query hook to get active expense categories
 * @returns Query result with data (ActiveExpenseCategory[]), isLoading, and error
 */
export const useGetActiveExpenseCategories = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['expense-categories-active'],
        queryFn: async () => {
            const response = await getActiveExpenseCategories();
            return response.data;
        },
    });

    return { 
        data: data || [], 
        isLoading, 
        error,
        activeCategories: data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating expense categories
 * @returns Mutation object with mutate function and state
 */
export const useCreateExpenseCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (categoryData: CreateExpenseCategoryPayload) => createExpenseCategory(categoryData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['expense-categories-list'] });
            queryClient.invalidateQueries({ queryKey: ['expense-categories-active'] });

            // ==============================
            // Show success message
            // ==============================
            const message = data.message || 'Expense category created successfully';
            showSuccess(message, 'The expense category has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating expense categories
 * @returns Mutation object with mutate function and state
 */
export const useUpdateExpenseCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, categoryData }: { id: number; categoryData: UpdateExpenseCategoryPayload }) => 
            updateExpenseCategory(id, categoryData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['expense-categories-list'] });
            queryClient.invalidateQueries({ queryKey: ['expense-categories-active'] });

            // ==============================
            // Show success message
            // ==============================
            const message = data.message || 'Expense category updated successfully';
            showSuccess(message, 'The expense category has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update expense category', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting expense categories
 * @returns Mutation object with mutate function and state
 */
export const useDeleteExpenseCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteExpenseCategory(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['expense-categories-list'] });
            queryClient.invalidateQueries({ queryKey: ['expense-categories-active'] });

            // ==============================
            // Show success message
            // ==============================
            const message = data.message || 'Expense category deleted successfully';
            showSuccess(message, 'The expense category has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete expense category', getErrorMessage(error));
        },
    });
};
