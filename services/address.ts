import { useQuery } from "@tanstack/react-query";
import { AddressAutocompleteResponse, AddressDetails, AddressSuggestion } from "@/types";
import { ENDPOINT } from "@/constants";

const API_KEY = process.env.NEXT_PUBLIC_ADDRESS_API_KEY;
const API_BASE_URL = 'https://api.getAddress.io';

/**
 * Get address suggestions for a postcode using autocomplete endpoint
 * @param postcode - UK postcode to search for
 * @returns Promise with address suggestions
 */
export const getAddressSuggestions = async (postcode: string): Promise<AddressSuggestion[]> => {
    if (!postcode?.trim()) {
        throw new Error('Postcode is required');
    }

    const url = `${API_BASE_URL}${ENDPOINT.ADDRESS.AUTOCOMPLETE}/${encodeURIComponent(postcode.trim())}?api-key=${API_KEY}`;
    
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No addresses found for this postcode');
        } else if (response.status === 401 || response.status === 403) {
            throw new Error('Invalid API key. Please check your API credentials.');
        } else {
            throw new Error(`Failed to lookup address: ${response.statusText}`);
        }
    }

    const data: AddressAutocompleteResponse = await response.json();
    return data.suggestions || [];
};

/**
 * Get full address details using address ID from get endpoint
 * @param addressId - Address ID from autocomplete suggestion
 * @returns Promise with full address details
 */
export const getAddressDetails = async (addressId: string): Promise<AddressDetails> => {
    if (!addressId?.trim()) {
        throw new Error('Address ID is required');
    }

    const url = `${API_BASE_URL}${ENDPOINT.ADDRESS.GET}/${addressId}?api-key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Address details not found');
        } else {
            throw new Error('Failed to fetch address details');
        }
    }

    const data: AddressDetails = await response.json();
    return data;
};

/**
 * React Query hook to get address suggestions for a postcode
 * @param postcode - UK postcode to search for
 * @param enabled - Whether to enable the query (default: false, will be enabled when postcode is provided)
 */
export const useGetAddressSuggestions = (postcode: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['address-suggestions', postcode],
        queryFn: () => getAddressSuggestions(postcode),
        enabled: enabled && !!postcode?.trim(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

/**
 * React Query hook to get full address details by ID
 * @param addressId - Address ID from autocomplete suggestion
 * @param enabled - Whether to enable the query (default: false, will be enabled when addressId is provided)
 */
export const useGetAddressDetails = (addressId: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['address-details', addressId],
        queryFn: () => getAddressDetails(addressId),
        enabled: enabled && !!addressId?.trim(),
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
    });
};
