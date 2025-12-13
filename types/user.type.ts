export interface UserType {
    id?: string | number;
    name: string;
    email?: string;
    role?: string;
    phone?: string;
    stores?: string[] | number[];
    storeNames?: string[];
    created_at?: string | Date;
}

