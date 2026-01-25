import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateTransferPayload,
    CreateTransferResponse,
    TransfersListResponse,
    Transfer,
    TransferType,
    UpdateTransferPayload,
    UpdateTransferResponse,
    DeleteTransferResponse,
    SingleTransferResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// TRANSFORM TRANSFER LIST ITEM
// ================================
function transformTransferListItem(item: Transfer): TransferType {
    return {
        id: String(item.transfer_id),
        transfer_id: item.transfer_id,
        from_store_id: item.from_store_id,
        from_store_name: item.from_store_name,
        to_store_id: item.to_store_id,
        to_store_name: item.to_store_name,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        variation_id: item.variation_id,
        variation_type: item.variation_type,
        variation_value: item.variation_value,
        quantity: item.quantity,
        status: item.status,
        notes: item.notes,
        created_by: item.created_by,
        created_by_name: item.created_by_name,
        received_by: item.received_by,
        received_by_name: item.received_by_name,
        transferred_at: item.transferred_at,
        received_at: item.received_at,
        created_at: item.created_at,
        updated_at: item.updated_at
    };
}

// ================================
// GET TRANSFERS
// ================================
export interface TransferQueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export async function getTransfers(params: TransferQueryParams = {}): Promise<{ transfers: TransferType[]; pagination: TransfersListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search, status, startDate, endDate } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (status) requestParams.status = status
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    
    const response = await client.get<TransfersListResponse>(ENDPOINT.TRANSFERS, {
        params: requestParams
    })
    
    return {
        transfers: response.data.data.map(transformTransferListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET TRANSFERS HOOK
// ================================
export function useGetTransfers(params: TransferQueryParams = {}) {
    const { page = 1, limit = 25, sort, search, status, startDate, endDate } = params
    
    return useQuery({
        queryKey: ['transfers-list', page, limit, sort, search, status, startDate, endDate],
        queryFn: () => getTransfers({ page, limit, sort, search, status, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// CREATE TRANSFER
// ================================
export async function createTransfer(payload: CreateTransferPayload): Promise<CreateTransferResponse> {
    const response = await client.post(ENDPOINT.TRANSFERS, payload);
    return response.data;
}

// ================================
// USE CREATE TRANSFER HOOK
// ================================
export function useCreateTransfer() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: (payload: CreateTransferPayload) => createTransfer(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers-list'] });
            showSuccess('Transfer created', 'Transfer created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create transfer', errorMessage);
        },
    });
}

// ================================
// GET TRANSFER DETAIL
// ================================
export async function getTransferDetail(id: number): Promise<Transfer> {
    const response = await client.get<SingleTransferResponse>(`${ENDPOINT.TRANSFERS}/${id}`);
    return response.data.data;
}

// ================================
// USE GET TRANSFER DETAIL HOOK
// ================================
export function useGetTransferDetail(id: number) {
    return useQuery({
        queryKey: ['transfer-detail', id],
        queryFn: () => getTransferDetail(id),
        enabled: !!id,
    });
}

// ================================
// UPDATE TRANSFER
// ================================
export async function updateTransfer(id: number, payload: UpdateTransferPayload): Promise<UpdateTransferResponse> {
    const response = await client.patch(`${ENDPOINT.TRANSFERS}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE TRANSFER HOOK
// ================================
export function useUpdateTransfer() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateTransferPayload }) => 
            updateTransfer(id, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['transfers-list'] });
            queryClient.invalidateQueries({ queryKey: ['transfer-detail', variables.id] });
            showSuccess('Transfer updated', 'Transfer updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update transfer', errorMessage);
        },
    });
}

// ================================
// DELETE TRANSFER
// ================================
export async function deleteTransfer(id: number): Promise<DeleteTransferResponse> {
    const response = await client.delete(`${ENDPOINT.TRANSFERS}/${id}`);
    return response.data;
}

// ================================
// USE DELETE TRANSFER HOOK
// ================================
export function useDeleteTransfer() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: deleteTransfer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers-list'] });
            showSuccess('Transfer deleted', 'Transfer deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to delete transfer', errorMessage);
        },
    });
}