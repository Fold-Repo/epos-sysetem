import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import type {
    BusinessConnectStatusResponse,
    BusinessOnboardPayload,
    BusinessOnboardResponse
} from "@/types";

export async function createBusinessOnboardLink(payload: BusinessOnboardPayload): Promise<BusinessOnboardResponse> {
    const response = await client.post<BusinessOnboardResponse>(ENDPOINT.BUSINESS.ONBOARD, {
        return_url: payload.return_url,
        refresh_url: payload.refresh_url,
    });
    return response.data;
}

export async function getBusinessOnboardLink(): Promise<BusinessOnboardResponse> {
    const response = await client.get<BusinessOnboardResponse>(ENDPOINT.BUSINESS.ONBOARD_LINK);
    return response.data;
}

export async function getBusinessConnectStatus(): Promise<BusinessConnectStatusResponse> {
    const response = await client.get<BusinessConnectStatusResponse>(ENDPOINT.BUSINESS.CONNECT_STATUS);
    return response.data;
}

