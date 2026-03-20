export interface BusinessOnboardLinkResponse {
    onboarding_url: string;
    stripe_account_id?: string | null;
}

export interface BusinessOnboardPayload {
    return_url: string;
    refresh_url: string;
}

export interface BusinessOnboardResponse {
    status: number;
    message: string;
    data: BusinessOnboardLinkResponse;
}

export interface BusinessConnectStatusData {
    stripe_account_id: string | null;
    stripe_onboarding_completed: boolean;
    stripe_charges_enabled?: boolean;
    stripe_payments_enabled: boolean;
    stripe_payouts_enabled: boolean;
    stripe_account_type: string;
}

export interface BusinessConnectStatusResponse {
    status: number;
    message: string;
    data: BusinessConnectStatusData;
}

