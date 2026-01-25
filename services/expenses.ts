import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateExpensePayload, 
    CreateExpenseResponse, 
    ExpensesListResponse, 
    Expense,
    UpdateExpensePayload,
    UpdateExpenseResponse,
    DeleteExpenseResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all expenses
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 25)
 * @param params - Optional query parameters (category_id, status, search, etc.)
 * @returns Promise with the expenses list response
 */
export async function getExpenses(
    page: number = 1, 
    limit: number = 25,
    params?: {
        category_id?: number;
        status?: string;
        search?: string;
        sort?: string;
        start_date?: string;
        end_date?: string;
    }
): Promise<ExpensesListResponse> {
    const response = await client.get(ENDPOINT.EXPENSES, {
        params: { page, limit, ...params }
    });
    return response.data;
}

/**
 * Create an expense
 * @param payload - Expense data
 * @returns Promise with the created expense response
 */
export async function createExpense(payload: CreateExpensePayload): Promise<CreateExpenseResponse> {
    const response = await client.post(ENDPOINT.EXPENSES, payload);
    return response.data;
}

/**
 * Update an expense
 * @param id - Expense ID
 * @param payload - Expense data
 * @returns Promise with the updated expense response
 */
export async function updateExpense(id: number, payload: UpdateExpensePayload): Promise<UpdateExpenseResponse> {
    const response = await client.patch(`${ENDPOINT.EXPENSES}/${id}`, payload);
    return response.data;
}

/**
 * Delete an expense
 * @param id - Expense ID
 * @returns Promise with the delete response
 */
export async function deleteExpense(id: number): Promise<DeleteExpenseResponse> {
    const response = await client.delete(`${ENDPOINT.EXPENSES}/${id}`);
    return response.data;
}

/**
 * React Query hook to get expenses list with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 25)
 * @param params - Optional query parameters
 * @returns Query result with data (Expense[]), pagination, isLoading, and error
 */
export const useGetExpenses = (
    page: number = 1, 
    limit: number = 25,
    params?: {
        category_id?: number;
        status?: string;
        search?: string;
        sort?: string;
        start_date?: string;
        end_date?: string;
    }
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['expenses-list', page, limit, params],
        queryFn: async () => {
            const response = await getExpenses(page, limit, params);
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
        expenses: data?.data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating expenses
 * @returns Mutation object with mutate function and state
 */
export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (expenseData: CreateExpensePayload) => createExpense(expenseData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['expenses-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = data.message || 'Expense created successfully';
            showSuccess(message, 'The expense has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating expenses
 * @returns Mutation object with mutate function and state
 */
export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, expenseData }: { id: number; expenseData: UpdateExpensePayload }) => 
            updateExpense(id, expenseData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['expenses-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = data.message || 'Expense updated successfully';
            showSuccess(message, 'The expense has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update expense', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting expenses
 * @returns Mutation object with mutate function and state
 */
export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteExpense(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['expenses-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = data.message || 'Expense deleted successfully';
            showSuccess(message, 'The expense has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete expense', getErrorMessage(error));
        },
    });
};
