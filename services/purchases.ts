import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreatePurchasePayload,
    CreatePurchaseResponse,
    CreatePurchaseFormData,
    UpdatePurchaseFormData,
    PurchasesListResponse,
    PurchaseListItem,
    PurchaseType,
    PurchaseDetailApiResponse,
    PurchaseDetailResponse,
    PurchaseSummaryResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// PURCHASE QUERY PARAMS
// ================================
export interface PurchaseQueryParams {
    page?: number
    limit?: number
    sort?: string
    search?: string
    status?: string
    payment_status?: string
    startDate?: string
    endDate?: string
}

// ================================
// TRANSFORM PURCHASE LIST ITEM
// ================================
function transformPurchaseListItem(item: PurchaseListItem): PurchaseType {
    return {
        id: item.purchase_id,
        reference: item.reference,
        supplier_name: item.supplier_name,
        store_name: item.store_name,
        supplierId: String(item.supplier_id),
        status: item.status.toLowerCase() as 'received' | 'pending' | 'orders',
        paymentStatus: item.payment_status.toLowerCase() as 'unpaid' | 'paid',
        paymentMethod: item.paymentmethod_id ? String(item.paymentmethod_id) : undefined,
        grandTotal: parseFloat(item.grand_total),
        created_at: item.created_at
    };
}

// ================================
// GET PURCHASES
// ================================
export async function getPurchases(params: PurchaseQueryParams = {}): Promise<{ purchases: PurchaseType[]; pagination: PurchasesListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search, status, payment_status, startDate, endDate } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (status && status !== 'all') requestParams.status = status
    if (payment_status && payment_status !== 'all') requestParams.payment_status = payment_status
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    
    const response = await client.get<PurchasesListResponse>(ENDPOINT.PURCHASES, {
        params: requestParams
    })
    
    return {
        purchases: response.data.data.map(transformPurchaseListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET PURCHASES HOOK
// ================================
export function useGetPurchases(params: PurchaseQueryParams = {}) {
    
    const { page = 1, limit = 25, sort, search, status, payment_status, startDate, endDate } = params
    
    return useQuery({
        queryKey: ['purchases-list', page, limit, sort, search, status, payment_status, startDate, endDate],
        queryFn: () => getPurchases({ page, limit, sort, search, status, payment_status, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Create a purchase
 * @param payload - Purchase data including purchase object and items array
 * @returns Promise with the created purchase response
 */
export async function createPurchase(payload: CreatePurchasePayload): Promise<CreatePurchaseResponse> {
    const response = await client.post(ENDPOINT.PURCHASES, payload);
    return response.data;
}

/**
 * React Query mutation hook for creating purchases
 * @returns Mutation object with mutate function and state
 */
export function useCreatePurchase() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: createPurchase,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['purchases-list'] });
            showSuccess('Purchase created', 'Purchase created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create purchase', errorMessage);
        },
    });
}

/**
 * Fetch purchase details by ID
 * @param id - Purchase ID
 * @returns Promise with purchase detail response
 */
export async function getPurchaseDetail(id: number): Promise<PurchaseDetailResponse> {
    const response = await client.get<PurchaseDetailApiResponse>(`${ENDPOINT.PURCHASES}/${id}`);
    return response.data.data;
}

// ================================
// USE GET PURCHASE DETAIL HOOK
// ================================
export const useGetPurchaseDetail = (id: number | undefined) => {
    return useQuery({
        queryKey: ['purchase-detail', id],
        queryFn: () => getPurchaseDetail(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// ================================
// DELETE PURCHASE
// ================================
export async function deletePurchase(id: number): Promise<{ status: number; message: string }> {
    const response = await client.delete(`${ENDPOINT.PURCHASES}/${id}`);
    return response.data;
}

// ================================
// USE DELETE PURCHASE HOOK
// ================================
export function useDeletePurchase() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: deletePurchase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases-list'] });
            showSuccess('Purchase deleted', 'Purchase deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to delete purchase', errorMessage);
        },
    });
}

// ================================
// UPDATE PURCHASE
// ================================
export async function updatePurchase(id: number, payload: CreatePurchasePayload): Promise<CreatePurchaseResponse> {
    const response = await client.patch(`${ENDPOINT.PURCHASES}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE PURCHASE HOOK
// ================================
export function useUpdatePurchase() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CreatePurchasePayload }) => 
            updatePurchase(id, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['purchases-list'] });
            queryClient.invalidateQueries({ queryKey: ['purchase-detail', variables.id] });
            showSuccess('Purchase updated', 'Purchase updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update purchase', errorMessage);
        },
    });
}

// ================================
// TRANSFORM FORM DATA TO PAYLOAD
// ================================
export function transformPurchaseFormDataToPayload(
    formData: CreatePurchaseFormData
): CreatePurchasePayload {
    const roundToTwoDecimals = (value: number): number => {
        return Math.round(value * 100) / 100;
    };
    
    return {
        purchase: {
            supplier_id: Number(formData.supplier_id),
            store_id: Number(formData.store_id),
            purchase_date: formData.purchase_date || new Date().toISOString().split('T')[0],
            order_tax: roundToTwoDecimals(formData.order_tax),
            order_discount: roundToTwoDecimals(formData.order_discount),
            shipping: roundToTwoDecimals(formData.shipping),
            grand_total: roundToTwoDecimals(formData.grand_total),
            status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
            payment_status: formData.payment_status.charAt(0).toUpperCase() + formData.payment_status.slice(1),
            note: formData.note || undefined,
            paymentmethod_id: formData.payment_method ? Number(formData.payment_method) : undefined,
            order_tax_type: formData.order_tax_type,
            order_discount_type: formData.order_discount_type,
        },
        items: formData.purchase_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_cost: roundToTwoDecimals(item.net_unit_price),
            tax: roundToTwoDecimals(item.tax),
            discount: roundToTwoDecimals(item.discount),
            subtotal: roundToTwoDecimals(item.subtotal),
            ...(item.variation_id && { variation_id: item.variation_id })
        }))
    };
}

// ================================
// GET PURCHASE SUMMARY
// ================================
export async function getPurchaseSummary(): Promise<PurchaseSummaryResponse> {
    const response = await client.get(`${ENDPOINT.PURCHASES}/summary/cards`);
    return response.data;
}

// ================================
// USE PURCHASE SUMMARY HOOK
// ================================
export function useGetPurchaseSummary() {
    return useQuery({
        queryKey: ['purchase-summary'],
        queryFn: getPurchaseSummary,
    });
}

