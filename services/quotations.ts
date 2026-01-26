import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CreateQuotationPayload,
    CreateQuotationResponse,
    CreateQuotationFormData,
    QuotationsListResponse,
    QuotationListItem,
    QuotationType,
    QuotationDetailApiResponse,
    QuotationDetailResponse,
    QuotationSummaryResponse
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// QUOTATION QUERY PARAMS
// ================================
export interface QuotationQueryParams {
    page?: number
    limit?: number
    sort?: string
    search?: string
    status?: string
    store_id?: number
    startDate?: string
    endDate?: string
}

// ================================
// TRANSFORM QUOTATION LIST ITEM
// ================================
function transformQuotationListItem(item: QuotationListItem): QuotationType {
    return {
        id: item.quotation_id,
        reference: item.reference,
        customer_name: item.customer_name,
        store_name: item.store_name || undefined,
        customerId: String(item.customer_id),
        status: item.status.toLowerCase(),
        grandTotal: parseFloat(item.grand_total),
        created_at: item.created_at
    };
}

// ================================
// GET QUOTATIONS
// ================================
export async function getQuotations(params: QuotationQueryParams = {}): Promise<{ quotations: QuotationType[]; pagination: QuotationsListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search, status, store_id, startDate, endDate } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (status && status !== 'all') requestParams.status = status
    if (store_id) requestParams.store_id = store_id
    if (startDate) requestParams.startDate = startDate
    if (endDate) requestParams.endDate = endDate
    
    const response = await client.get<QuotationsListResponse>(ENDPOINT.QUOTATIONS, {
        params: requestParams
    })
    
    return {
        quotations: response.data.data.map(transformQuotationListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET QUOTATIONS HOOK
// ================================
export function useGetQuotations(params: QuotationQueryParams = {}) {
    const { page = 1, limit = 25, sort, search, status, store_id, startDate, endDate } = params
    
    return useQuery({
        queryKey: ['quotations-list', page, limit, sort, search, status, store_id, startDate, endDate],
        queryFn: () => getQuotations({ page, limit, sort, search, status, store_id, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// TRANSFORM FORM DATA TO PAYLOAD
// ================================
export function transformQuotationFormDataToPayload(
    formData: CreateQuotationFormData
): CreateQuotationPayload {
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
        note: formData.note || undefined,
        order_tax_type: formData.order_tax_type,
        order_discount_type: formData.order_discount_type,
        items: formData.quotation_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: roundToTwoDecimals(item.net_unit_price),
            tax: roundToTwoDecimals(item.tax),
            discount: roundToTwoDecimals(item.discount),
            subtotal: roundToTwoDecimals(item.subtotal),
            ...(item.variation_id && { variation_id: item.variation_id }),
            ...(item.quotation_item_id && { quotation_item_id: item.quotation_item_id })
        }))
    };
}

// ================================
// CREATE QUOTATION
// ================================
export async function createQuotation(payload: CreateQuotationPayload): Promise<CreateQuotationResponse> {
    const response = await client.post(ENDPOINT.QUOTATIONS, payload);
    return response.data;
}

// ================================
// USE CREATE QUOTATION HOOK
// ================================
export function useCreateQuotation() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: (payload: CreateQuotationPayload) => createQuotation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations-list'] });
            queryClient.invalidateQueries({ queryKey: ['quotation-summary'] });
            showSuccess('Quotation created', 'Quotation created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create quotation', errorMessage);
        },
    });
}

// ================================
// GET QUOTATION DETAIL
// ================================
export async function getQuotationDetail(id: number): Promise<QuotationDetailResponse> {
    const response = await client.get<QuotationDetailApiResponse>(`${ENDPOINT.QUOTATIONS}/${id}`);
    return response.data.data;
}

// ================================
// USE GET QUOTATION DETAIL HOOK
// ================================
export function useGetQuotationDetail(id: number) {
    return useQuery({
        queryKey: ['quotation-detail', id],
        queryFn: () => getQuotationDetail(id),
        enabled: !!id,
    });
}

// ================================
// UPDATE QUOTATION
// ================================
export async function updateQuotation(id: number, payload: CreateQuotationPayload): Promise<CreateQuotationResponse> {
    const response = await client.patch(`${ENDPOINT.QUOTATIONS}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE QUOTATION HOOK
// ================================
export function useUpdateQuotation() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CreateQuotationPayload }) => 
            updateQuotation(id, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['quotations-list'] });
            queryClient.invalidateQueries({ queryKey: ['quotation-detail', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['quotation-summary'] });
            showSuccess('Quotation updated', 'Quotation updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update quotation', errorMessage);
        },
    });
}

// ================================
// DELETE QUOTATION
// ================================
export async function deleteQuotation(id: number): Promise<{ status: number; message: string }> {
    const response = await client.delete(`${ENDPOINT.QUOTATIONS}/${id}`);
    return response.data;
}

// ================================
// USE DELETE QUOTATION HOOK
// ================================
export function useDeleteQuotation() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: deleteQuotation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations-list'] });
            queryClient.invalidateQueries({ queryKey: ['quotation-summary'] });
            showSuccess('Quotation deleted', 'Quotation deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to delete quotation', errorMessage);
        },
    });
}

// ================================
// GET QUOTATION SUMMARY
// ================================
export async function getQuotationSummary(): Promise<QuotationSummaryResponse> {
    const response = await client.get(`${ENDPOINT.QUOTATIONS}/summary/cards`);
    return response.data;
}

// ================================
// USE QUOTATION SUMMARY HOOK
// ================================
export function useGetQuotationSummary() {
    return useQuery({
        queryKey: ['quotation-summary'],
        queryFn: getQuotationSummary,
    });
}

// ================================
// DOWNLOAD QUOTATION PDF
// ================================
export async function downloadQuotationPDF(id: number): Promise<void> {
    const response = await client.get(`${ENDPOINT.QUOTATIONS}/${id}/pdf`, {
        responseType: 'blob',
    });
    
    // Create a blob URL from the response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
