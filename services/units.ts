import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateUnitPayload, 
    CreateUnitResponse, 
    UnitsListResponse, 
    Unit,
    UpdateUnitResponse,
    DeleteUnitResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Get all units
 * @returns Promise with the units list response
 */
export async function getUnits(): Promise<UnitsListResponse> {
    const response = await client.get(ENDPOINT.UNITS);
    return response.data;
}

/**
 * Create a unit
 * @param payload - Unit data including name and short_name
 * @returns Promise with the created unit response
 */
export async function createUnit(payload: CreateUnitPayload): Promise<CreateUnitResponse> {
    const response = await client.post(ENDPOINT.UNITS, payload);
    return response.data;
}

/**
 * Update a unit
 * @param id - Unit ID
 * @param payload - Unit data including name and short_name
 * @returns Promise with the updated unit response
 */
export async function updateUnit(id: number, payload: CreateUnitPayload): Promise<UpdateUnitResponse> {
    const response = await client.patch(`${ENDPOINT.UNITS}/${id}`, payload);
    return response.data;
}

/**
 * Delete a unit
 * @param id - Unit ID
 * @returns Promise with the delete response
 */
export async function deleteUnit(id: number): Promise<DeleteUnitResponse> {
    const response = await client.delete(`${ENDPOINT.UNITS}/${id}`);
    return response.data;
}

/**
 * React Query hook to get units list
 * @returns Query result with data (Unit[]), isLoading, and error
 */
export const useGetUnits = () => {
    const { data, isLoading, error } = useQuery<Unit[]>({
        queryKey: ['units-list'],
        queryFn: async () => {
            const response = await getUnits();
            return response.data;
        },
    });

    return { 
        data: data || [], 
        isLoading, 
        error,
        units: data || [] // Alias for convenience
    };
};

/**
 * React Query mutation hook for creating units
 * @returns Mutation object with mutate function and state
 */
export const useCreateUnit = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (unitData: CreateUnitPayload) => createUnit(unitData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['units-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Unit created successfully';
            showSuccess(message, 'The unit has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for updating units
 * @returns Mutation object with mutate function and state
 */
export const useUpdateUnit = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, unitData }: { id: number; unitData: CreateUnitPayload }) => 
            updateUnit(id, unitData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['units-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Unit updated successfully';
            showSuccess(message, 'The unit has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update unit', getErrorMessage(error));
        },
    });
};

/**
 * React Query mutation hook for deleting units
 * @returns Mutation object with mutate function and state
 */
export const useDeleteUnit = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteUnit(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['units-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Unit deleted successfully';
            showSuccess(message, 'The unit has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete unit', getErrorMessage(error));
        },
    });
};

