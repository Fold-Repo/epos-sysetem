export interface PaymentMethodType {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentMethodsListResponse {
    status: number;
    data: PaymentMethodType[];
}

