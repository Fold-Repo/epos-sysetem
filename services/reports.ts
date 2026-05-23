import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";

export interface AnnualReportQueryParams {
    page?: number;
    limit?: number;
    year?: number;
    search?: string;
}

interface AnnualReportApiItem {
    year: number;
    total_sales: number;
    total_purchases: number;
    total_expenses: number;
    total_income: number;
    net_profit: number;
}

interface AnnualReportApiResponse {
    status: number;
    message: string;
    summary: {
        current_year_sales: number;
        current_year_profit: number;
        average_annual_profit: number;
        total_revenue_5_years: number;
    };
    data: AnnualReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface AnnualReportItem {
    id: string;
    year: string;
    totalSales: number;
    totalPurchases: number;
    totalExpenses: number;
    totalIncome: number;
    netProfit: number;
    growth: number;
}

export interface AnnualReportResponse {
    summary: AnnualReportApiResponse["summary"];
    annualReport: AnnualReportItem[];
    pagination: AnnualReportApiResponse["pagination"];
}

export async function getAnnualReport(params: AnnualReportQueryParams = {}): Promise<AnnualReportResponse> {
    const { page = 1, limit = 10, year, search } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (year) requestParams.year = year;
    if (search) requestParams.search = search;

    const response = await client.get<AnnualReportApiResponse>(ENDPOINT.REPORTS.ANNUAL, {
        params: requestParams,
    });

    const apiData = response.data.data ?? [];
    const annualReport = apiData.map((item, index) => {
        const previousYear = apiData[index + 1];
        const growth =
            previousYear && previousYear.total_sales !== 0
                ? ((item.total_sales - previousYear.total_sales) / previousYear.total_sales) * 100
                : 0;

        return {
            id: String(item.year),
            year: String(item.year),
            totalSales: item.total_sales,
            totalPurchases: item.total_purchases,
            totalExpenses: item.total_expenses,
            totalIncome: item.total_income,
            netProfit: item.net_profit,
            growth,
        };
    });

    return {
        summary: response.data.summary,
        annualReport,
        pagination: response.data.pagination,
    };
}

export function useGetAnnualReport(params: AnnualReportQueryParams = {}) {
    const { page = 1, limit = 10, year, search } = params;

    return useQuery({
        queryKey: ["annual-report", page, limit, year, search],
        queryFn: () => getAnnualReport({ page, limit, year, search }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface ExpensesReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}

interface ExpensesReportApiItem {
    expense_name: string;
    category: string;
    description: string;
    date: string;
    amount: number;
    status: string;
}

interface ExpensesReportApiResponse {
    status: number;
    message: string;
    summary: {
        total_expenses: number;
        approved: number;
        pending: number;
        average_expense: number;
    };
    data: ExpensesReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ExpenseReportItem {
    id: string;
    expenseName: string;
    category: string;
    description: string;
    date: string;
    amount: number;
    status: string;
}

export interface ExpensesReportResponse {
    summary: ExpensesReportApiResponse["summary"];
    expenses: ExpenseReportItem[];
    pagination: ExpensesReportApiResponse["pagination"];
}

export async function getExpensesReport(params: ExpensesReportQueryParams = {}): Promise<ExpensesReportResponse> {
    const { page = 1, limit = 10, search, category_id, status, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (category_id) requestParams.category_id = category_id;
    if (status && status !== "all") requestParams.status = status;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<ExpensesReportApiResponse>(ENDPOINT.REPORTS.EXPENSES, {
        params: requestParams,
    });

    return {
        summary: response.data.summary,
        expenses: (response.data.data ?? []).map((item, index) => ({
            id: `${item.expense_name}-${item.date}-${index}`,
            expenseName: item.expense_name,
            category: item.category,
            description: item.description,
            date: item.date,
            amount: item.amount,
            status: item.status,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetExpensesReport(params: ExpensesReportQueryParams = {}) {
    const { page = 1, limit = 10, search, category_id, status, startDate, endDate } = params;

    return useQuery({
        queryKey: ["expenses-report", page, limit, search, category_id, status, startDate, endDate],
        queryFn: () => getExpensesReport({ page, limit, search, category_id, status, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface TaxReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    payment_method?: string;
    startDate?: string;
    endDate?: string;
}

interface TaxReportApiItem {
    reference: string;
    supplier: string;
    date: string;
    store: string;
    amount: number;
    payment_method: string;
    discount: number;
    tax_amount: number;
}

interface TaxReportApiResponse {
    status: number;
    message: string;
    data: TaxReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface TaxReportItem {
    id: string;
    reference: string;
    supplier: string;
    date: string;
    store: string;
    amount: number;
    paymentMethod: string;
    discount: number;
    taxAmount: number;
}

export interface TaxReportResponse {
    taxReport: TaxReportItem[];
    pagination: TaxReportApiResponse["pagination"];
}

export async function getTaxReport(params: TaxReportQueryParams = {}): Promise<TaxReportResponse> {
    const { page = 1, limit = 10, search, payment_method, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (payment_method && payment_method !== "all") requestParams.payment_method = payment_method;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<TaxReportApiResponse>(ENDPOINT.REPORTS.TAX, {
        params: requestParams,
    });

    return {
        taxReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.reference}-${item.date}-${index}`,
            reference: item.reference,
            supplier: item.supplier,
            date: item.date,
            store: item.store,
            amount: item.amount,
            paymentMethod: item.payment_method,
            discount: item.discount,
            taxAmount: item.tax_amount,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetTaxReport(params: TaxReportQueryParams = {}) {
    const { page = 1, limit = 10, search, payment_method, startDate, endDate } = params;

    return useQuery({
        queryKey: ["tax-report", page, limit, search, payment_method, startDate, endDate],
        queryFn: () => getTaxReport({ page, limit, search, payment_method, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface CustomerReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    payment_method?: string;
    payment_status?: string;
    startDate?: string;
    endDate?: string;
}

interface CustomerReportApiItem {
    reference: string;
    code: string;
    customer: string;
    total_orders: number;
    amount: number;
    paid: number;
    due: number;
    payment_method: string;
}

interface CustomerReportApiResponse {
    status: number;
    message: string;
    data: CustomerReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface CustomerReportItem {
    id: string;
    reference: string;
    code: string;
    customerName: string;
    totalOrders: number;
    amount: number;
    paid: number;
    due: number;
    paymentMethod: string;
}

export interface CustomerReportResponse {
    customerReport: CustomerReportItem[];
    pagination: CustomerReportApiResponse["pagination"];
}

export async function getCustomerReport(params: CustomerReportQueryParams = {}): Promise<CustomerReportResponse> {
    const { page = 1, limit = 10, search, payment_method, payment_status, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (payment_method && payment_method !== "all") requestParams.payment_method = payment_method;
    if (payment_status && payment_status !== "all") requestParams.payment_status = payment_status;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<CustomerReportApiResponse>(ENDPOINT.REPORTS.CUSTOMERS, {
        params: requestParams,
    });

    return {
        customerReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.reference}-${item.code || "no-code"}-${index}`,
            reference: item.reference,
            code: item.code,
            customerName: item.customer,
            totalOrders: item.total_orders,
            amount: item.amount,
            paid: item.paid,
            due: item.due,
            paymentMethod: item.payment_method,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetCustomerReport(params: CustomerReportQueryParams = {}) {
    const { page = 1, limit = 10, search, payment_method, payment_status, startDate, endDate } = params;

    return useQuery({
        queryKey: ["customer-report", page, limit, search, payment_method, payment_status, startDate, endDate],
        queryFn: () => getCustomerReport({ page, limit, search, payment_method, payment_status, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface InventoryReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
}

interface InventoryReportApiItem {
    sku: string;
    product_name: string;
    category: string;
    unit: string;
    instock: number;
}

interface InventoryReportApiResponse {
    status: number;
    message: string;
    data: InventoryReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface InventoryReportItem {
    id: string;
    sku: string;
    productName: string;
    category: string;
    unit: string;
    instock: number;
}

export interface InventoryReportResponse {
    inventoryReport: InventoryReportItem[];
    pagination: InventoryReportApiResponse["pagination"];
}

export async function getInventoryReport(params: InventoryReportQueryParams = {}): Promise<InventoryReportResponse> {
    const { page = 1, limit = 10, search, category_id } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (category_id) requestParams.category_id = category_id;

    const response = await client.get<InventoryReportApiResponse>(ENDPOINT.REPORTS.INVENTORY, {
        params: requestParams,
    });

    return {
        inventoryReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.sku}-${index}`,
            sku: item.sku,
            productName: item.product_name,
            category: item.category,
            unit: item.unit,
            instock: item.instock,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetInventoryReport(params: InventoryReportQueryParams = {}) {
    const { page = 1, limit = 10, search, category_id } = params;

    return useQuery({
        queryKey: ["inventory-report", page, limit, search, category_id],
        queryFn: () => getInventoryReport({ page, limit, search, category_id }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface ProfitLossReportQueryParams {
    view?: "list" | "chart";
    startDate?: string;
    endDate?: string;
}

interface ProfitLossPeriodApiItem {
    period: string;
    income: {
        sales: number;
        service: number;
        purchase_return: number;
        gross_profit: number;
    };
    expenses: {
        sales: number;
        purchase: number;
        sales_return: number;
        total_expense: number;
    };
    net_profit: number;
}

interface ProfitLossReportApiResponse {
    status: number;
    message: string;
    labels?: string[];
    chart?: {
        income_overview: Array<{
            sales: number;
            service: number;
            purchase_return: number;
            gross_profit: number;
        }>;
        trend: Array<{
            gross_profit: number;
            total_expense: number;
            net_profit: number;
        }>;
    };
    data?: ProfitLossPeriodApiItem[];
}

export interface ProfitLossPeriodItem {
    period: string;
    income: ProfitLossPeriodApiItem["income"];
    expenses: ProfitLossPeriodApiItem["expenses"];
    netProfit: number;
}

export interface ProfitLossReportResponse {
    profitLoss: ProfitLossPeriodItem[];
    labels: string[];
    incomeOverview: Array<{
        sales: number;
        service: number;
        purchaseReturn: number;
        grossProfit: number;
    }>;
    trend: Array<{
        grossProfit: number;
        totalExpense: number;
        netProfit: number;
    }>;
}

export async function getProfitLossReport(params: ProfitLossReportQueryParams = {}): Promise<ProfitLossReportResponse> {
    const { view = "list", startDate, endDate } = params;

    const requestParams: Record<string, string> = { view };
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<ProfitLossReportApiResponse>(ENDPOINT.REPORTS.PROFIT_LOSS, {
        params: requestParams,
    });

    return {
        profitLoss: (response.data.data ?? []).map((item) => ({
            period: item.period,
            income: item.income,
            expenses: item.expenses,
            netProfit: item.net_profit,
        })),
        labels: response.data.labels ?? [],
        incomeOverview: (response.data.chart?.income_overview ?? []).map((item) => ({
            sales: item.sales,
            service: item.service,
            purchaseReturn: item.purchase_return,
            grossProfit: item.gross_profit,
        })),
        trend: (response.data.chart?.trend ?? []).map((item) => ({
            grossProfit: item.gross_profit,
            totalExpense: item.total_expense,
            netProfit: item.net_profit,
        })),
    };
}

export function useGetProfitLossReport(params: ProfitLossReportQueryParams = {}) {
    const { view = "list", startDate, endDate } = params;

    return useQuery({
        queryKey: ["profit-loss-report", view, startDate, endDate],
        queryFn: () => getProfitLossReport({ view, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface SalesReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    brand_id?: number;
    category_id?: number;
    startDate?: string;
    endDate?: string;
}

interface SalesReportApiItem {
    product_id: number;
    sku: string;
    product_name: string;
    image_url: string;
    brand: string;
    category: string;
    sold_qty: number;
    sold_amount: number;
    instock_qty: number;
}

interface SalesReportApiResponse {
    status: number;
    message: string;
    summary: {
        total_amount: number;
        total_paid: number;
        total_unpaid: number;
        overdue: number;
    };
    data: SalesReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface SalesReportItem {
    id: string;
    sku: string;
    productName: string;
    productImage: string;
    brand: string;
    category: string;
    soldQty: number;
    soldAmount: number;
    instockQty: number;
}

export interface SalesReportResponse {
    summary: SalesReportApiResponse["summary"];
    salesReport: SalesReportItem[];
    pagination: SalesReportApiResponse["pagination"];
}

export async function getSalesReport(params: SalesReportQueryParams = {}): Promise<SalesReportResponse> {
    const { page = 1, limit = 10, search, brand_id, category_id, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (brand_id) requestParams.brand_id = brand_id;
    if (category_id) requestParams.category_id = category_id;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<SalesReportApiResponse>(ENDPOINT.REPORTS.SALES, {
        params: requestParams,
    });

    return {
        summary: response.data.summary,
        salesReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.product_id}-${index}`,
            sku: item.sku,
            productName: item.product_name,
            productImage: item.image_url,
            brand: item.brand,
            category: item.category,
            soldQty: item.sold_qty,
            soldAmount: item.sold_amount,
            instockQty: item.instock_qty,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetSalesReport(params: SalesReportQueryParams = {}) {
    const { page = 1, limit = 10, search, brand_id, category_id, startDate, endDate } = params;

    return useQuery({
        queryKey: ["sales-report", page, limit, search, brand_id, category_id, startDate, endDate],
        queryFn: () => getSalesReport({ page, limit, search, brand_id, category_id, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface SoldStockReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    startDate?: string;
    endDate?: string;
}

interface SoldStockReportApiItem {
    product_id: number;
    sku: string;
    product_name: string;
    image_url: string;
    unit: number;
    quantity: number;
    tax_value: number;
    total: number;
}

interface SoldStockReportApiResponse {
    status: number;
    message: string;
    data: SoldStockReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface SoldStockReportItem {
    id: string;
    sku: string;
    productName: string;
    productImage: string;
    unit: number;
    quantity: number;
    taxValue: number;
    total: number;
}

export interface SoldStockReportResponse {
    soldStockReport: SoldStockReportItem[];
    pagination: SoldStockReportApiResponse["pagination"];
}

export async function getSoldStockReport(params: SoldStockReportQueryParams = {}): Promise<SoldStockReportResponse> {
    const { page = 1, limit = 10, search, category_id, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (category_id) requestParams.category_id = category_id;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<SoldStockReportApiResponse>(ENDPOINT.REPORTS.SOLD_STOCK, {
        params: requestParams,
    });

    return {
        soldStockReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.product_id}-${index}`,
            sku: item.sku,
            productName: item.product_name,
            productImage: item.image_url,
            unit: item.unit,
            quantity: item.quantity,
            taxValue: item.tax_value,
            total: item.total,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetSoldStockReport(params: SoldStockReportQueryParams = {}) {
    const { page = 1, limit = 10, search, category_id, startDate, endDate } = params;

    return useQuery({
        queryKey: ["sold-stock-report", page, limit, search, category_id, startDate, endDate],
        queryFn: () => getSoldStockReport({ page, limit, search, category_id, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface StockHistoryReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    startDate?: string;
    endDate?: string;
}

interface StockHistoryReportApiItem {
    product_id: number;
    sku: string;
    product_name: string;
    image_url: string;
    initial_quantity: number;
    added_quantity: number;
    sold_quantity: number;
    defective_quantity: number;
    final_quantity: number;
}

interface StockHistoryReportApiResponse {
    status: number;
    message: string;
    data: StockHistoryReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface StockHistoryReportItem {
    id: string;
    sku: string;
    productName: string;
    productImage: string;
    initialQty: number;
    addedQty: number;
    soldQty: number;
    defectiveQty: number;
    finalQty: number;
}

export interface StockHistoryReportResponse {
    stockHistoryReport: StockHistoryReportItem[];
    pagination: StockHistoryReportApiResponse["pagination"];
}

export async function getStockHistoryReport(params: StockHistoryReportQueryParams = {}): Promise<StockHistoryReportResponse> {
    const { page = 1, limit = 10, search, category_id, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (category_id) requestParams.category_id = category_id;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<StockHistoryReportApiResponse>(ENDPOINT.REPORTS.STOCK_HISTORY, {
        params: requestParams,
    });

    return {
        stockHistoryReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.product_id}-${index}`,
            sku: item.sku,
            productName: item.product_name,
            productImage: item.image_url,
            initialQty: item.initial_quantity,
            addedQty: item.added_quantity,
            soldQty: item.sold_quantity,
            defectiveQty: item.defective_quantity,
            finalQty: item.final_quantity,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetStockHistoryReport(params: StockHistoryReportQueryParams = {}) {
    const { page = 1, limit = 10, search, category_id, startDate, endDate } = params;

    return useQuery({
        queryKey: ["stock-history-report", page, limit, search, category_id, startDate, endDate],
        queryFn: () => getStockHistoryReport({ page, limit, search, category_id, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}

export interface PurchaseReportQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}

interface PurchaseReportApiItem {
    reference: string;
    sku: string;
    due_date: string;
    product_id: number;
    product_name: string;
    image_url: string;
    category: string;
    instock_qty: number;
    purchase_qty: number;
    purchase_amount: number;
}

interface PurchaseReportApiResponse {
    status: number;
    message: string;
    summary: {
        total_purchases: number;
        total_amount: number;
        total_paid: number;
        total_unpaid: number;
    };
    data: PurchaseReportApiItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface PurchaseReportItem {
    id: string;
    reference: string;
    sku: string;
    dueDate: string;
    productName: string;
    productImage: string;
    category: string;
    instockQty: number;
    purchaseQty: number;
    purchaseAmount: number;
}

export interface PurchaseReportResponse {
    summary: PurchaseReportApiResponse["summary"];
    purchaseReport: PurchaseReportItem[];
    pagination: PurchaseReportApiResponse["pagination"];
}

export async function getPurchaseReport(params: PurchaseReportQueryParams = {}): Promise<PurchaseReportResponse> {
    const { page = 1, limit = 10, search, category_id, status, startDate, endDate } = params;

    const requestParams: Record<string, string | number> = { page, limit };
    if (search) requestParams.search = search;
    if (category_id) requestParams.category_id = category_id;
    if (status && status !== "all") requestParams.status = status;
    if (startDate) requestParams.startDate = startDate;
    if (endDate) requestParams.endDate = endDate;

    const response = await client.get<PurchaseReportApiResponse>(ENDPOINT.REPORTS.PURCHASES, {
        params: requestParams,
    });

    return {
        summary: response.data.summary,
        purchaseReport: (response.data.data ?? []).map((item, index) => ({
            id: `${item.reference}-${item.product_id}-${index}`,
            reference: item.reference,
            sku: item.sku,
            dueDate: item.due_date,
            productName: item.product_name,
            productImage: item.image_url,
            category: item.category,
            instockQty: item.instock_qty,
            purchaseQty: item.purchase_qty,
            purchaseAmount: item.purchase_amount,
        })),
        pagination: response.data.pagination,
    };
}

export function useGetPurchaseReport(params: PurchaseReportQueryParams = {}) {
    const { page = 1, limit = 10, search, category_id, status, startDate, endDate } = params;

    return useQuery({
        queryKey: ["purchase-report", page, limit, search, category_id, status, startDate, endDate],
        queryFn: () => getPurchaseReport({ page, limit, search, category_id, status, startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    });
}
