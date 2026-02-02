import { ENDPOINT } from '@/constants';
import { client } from '@/lib';
import { ProfileResponse, UpdateProfilePayload } from '@/types';

/**
 * Fetch current user profile (user, role, business, stores, address)
 */
export async function getProfile(): Promise<ProfileResponse['data']> {
    const response = await client.get<ProfileResponse>(ENDPOINT.USERS.PROFILE);
    if (!response.data?.data) {
        throw new Error(response.data?.message || 'Failed to fetch profile');
    }
    return response.data.data;
}

/**
 * Update profile (company logo and/or address)
 * PUT /api/v1/users/profile
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse['data']> {
    const response = await client.put<ProfileResponse>(ENDPOINT.USERS.PROFILE, payload);
    if (!response.data?.data) {
        throw new Error(response.data?.message || 'Failed to update profile');
    }
    return response.data.data;
}
