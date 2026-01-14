import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    PaymentMethodsListResponse,
    PaymentMethodType
} from "@/types";

/**
 * Get all payment methods
 * @returns Promise with the payment methods list response
 */
export async function getPaymentMethods(): Promise<PaymentMethodsListResponse> {
    const response = await client.get(ENDPOINT.PAYMENT_METHODS);
    return response.data;
}

/**
 * React Query hook to fetch payment methods
 * @returns Query result with payment methods data
 */
export function useGetPaymentMethods() {
    return useQuery({
        queryKey: ['payment-methods'],
        queryFn: getPaymentMethods,
    });
}

