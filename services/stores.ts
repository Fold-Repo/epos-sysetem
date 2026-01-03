import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { CreateStorePayload, CreateStoreResponse, StoresListResponse, StoreListItem } from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { StoreType } from "@/types";

/**
 * Create a store
 * @param payload - Store data including name and description
 * @returns Promise with the created store response
 */
export async function createStore(payload: CreateStorePayload): Promise<CreateStoreResponse> {
    const response = await client.post(ENDPOINT.STORES.BASE, payload);
    return response.data;
}

/**
 * Get all stores
 * @returns Promise with the stores list response
 */
export async function getStores(): Promise<StoresListResponse> {
    const response = await client.get(ENDPOINT.STORES.BASE);
    return response.data;
}

/**
 * Transform API store response to StoreType
 * @param store - StoreListItem from API
 * @returns StoreType for use in components
 */
function transformStoreToStoreType(store: StoreListItem): StoreType {
    return {
        id: store.store_id,
        name: store.name,
        description: store.description,
        status: store.status as 'active' | 'inactive' | undefined,
        created_at: store.created_at,
    };
}

/**
 * React Query mutation hook for creating stores
 * @returns Mutation object with mutate function and state
 */
export const useCreateStore = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (storeData: CreateStorePayload) => createStore(storeData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['stores-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Store created successfully';
            showSuccess(message, 'The store has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query hook to get stores list
 * @returns Query result with data (StoreType[]), isLoading, and error
 */
export const useGetStores = () => {
    const { data, isLoading, error } = useQuery<StoreType[]>({
        queryKey: ['stores-list'],
        queryFn: async () => {
            const response = await getStores();
            // Transform the API response to match StoreType
            return response.data.map(transformStoreToStoreType);
        },
    });

    return { 
        data: data || [], 
        isLoading, 
        error,
        stores: data || [] // Alias for convenience
    };
};

/**
 * Update a store
 * @param id - Store ID
 * @param payload - Store data including name and description
 * @returns Promise with the updated store response
 */
export async function updateStore(id: number, payload: CreateStorePayload): Promise<CreateStoreResponse> {
    const response = await client.patch(`${ENDPOINT.STORES.BASE}/${id}`, payload);
    return response.data;
}

/**
 * Delete a store
 * @param id - Store ID
 * @returns Promise with the delete response
 */
export async function deleteStore(id: number): Promise<{ status: number; message: string }> {
    const response = await client.delete(`${ENDPOINT.STORES.BASE}/${id}`);
    return response.data;
}

/**
 * React Query mutation hook for updating stores
 * @returns Mutation object with mutate function and state
 */
export const useUpdateStore = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, storeData }: { id: number; storeData: CreateStorePayload }) => 
            updateStore(id, storeData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['stores-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Store updated successfully';
            showSuccess(message, 'The store has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update store', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting stores
 * @returns Mutation object with mutate function and state
 */
export const useDeleteStore = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteStore(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['stores-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Store deleted successfully';
            showSuccess(message, 'The store has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete store', getErrorMessage(error));
        },
    });
};

