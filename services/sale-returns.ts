import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateSaleReturnPayload,
    CreateSaleReturnResponse,
    SaleReturnsListResponse,
    SaleReturnListItem,
    SaleReturnType,
    SingleSaleReturnResponse,
    SaleReturnDetail,
    SaleReturnQueryParams
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// TRANSFORM SALES RETURN LIST ITEM
// ================================
function transformSaleReturnListItem(item: SaleReturnListItem): SaleReturnType {
    return {
        id: item.sale_return_id,
        sale_id: item.sale_id,
        sale_reference: item.sale_reference,
        store_name: item.store_name,
        customer_name: item.customer_name,
        total_refund: item.total_refund,
        reason: item.reason,
        user_name: item.user_name,
        created_at: item.created_at
    };
}

// ================================
// GET SALES RETURNS
// ================================
export async function getSaleReturns(params: SaleReturnQueryParams = {}): Promise<{ saleReturns: SaleReturnType[]; pagination: SaleReturnsListResponse['pagination'] }> {
    const { page = 1, limit = 25, search, store_id, startDate, endDate, sort } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (search) requestParams.search = search
    if (store_id) requestParams.store_id = store_id
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    if (sort) requestParams.sort = sort
    
    const response = await client.get<SaleReturnsListResponse>(ENDPOINT.SALES_RETURN, {
        params: requestParams
    })
    
    return {
        saleReturns: response.data.data.map(transformSaleReturnListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET SALES RETURNS HOOK
// ================================
export function useGetSaleReturns(params: SaleReturnQueryParams = {}) {
    const { page = 1, limit = 25, search, store_id, startDate, endDate, sort } = params
    
    return useQuery({
        queryKey: ['sale-returns-list', page, limit, search, store_id, startDate, endDate, sort],
        queryFn: () => getSaleReturns({ page, limit, search, store_id, startDate, endDate, sort }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// CREATE SALES RETURN
// ================================
export async function createSaleReturn(payload: CreateSaleReturnPayload): Promise<CreateSaleReturnResponse> {
    const response = await client.post(ENDPOINT.SALES_RETURN, payload);
    return response.data;
}

// ================================
// USE CREATE SALES RETURN HOOK
// ================================
export function useCreateSaleReturn() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: createSaleReturn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sale-returns-list'] });
            showSuccess('Sales return created', 'Sales return created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create sales return', errorMessage);
        },
    });
}

// ================================
// GET SALES RETURN DETAIL
// ================================
export async function getSaleReturnDetail(id: number): Promise<SaleReturnDetail> {
    const response = await client.get<SingleSaleReturnResponse>(`${ENDPOINT.SALES_RETURN}/${id}`);
    return response.data.data;
}

// ================================
// USE GET SALES RETURN DETAIL HOOK
// ================================
export function useGetSaleReturnDetail(id: number | undefined) {
    return useQuery({
        queryKey: ['sale-return-detail', id],
        queryFn: () => getSaleReturnDetail(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}
