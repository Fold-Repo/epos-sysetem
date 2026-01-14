'use client'

import { CustomAutocomplete, useDisclosure } from '@/components'
import { useProductSearch } from '@/hooks'
import { ProductType, ProductDetailResponse, ProductVariationDetailResponse } from '@/types'
import { useState, useEffect } from 'react'
import { useGetProductDetail } from '@/services'
import VariationSelectionModal from './VariationSelectionModal'

interface ProductSelectProps {
    name: string
    label?: string
    placeholder?: string
    value?: string
    onChange?: (product: ProductType | null) => void
    onProductSelect?: (product: ProductType) => void
    onItemAdd?: (item: any) => void 
    existingItems?: Array<{ productId: string }> 
    itemMapper?: (product: ProductType, id: string) => any 
    limit?: number
    sort?: string
    className?: string
    formGroupClass?: string
    labelClassName?: string
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full"
    inputSize?: "sm" | "md" | "lg"
    isDisabled?: boolean
    error?: string
}

/**
 * Reusable Product Select component with search and loading state
 * Fetches products from API with search functionality
 * Returns the full product object when selected
 */
const ProductSelect = ({
    name,
    label = "Product",
    placeholder = "Search Product",
    value,
    onChange,
    onProductSelect,
    onItemAdd,
    existingItems = [],
    itemMapper,
    limit = 20,
    sort = 'name_asc',
    className,
    formGroupClass,
    labelClassName,
    radius = "lg",
    inputSize = "sm",
    isDisabled = false,
    error
}: ProductSelectProps) => {
    
    const [selectedProductId, setSelectedProductId] = useState<string>(value || '')
    const [pendingProductId, setPendingProductId] = useState<number | null>(null)
    const [pendingProductName, setPendingProductName] = useState<string>('')
    const { isOpen: isVariationModalOpen, onOpen: onVariationModalOpen, onClose: onVariationModalClose } = useDisclosure()
    
    // ================================
    // Use the reusable product search hook
    // ================================
    const { products, productOptions, setSearchQuery, isLoading } = useProductSearch({
        limit,
        sort
    })

    // ================================
    // Fetch product details when a product is selected (to check for variations)
    // ================================
    const { data: productDetail, isLoading: isLoadingProductDetail } = useGetProductDetail(
        pendingProductId !== null ? pendingProductId : undefined
    )

    // ================================
    // Handle product selection
    // ================================
    const handleChange = (selectedValue: any) => {
        if (typeof selectedValue === 'string' && selectedValue) {
            const selectedProduct = products.find(p => p.id === selectedValue)
            
            if (selectedProduct) {
                setSelectedProductId(selectedProduct.id)
                
                setPendingProductId(parseInt(selectedProduct.id))
                setPendingProductName(selectedProduct.name)
            }
        } else if (!selectedValue) {
            setSelectedProductId('')
            if (onChange) {
                onChange(null)
            }
        }
    }

    // ================================
    // Handle product detail loaded - check for variations
    // ================================
    useEffect(() => {
        if (!productDetail || !pendingProductId) return

        // ================================
        // HANDLE VARIATION PRODUCTS
        // ================================
        const isVariationProduct = productDetail.variations && productDetail.variations.length > 0
        
        if (isVariationProduct) {
            onVariationModalOpen()
        } else {
            // ================================
            // HANDLE SIMPLE PRODUCTS
            // ================================
            handleSimpleProductAdd(productDetail)
        }
    }, [productDetail, pendingProductId, onVariationModalOpen])

    // ================================
    // Handle simple product addition
    // ================================
    const handleSimpleProductAdd = (productDetail: ProductDetailResponse) => {
        const selectedProduct = products.find(p => p.id === String(productDetail.product_id))
        if (!selectedProduct) return

        // ================================
        // CHECK FOR DUPLICATES
        // ================================
        if (existingItems.length > 0) {
            const existingItem = existingItems.find(item => 
                item.productId === selectedProduct.id && 
                !(item as any).variationId 
            )
            if (existingItem) {
                setSelectedProductId('')
                setPendingProductId(null)
                setPendingProductName('')
                return
            }
        }

        if (onChange) {
            onChange(selectedProduct)
        }
        
        if (onProductSelect) {
            onProductSelect(selectedProduct)
        }
        
        // ================================
        // CREATE AND ADD ITEM
        // ================================
        if (itemMapper && onItemAdd) {
            const newItem = itemMapper(selectedProduct, `item-${Date.now()}-${Math.random()}`)
            onItemAdd(newItem)
        }
        
        setSelectedProductId('')
        setPendingProductId(null)
        setPendingProductName('')
    }

    // ================================
    // Handle variation selection
    // ================================
    const handleVariationSelect = (variation: ProductVariationDetailResponse, productDetail: ProductDetailResponse) => {
        if (!productDetail) return

        const selectedProduct = products.find(p => p.id === String(productDetail.product_id))
        if (!selectedProduct) return

        if (existingItems.length > 0) {
            const existingItem = existingItems.find(item => 
                item.productId === selectedProduct.id && 
                (item as any).variationId === variation.id
            )
            if (existingItem) {
                setSelectedProductId('')
                setPendingProductId(null)
                setPendingProductName('')
                return
            }
        }

        // ================================
        // CALL ONCHANGE CALLBACK
        // ================================
        if (onChange) {
            onChange(selectedProduct)
        }
        
        // ================================
        // CALL ONPRODUCTSELECT CALLBACK
        // ================================
        if (onProductSelect) {
            onProductSelect(selectedProduct)
        }
        
        // ================================
        // CREATE AND ADD ITEM WITH VARIATION DATA
        // ================================
        if (itemMapper && onItemAdd) {

            const variationCost = parseFloat(variation.product_cost)
            const taxAmountValue = parseFloat(variation.tax_amount)
            
            // tax_amount from API is already a percentage value (as entered in the form)
            // Use it directly as the tax percentage
            const taxPercent = taxAmountValue
            
            const productWithVariation = {
                ...selectedProduct,
                variationId: variation.id,
                variationType: variation.variation_type,
                variationValue: variation.value,
                variationSku: variation.sku,
                price: variationCost, 
                stock: variation.product_quantity,
                tax: taxPercent,
                taxType: variation.tax_type
            }
            
            const newItem = itemMapper(productWithVariation, `item-${Date.now()}-${Math.random()}`)
            onItemAdd(newItem)
        }
        
        setSelectedProductId('')
        setPendingProductId(null)
        setPendingProductName('')
    }

    // ================================
    // Handle search input change
    // ================================
    const handleInputChange = (inputValue: string) => {
        setSearchQuery(inputValue)
    }

    // ================================
    // DETERMINE LOADING STATE
    // ================================
    const isComponentLoading = isLoading || isLoadingProductDetail
    const loadingPlaceholder = isLoading 
        ? "Loading products..." 
        : isLoadingProductDetail 
            ? "Checking product details..." 
            : placeholder

    return (
        <>
            <CustomAutocomplete
                name={name}
                label={label}
                placeholder={loadingPlaceholder}
                radius={radius}
                inputSize={inputSize}
                options={productOptions}
                value={selectedProductId}
                onChange={handleChange}
                onInputChange={handleInputChange}
                isDisabled={isDisabled || isLoadingProductDetail}
                isLoading={isComponentLoading}
                className={className}
                formGroupClass={formGroupClass}
                labelClassName={labelClassName}
                error={error}
            />

            {productDetail && productDetail.variations && productDetail.variations.length > 0 && (
                <VariationSelectionModal
                    isOpen={isVariationModalOpen}
                    onClose={() => {
                        onVariationModalClose()
                        setPendingProductId(null)
                        setPendingProductName('')
                        setSelectedProductId('')
                    }}
                    productName={pendingProductName || productDetail.name}
                    variations={productDetail.variations}
                    productDetail={productDetail}
                    onSelect={handleVariationSelect}
                />
            )}
        </>
    )
}

export default ProductSelect

