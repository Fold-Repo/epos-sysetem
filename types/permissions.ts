// ===============================================
// Permission Action
// ===============================================
export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

// ===============================================
// Permission
// ===============================================
export interface Permission {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

// ===============================================
// User Permissions
// ===============================================
export interface UserPermissions {
    [key: string]: Permission;
}

// ===============================================
// Permissions Response
// ===============================================
export interface PermissionsResponse {
    role: string;
    permissions: UserPermissions;
}

// ===============================================
// Permission Keys
// ===============================================
export enum PermissionKey {

    // Dashboard
    MANAGE_DASHBOARD = 'manageDashboard',

    // Stores
    MANAGE_STORES = 'manageStores',

    // Products & Inventory
    MANAGE_PRODUCTS = 'manageProducts',
    MANAGE_ADJUSTMENTS = 'manageAdjustments',
    MANAGE_QUOTATIONS = 'manageQuotations',
    MANAGE_TRANSFERS = 'manageTransfers',
    MANAGE_BRANDS = 'manageBrands',

    // People & Users
    MANAGE_USERS = 'manageUsers',
    MANAGE_CUSTOMERS = 'manageCustomers',

    // Sales
    MANAGE_SALES = 'manageSales',
    MANAGE_PURCHASES = 'managePurchases',
    MANAGE_PAYMENT_METHODS = 'managePaymentMethods',
    MANAGE_CURRENCY = 'manageCurrency',
    MANAGE_EXPENSES = 'manageExpenses',

    // Reports
    MANAGE_REPORTS = 'manageReports',

    // Settings & Configuration
    MANAGE_SETTINGS = 'manageSettings',
    MANAGE_LANGUAGES = 'manageLanguages',
    MANAGE_DUAL_SCREEN_SETTINGS = 'manageDualScreenSettings',
    MANAGE_ROLES_PERMISSIONS = 'manageRolesPermissions',
    MANAGE_EMAIL_TEMPLATES = 'manageEmailTemplates',
}

