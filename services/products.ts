import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { CreateProductPayload, CreateProductResponse, ProductsListResponse, ProductListItem, ProductType, DeleteProductResponse, ProductDetailApiResponse, ProductDetailResponse, ProductsPaginationResponse } from "@/types";
import { useToast } from "@/hooks";
import { getErrorMessage } from "@/utils";

/**
 * Create a product
 * @param payload - Product data (Single or Variation type)
 * @returns Promise with the created product response
 */
export async function createProduct(payload: CreateProductPayload): Promise<CreateProductResponse> {
    const response = await client.post(ENDPOINT.PRODUCTS, payload);
    return response.data;
}

/**
 * React Query mutation hook for creating products
 * @returns Mutation object with mutate function and state
 */
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (productData: CreateProductPayload) => createProduct(productData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['products-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Product created successfully';
            showSuccess(message, 'The product has been created successfully.');
        },
        onError: (error: unknown) => {
            showError(getErrorMessage(error));
        },
    });
};

/**
 * Transform API product list item to ProductType
 * @param item - Product list item from API
 * @returns Transformed product type
 */
function transformProductListItem(item: ProductListItem): ProductType {
    // Parse image_url if it's a JSON string
    let imageUrl: string | undefined = undefined;
    if (item.image_url) {
        try {
            // Try to parse as JSON first
            const imageData = JSON.parse(item.image_url);
            // If it's an object with url property, use that
            if (typeof imageData === 'object' && imageData.url) {
                imageUrl = imageData.url;
            } else if (typeof imageData === 'string') {
                imageUrl = imageData;
            }
        } catch {
            // If parsing fails, it's likely a plain URL string
            imageUrl = item.image_url;
        }
    }

    // Parse min and max prices
    const minPrice = parseFloat(item.min_price) || 0;
    const maxPrice = parseFloat(item.max_price) || 0;
    // Use min_price as the default price for backward compatibility
    const price = minPrice;

    return {
        id: String(item.product_id),
        name: item.name,
        code: item.sku,
        image: imageUrl,
        brand: item.brand_name,
        category: item.category_name,
        price: price,
        minPrice: minPrice,
        maxPrice: maxPrice,
        unit: item.product_unit,
        stock: item.quantity_limit,
        created_at: item.created_at
    };
}

// ================================
// PRODUCT QUERY PARAMS
// ================================
export interface ProductQueryParams {
    page?: number
    limit?: number
    sort?: string
    search?: string
    category_id?: number
    brand_id?: number
    stock?: string
}

// ================================
// GET PRODUCTS
// ================================
export async function getProducts(params: ProductQueryParams = {}): Promise<{ products: ProductType[]; pagination: ProductsPaginationResponse }> {
    const { page = 1, limit = 25, sort, search, category_id, brand_id, stock } = params
    
    const requestParams: Record<string, string | number> = { page, limit }
    
    if (sort) requestParams.sort = sort
    if (search) requestParams.search = search
    if (category_id) requestParams.category_id = category_id
    if (brand_id) requestParams.brand_id = brand_id
    if (stock) requestParams.stock = stock
    
    const response = await client.get<ProductsListResponse>(ENDPOINT.PRODUCTS, {
        params: requestParams
    })
    return {
        products: response.data.data.map(transformProductListItem),
        pagination: response.data.pagination
    }
}

// ================================
// USE GET PRODUCTS HOOK
// ================================
export const useGetProducts = (params: ProductQueryParams = {}) => {
    const { page = 1, limit = 25, sort, search, category_id, brand_id, stock } = params
    
    return useQuery({
        queryKey: ['products-list', page, limit, sort, search, category_id, brand_id, stock],
        queryFn: () => getProducts({ page, limit, sort, search, category_id, brand_id, stock }),
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Delete a product
 * @param id - Product ID
 * @returns Promise with the delete response
 */
export async function deleteProduct(id: number): Promise<DeleteProductResponse> {
    const response = await client.delete(`${ENDPOINT.PRODUCTS}/${id}`);
    return response.data;
}

/**
 * React Query mutation hook for deleting products
 * @returns Mutation object with mutate function and state
 */
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['products-list'] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Product deleted successfully';
            showSuccess(message, 'The product has been deleted successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to delete product', getErrorMessage(error));
        },
    });
};

/**
 * Fetch product details by ID
 * @param id - Product ID
 * @returns Promise with product detail response
 */
export async function getProductDetail(id: number): Promise<ProductDetailResponse> {
    const response = await client.get<ProductDetailApiResponse>(`${ENDPOINT.PRODUCTS}/${id}`);
    return response.data.data;
}

/**
 * React Query hook for fetching product details
 * @param id - Product ID
 * @returns Query object with product detail data and state
 */
export const useGetProductDetail = (id: number | undefined) => {
    return useQuery({
        queryKey: ['product-detail', id],
        queryFn: () => getProductDetail(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Update a product
 * @param id - Product ID
 * @param payload - Product data (Single or Variation type)
 * @returns Promise with the updated product response
 */
export async function updateProduct(id: number, payload: CreateProductPayload): Promise<CreateProductResponse> {
    const response = await client.patch(`${ENDPOINT.PRODUCTS}/${id}`, payload);
    return response.data;
}

/**
 * React Query mutation hook for updating products
 * @returns Mutation object with mutate function and state
 */
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    return useMutation({
        mutationFn: ({ id, productData }: { id: number; productData: CreateProductPayload }) => 
            updateProduct(id, productData),
        onSuccess: (data, variables) => {
            // ==============================
            // Invalidate relevant queries to refetch data
            // ==============================
            queryClient.invalidateQueries({ queryKey: ['products-list'] });
            queryClient.invalidateQueries({ queryKey: ['product-detail', variables.id] });

            // ==============================
            // Show success message
            // ==============================
            const message = 'Product updated successfully';
            showSuccess(message, 'The product has been updated successfully.');
        },
        onError: (error: unknown) => {
            showError('Failed to update product', getErrorMessage(error));
        },
    });
};

