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
// API returns camelCase keys; sidebar links use the values below.
// Keys that differ from API (e.g. API: manageSale → sidebar: manageSales) are mapped in usePermissions.
// ===============================================
export enum PermissionKey {
    // ---------- API keys (exact match) ----------
    MANAGE_CUSTOMERS = 'manageCustomers',
    MANAGE_TRANSFERS = 'manageTransfers',
    MANAGE_SMS_TEMPLATES = 'manageSmsTemplates',
    MANAGE_SMS_APIS = 'manageSmsApis',
    MANAGE_DASHBOARD = 'manageDashboard',
    MANAGE_SUPPLIERS = 'manageSuppliers',
    MANAGE_REPORTS = 'manageReports',
    MANAGE_UNITS = 'manageUnits',
    MANAGE_POS_SCREEN = 'managePosScreen',
    MANAGE_PRODUCTS = 'manageProducts',
    MANAGE_LANGUAGE = 'manageLanguage',
    MANAGE_EXPENSE_CATEGORIES = 'manageExpenseCategories',
    MANAGE_EMAIL_TEMPLATES = 'manageEmailTemplates',
    MANAGE_PRODUCT_CATEGORIES = 'manageProductCategories',
    MANAGE_PURCHASE = 'managePurchase',
    MANAGE_STORES = 'manageStores',
    MANAGE_VARIATIONS = 'manageVariations',
    MANAGE_BRANDS = 'manageBrands',
    MANAGE_USERS = 'manageUsers',
    MANAGE_QUOTATIONS = 'manageQuotations',
    MANAGE_EXPENSES = 'manageExpenses',
    MANAGE_SALE_RETURN = 'manageSaleReturn',
    MANAGE_SETTING = 'manageSetting',
    MANAGE_PURCHASE_RETURN = 'managePurchaseReturn',
    MANAGE_CURRENCY = 'manageCurrency',
    MANAGE_SALE = 'manageSale',
    MANAGE_ADJUSTMENTS = 'manageAdjustments',
    MANAGE_ROLES = 'manageRoles',

    // ---------- Sidebar aliases (used by dashboard links; mapped from API in usePermissions) ----------
    /** Sidebar: Sales, Sale Return. API sends manageSale. */
    MANAGE_SALES = 'manageSales',
    /** Sidebar: Purchases, Purchase Return. API sends managePurchase. */
    MANAGE_PURCHASES = 'managePurchases',
    /** Sidebar: Settings. API sends manageSetting. */
    MANAGE_SETTINGS = 'manageSettings',
    /** Sidebar: Roles/Permissions. API sends manageRoles. */
    MANAGE_ROLES_PERMISSIONS = 'manageRolesPermissions',

    // ---------- Sidebar only (no API key in current response) ----------
    MANAGE_PAYMENT_METHODS = 'managePaymentMethods',
}
