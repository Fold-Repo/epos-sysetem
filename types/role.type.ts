export interface RoleType {
    id?: string | number;
    name: string;
    description?: string;
    userCount?: number;
    permissionsCount?: number;
    status?: 'active' | 'inactive';
    created_at?: string | Date;
}

