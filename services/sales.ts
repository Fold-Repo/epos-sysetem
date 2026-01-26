import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateSalePayload,
    CreateSaleResponse,
    CreateSaleFormData,
    SalesListResponse,
    SaleListItem,
    SaleType,
    SaleDetailApiResponse,
    SaleDetailResponse,
    SaleSummaryResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// SALE QUERY PARAMS
// ================================
export interface SaleQueryParams {
    page?: number
    limit?: number
    sort?: string
    search?: string
    status?: string
    payment_status?: string
    store_id?: number
    startDate?: string
    endDate?: string
}

// ================================
// TRANSFORM SALE LIST ITEM
// ================================
function transformSaleListItem(item: SaleListItem): SaleType {
    return {
        id: item.sale_id,
        reference: item.reference,
        customer_name: item.customer_name,
        store_name: item.store_name || undefined,
        customerId: String(item.customer_id),
        status: item.status.toLowerCase() as 'completed' | 'pending' | 'cancelled',
        paymentStatus: item.payment_status.toLowerCase() as 'unpaid' | 'paid',
        paymentMethod: item.paymentmethod_id ? String(item.paymentmethod_id) : undefined,
        grandTotal: parseFloat(item.grand_total),
        created_at: item.created_at
    };
}

// ================================
// GET SALES
// ================================
export async function getSales(params: SaleQueryParams = {}): Promise<{ sales: SaleType[]; pagination: SalesListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search, status, payment_status, store_id, startDate, endDate } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (status && status !== 'all') requestParams.status = status
    if (payment_status && payment_status !== 'all') requestParams.payment_status = payment_status
    if (store_id) requestParams.store_id = store_id
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    
    const response = await client.get<SalesListResponse>(ENDPOINT.SALES, {
        params: requestParams
    })
    
    return {
        sales: response.data.data.map(transformSaleListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET SALES HOOK
// ================================
export function useGetSales(params: SaleQueryParams = {}) {
    const { page = 1, limit = 25, sort, search, status, payment_status, store_id, startDate, endDate } = params
    
    return useQuery({
        queryKey: ['sales-list', page, limit, sort, search, status, payment_status, store_id, startDate, endDate],
        queryFn: () => getSales({ page, limit, sort, search, status, payment_status, store_id, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// CREATE SALE
// ================================
export async function createSale(payload: CreateSalePayload): Promise<CreateSaleResponse> {
    const response = await client.post(ENDPOINT.SALES, payload);
    return response.data;
}

// ================================
// USE CREATE SALE HOOK
// ================================
export function useCreateSale() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: createSale,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales-list'] });
            showSuccess('Sale created', 'Sale created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create sale', errorMessage);
        },
    });
}

// ================================
// GET SALE DETAIL
// ================================
export async function getSaleDetail(id: number): Promise<SaleDetailResponse> {
    const response = await client.get<SaleDetailApiResponse>(`${ENDPOINT.SALES}/${id}`);
    return response.data.data;
}

// ================================
// USE GET SALE DETAIL HOOK
// ================================
export const useGetSaleDetail = (id: number | undefined) => {
    return useQuery({
        queryKey: ['sale-detail', id],
        queryFn: () => getSaleDetail(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// ================================
// DELETE SALE
// ================================
export async function deleteSale(id: number): Promise<{ status: number; message: string }> {
    const response = await client.delete(`${ENDPOINT.SALES}/${id}`);
    return response.data;
}

// ================================
// USE DELETE SALE HOOK
// ================================
export function useDeleteSale() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: deleteSale,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales-list'] });
            showSuccess('Sale deleted', 'Sale deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to delete sale', errorMessage);
        },
    });
}

// ================================
// UPDATE SALE
// ================================
export async function updateSale(id: number, payload: CreateSalePayload): Promise<CreateSaleResponse> {
    const response = await client.patch(`${ENDPOINT.SALES}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE SALE HOOK
// ================================
export function useUpdateSale() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CreateSalePayload }) => 
            updateSale(id, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sales-list'] });
            queryClient.invalidateQueries({ queryKey: ['sale-detail', variables.id] });
            showSuccess('Sale updated', 'Sale updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update sale', errorMessage);
        },
    });
}

// ================================
// TRANSFORM FORM DATA TO PAYLOAD
// ================================
export function transformSaleFormDataToPayload(
    formData: CreateSaleFormData
): CreateSalePayload {
    const roundToTwoDecimals = (value: number): number => {
        return Math.round(value * 100) / 100;
    };
    
    return {
        store_id: Number(formData.store_id),
        customer_id: Number(formData.customer_id),
        order_tax: roundToTwoDecimals(formData.order_tax),
        order_discount: roundToTwoDecimals(formData.order_discount),
        shipping: roundToTwoDecimals(formData.shipping),
        grand_total: roundToTwoDecimals(formData.grand_total),
        status: formData.status.toLowerCase(),
        payment_status: formData.payment_status.toLowerCase(),
        note: formData.note || undefined,
        paymentmethod_id: formData.payment_method ? Number(formData.payment_method) : undefined,
        order_tax_type: formData.order_tax_type,
        order_discount_type: formData.order_discount_type,
        items: formData.sale_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: roundToTwoDecimals(item.net_unit_price),
            tax: roundToTwoDecimals(item.tax),
            discount: roundToTwoDecimals(item.discount),
            subtotal: roundToTwoDecimals(item.subtotal),
            ...(item.variation_id && { variation_id: item.variation_id }),
            ...(item.sale_item_id && { sale_item_id: item.sale_item_id })
        }))
    };
}

// ================================
// GET SALE SUMMARY
// ================================
export async function getSaleSummary(): Promise<SaleSummaryResponse> {
    const response = await client.get(`${ENDPOINT.SALES}/summary/cards`);
    return response.data;
}

// ================================
// USE SALE SUMMARY HOOK
// ================================
export function useGetSaleSummary() {
    return useQuery({
        queryKey: ['sale-summary'],
        queryFn: getSaleSummary,
    });
}

// ================================
// DOWNLOAD SALE PDF
// ================================
export async function downloadSalePDF(id: number): Promise<void> {
    const response = await client.get(`${ENDPOINT.SALES}/${id}/pdf`, {
        responseType: 'blob',
    });
    
    // Create a blob URL from the response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `sale-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
