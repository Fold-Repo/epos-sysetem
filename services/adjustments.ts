import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateAdjustmentPayload,
    CreateAdjustmentResponse,
    CreateAdjustmentFormData,
    AdjustmentsListResponse,
    AdjustmentListItem,
    AdjustmentType,
    AdjustmentDetailApiResponse,
    AdjustmentDetailResponse,
    AdjustmentQueryParams
} from "@/types/adjustment.type";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// TRANSFORM ADJUSTMENT LIST ITEM
// ================================
function transformAdjustmentListItem(item: AdjustmentListItem): AdjustmentType {
    return {
        id: item.adjustment_id,
        date: item.date,
        type: item.type,
        note: item.note,
        created_at: item.created_at,
        created_by_name: item.created_by_name
    };
}

// ================================
// GET ADJUSTMENTS
// ================================
export async function getAdjustments(params: AdjustmentQueryParams = {}): Promise<{ adjustments: AdjustmentType[]; pagination: AdjustmentsListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search, type, startDate, endDate } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (type && type !== 'all') requestParams.type = type
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    
    const response = await client.get<AdjustmentsListResponse>(ENDPOINT.ADJUSTMENTS, {
        params: requestParams
    })
    
    return {
        adjustments: response.data.data.map(transformAdjustmentListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET ADJUSTMENTS HOOK
// ================================
export function useGetAdjustments(params: AdjustmentQueryParams = {}) {
    const { page = 1, limit = 25, sort, search, type, startDate, endDate } = params
    
    return useQuery({
        queryKey: ['adjustments-list', page, limit, sort, search, type, startDate, endDate],
        queryFn: () => getAdjustments({ page, limit, sort, search, type, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// TRANSFORM FORM DATA TO PAYLOAD
// ================================
export function transformAdjustmentFormDataToPayload(
    formData: CreateAdjustmentFormData
): CreateAdjustmentPayload {
    return {
        date: formData.date,
        note: formData.note || undefined,
        items: formData.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            type: item.type,
            ...(item.variation_id && { variation_id: item.variation_id })
        }))
    };
}

// ================================
// CREATE ADJUSTMENT
// ================================
export async function createAdjustment(payload: CreateAdjustmentPayload): Promise<CreateAdjustmentResponse> {
    const response = await client.post(ENDPOINT.ADJUSTMENTS, payload);
    return response.data;
}

// ================================
// USE CREATE ADJUSTMENT HOOK
// ================================
export function useCreateAdjustment() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: (payload: CreateAdjustmentPayload) => createAdjustment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adjustments-list'] });
            showSuccess('Adjustment created', 'Adjustment created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create adjustment', errorMessage);
        },
    });
}

// ================================
// GET ADJUSTMENT DETAIL
// ================================
export async function getAdjustmentDetail(id: number): Promise<AdjustmentDetailResponse> {
    const response = await client.get<AdjustmentDetailApiResponse>(`${ENDPOINT.ADJUSTMENTS}/${id}`);
    return response.data.data;
}

// ================================
// USE GET ADJUSTMENT DETAIL HOOK
// ================================
export function useGetAdjustmentDetail(id: number) {
    return useQuery({
        queryKey: ['adjustment-detail', id],
        queryFn: () => getAdjustmentDetail(id),
        enabled: !!id,
    });
}

// ================================
// UPDATE ADJUSTMENT
// ================================
export async function updateAdjustment(id: number, payload: CreateAdjustmentPayload): Promise<CreateAdjustmentResponse> {
    const response = await client.patch(`${ENDPOINT.ADJUSTMENTS}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE ADJUSTMENT HOOK
// ================================
export function useUpdateAdjustment() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CreateAdjustmentPayload }) => 
            updateAdjustment(id, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adjustments-list'] });
            queryClient.invalidateQueries({ queryKey: ['adjustment-detail', variables.id] });
            showSuccess('Adjustment updated', 'Adjustment updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update adjustment', errorMessage);
        },
    });
}

