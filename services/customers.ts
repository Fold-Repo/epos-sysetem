import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    CustomerType,
    CustomerListItem,
    CustomersListResponse,
    CreateCustomerPayload,
    CreateCustomerResponse,
    CustomerQueryParams
} from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

// ================================
// TRANSFORM CUSTOMER LIST ITEM
// ================================
function transformCustomerListItem(item: CustomerListItem): CustomerType {
    return {
        id: item.customer_id,
        customer_id: item.customer_id,
        name: item.name,
        email: item.email || undefined,
        phone: item.phonenumber || undefined,
        phonenumber: item.phonenumber || undefined,
        country: item.country || undefined,
        city: item.city || undefined,
        address: item.address || undefined,
        created_by: item.created_by,
        created_by_name: item.created_by_name,
        created_at: item.created_at,
        updated_at: item.updated_at
    };
}

// ================================
// GET CUSTOMERS
// ================================
export async function getCustomers(params: CustomerQueryParams = {}): Promise<{ customers: CustomerType[]; pagination: CustomersListResponse['pagination'] }> {
    const { page = 1, limit = 25, sort, search } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    
    const response = await client.get<CustomersListResponse>(ENDPOINT.CUSTOMERS, {
        params: requestParams
    })
    
    return {
        customers: response.data.data.map(transformCustomerListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET CUSTOMERS HOOK
// ================================
export function useGetCustomers(params: CustomerQueryParams = {}) {
    const { page = 1, limit = 25, sort, search } = params
    
    return useQuery({
        queryKey: ['customers-list', page, limit, sort, search],
        queryFn: () => getCustomers({ page, limit, sort, search }),
        staleTime: 5 * 60 * 1000,
    })
}

// ================================
// CREATE CUSTOMER
// ================================
export async function createCustomer(payload: CreateCustomerPayload): Promise<CreateCustomerResponse> {
    const response = await client.post(ENDPOINT.CUSTOMERS, payload);
    return response.data;
}

// ================================
// USE CREATE CUSTOMER HOOK
// ================================
export function useCreateCustomer() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers-list'] });
            showSuccess('Customer created', 'Customer created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to create customer', errorMessage);
        },
    });
}

// ================================
// UPDATE CUSTOMER
// ================================
export async function updateCustomer(id: number, payload: CreateCustomerPayload): Promise<CreateCustomerResponse> {
    const response = await client.patch(`${ENDPOINT.CUSTOMERS}/${id}`, payload);
    return response.data;
}

// ================================
// USE UPDATE CUSTOMER HOOK
// ================================
export function useUpdateCustomer() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: CreateCustomerPayload }) => 
            updateCustomer(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers-list'] });
            showSuccess('Customer updated', 'Customer updated successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to update customer', errorMessage);
        },
    });
}

// ================================
// DELETE CUSTOMER
// ================================
export async function deleteCustomer(id: number): Promise<{ status: number; message: string }> {
    const response = await client.delete(`${ENDPOINT.CUSTOMERS}/${id}`);
    return response.data;
}

// ================================
// USE DELETE CUSTOMER HOOK
// ================================
export function useDeleteCustomer() {
    const queryClient = useQueryClient();
    const { showError, showSuccess } = useToast();

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers-list'] });
            showSuccess('Customer deleted', 'Customer deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            showError('Failed to delete customer', errorMessage);
        },
    });
}

