import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreatePurchaseReturnPayload,
    CreatePurchaseReturnResponse,
    PurchaseReturnsListResponse,
    PurchaseReturnListItem,
    PurchaseReturnType,
    SinglePurchaseReturnResponse,
    PurchaseReturnDetail,
    PurchaseReturnQueryParams
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// TRANSFORM PURCHASE RETURN LIST ITEM
// ================================
function transformPurchaseReturnListItem(item: PurchaseReturnListItem): PurchaseReturnType {
    return {
        id: item.purchase_return_id,
        purchase_id: item.purchase_id,
        purchase_reference: item.purchase_reference,
        store_name: item.store_name,
        supplier_name: item.supplier_name,
        total_deducted: item.total_deducted,
        reason: item.reason,
        user_name: item.user_name,
        created_at: item.created_at
    };
}

// ================================
// GET PURCHASE RETURNS
// ================================
export async function getPurchaseReturns(params: PurchaseReturnQueryParams = {}): Promise<{ purchaseReturns: PurchaseReturnType[]; pagination: PurchaseReturnsListResponse['pagination'] }> {
    const { page = 1, limit = 25, search, store_id, startDate, endDate, sort } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (search) requestParams.search = search
    if (store_id) requestParams.store_id = store_id
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    if (sort) requestParams.sort = sort
    
    const response = await client.get<PurchaseReturnsListResponse>(ENDPOINT.PURCHASES_RETURN, {
        params: requestParams
    })
    
    return {
        purchaseReturns: response.data.data.map(transformPurchaseReturnListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET PURCHASE RETURNS HOOK
// ================================
export function useGetPurchaseReturns(params: PurchaseReturnQueryParams = {}) {
    const { page = 1, limit = 25, search, store_id, startDate, endDate, sort } = params
    
    return useQuery({
        queryKey: ['purchase-returns-list', page, limit, search, store_id, startDate, endDate, sort],
        queryFn: () => getPurchaseReturns({ page, limit, search, store_id, startDate, endDate, sort }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// CREATE PURCHASE RETURN
// ================================
export async function createPurchaseReturn(payload: CreatePurchaseReturnPayload): Promise<CreatePurchaseReturnResponse> {
    const response = await client.post(ENDPOINT.PURCHASES_RETURN, payload);
    return response.data;
}

// ================================
// USE CREATE PURCHASE RETURN HOOK
// ================================
export function useCreatePurchaseReturn() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: createPurchaseReturn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-returns-list'] });
            showSuccess('Purchase return created', 'Purchase return created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create purchase return', errorMessage);
        },
    });
}

// ================================
// GET PURCHASE RETURN DETAIL
// ================================
export async function getPurchaseReturnDetail(id: number): Promise<PurchaseReturnDetail> {
    const response = await client.get<SinglePurchaseReturnResponse>(`${ENDPOINT.PURCHASES_RETURN}/${id}`);
    return response.data.data;
}

// ================================
// USE GET PURCHASE RETURN DETAIL HOOK
// ================================
export function useGetPurchaseReturnDetail(id: number | undefined) {
    return useQuery({
        queryKey: ['purchase-return-detail', id],
        queryFn: () => getPurchaseReturnDetail(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}
