'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import ProductForm, { ProductFormData } from '../ProductForm'
import { useUpdateProduct, useGetProductDetail, uploadImage } from '@/services'
import { CreateProductPayload, UPLOAD_FOLDER, ProductImage, ProductDetailResponse } from '@/types'
import { useState, useMemo } from 'react'
import { useAppSelector, selectVariations, selectCategories, selectBrands, selectUnits } from '@/store'
import EditProductSkeleton from './EditProductSkeleton'

interface EditProductViewProps {
    productId: string
}

const EditProductView = ({ productId }: EditProductViewProps) => {

    const goBack = useGoBack()
    const updateProductMutation = useUpdateProduct()
    const [isUploading, setIsUploading] = useState(false)
    const variations = useAppSelector(selectVariations)
    const categories = useAppSelector(selectCategories)
    const brands = useAppSelector(selectBrands)
    const units = useAppSelector(selectUnits)
    
    // Fetch product details
    const { data: product, isLoading } = useGetProductDetail(Number(productId))

    // Transform API product detail to form data
    const initialFormData = useMemo(() => {
        if (!product) return undefined

        // Find category ID from name
        const category = categories.find(c => c.category_name === product.category_name)
        // Find brand ID from name
        const brand = brands.find(b => b.name === product.brand_name)
        // Find unit ID from name or short_name
        const unit = units.find(u => u.name === product.product_unit || u.short_name === product.product_unit)

        const formData: Partial<ProductFormData> = {
            name: product.name,
            productCategory: category ? String(category.category_id) : '',
            barcodeSymbology: product.barcode_symbology || 'code128', 
            quantityLimitation: product.quantity_limit,
            expiryDate: product.expiry_date ? new Date(product.expiry_date).toISOString().split('T')[0] : '',
            skuBarcode: product.sku,
            brand: brand ? String(brand.id) : '',
            productUnit: unit ? String(unit.id) : '',
            note: product.note || product.description || '', // Use note or description
            status: product.status.toLowerCase() === 'active' ? 'active' : 'inactive',
            productType: product.product_type === 'Simple' ? 'single' : 'variation',
            variations: '',
            variationTypes: [],
            variationDetails: [],
            multipleImage: null,
            productCost: '',
            productPrice: '',
            stockAlert: '',
            orderTax: '0',
            taxType: '',
            addProductQuantity: ''
        }

        // Handle single product fields
        if (product.product_type === 'Simple' && product.variations.length === 0) {
            // For single products, use the actual cost/price from API
            formData.productCost = product.product_cost && product.product_cost !== null ? product.product_cost : '0'
            formData.productPrice = product.product_price && product.product_price !== null ? product.product_price : '0'
            formData.stockAlert = product.stock_alert !== null ? String(product.stock_alert) : '0'
            formData.orderTax = product.tax_amount && product.tax_amount !== null ? product.tax_amount : '0'
            formData.taxType = product.tax_type || 'exclusive'
            formData.addProductQuantity = String(product.quantity_limit || 0)
        }

        // Handle variation product
        if (product.product_type === 'Variation' && product.variations.length > 0) {
            // Get variation type from first variation
            const firstVariation = product.variations[0]
            const variationType = variations.find(v => v.name === firstVariation.variation_type)
            
            if (variationType) {
                formData.variations = String(variationType.id)
                formData.variationTypes = product.variations.map(v => v.value)
                
                // Transform variations to form format
                formData.variationDetails = product.variations.map(variation => ({
                    variationType: variation.value,
                    productCost: variation.product_cost,
                    skuBarcode: variation.sku,
                    productPrice: variation.product_price,
                    stockAlert: String(variation.stock_alert),
                    orderTax: variation.tax_amount,
                    taxType: variation.tax_type,
                    addProductQuantity: String(variation.product_quantity)
                }))
            }
        }

        return formData
    }, [product, variations, categories, brands, units])

    const transformFormDataToPayload = async (data: ProductFormData, existingImages?: ProductImage[]): Promise<CreateProductPayload> => {
        // ================================
        // Step 1: Upload new images if any
        // ================================
        let images: ProductImage[] = existingImages || []
        if (data.multipleImage && data.multipleImage.length > 0) {
            setIsUploading(true)
            try {
                const uploadedFiles = await uploadImage({
                    images: data.multipleImage,
                    folders: UPLOAD_FOLDER.PRODUCTS
                })
                
                const newImages = uploadedFiles.map(file => ({
                    url: file.url,
                    public_id: file.public_id
                }))
                
                // Combine existing and new images
                images = [...images, ...newImages]
            } catch (error) {
                setIsUploading(false)
                throw new Error('Failed to upload product images. Please try again.')
            } finally {
                setIsUploading(false)
            }
        }
        
        // ================================
        // Step 2: Create product payload
        // ================================
        const basePayload = {
            name: data.name,
            description: data.note || '',
            sku: data.skuBarcode,
            barcodeSymbology: data.barcodeSymbology || 'Code 128',
            category_id: Number(data.productCategory),
            brand_id: Number(data.brand),
            product_unit: Number(data.productUnit),
            quantityLimit: Number(data.quantityLimitation) || 0,
            expiryDate: data.expiryDate || undefined,
            status: data.status === 'active' ? 'Active' as const : 'Inactive' as const,
            note: data.note || undefined,
            images
        }

        if (data.productType === 'single') {
            return {
                ...basePayload,
                productType: 'Simple' as const,
                productCost: parseFloat(data.productCost) || 0,
                productPrice: parseFloat(data.productPrice) || 0,
                stockAlert: Number(data.stockAlert) || 0,
                tax: {
                    amount: parseFloat(data.orderTax) || 0,
                    type: data.taxType === 'inclusive' ? 'inclusive' as const : 'exclusive' as const
                }
            }
        } else {
            const selectedVariation = variations.find(v => v.id === Number(data.variations))
            const variationTypeName = selectedVariation?.name || ''

            const variationDetails = data.variationDetails.map(detail => ({
                variationType: variationTypeName,
                value: detail.variationType,
                sku: detail.skuBarcode,
                productCost: parseFloat(detail.productCost) || 0,
                productPrice: parseFloat(detail.productPrice) || 0,
                productQuantity: Number(detail.addProductQuantity) || 0,
                stockAlert: Number(detail.stockAlert) || 0,
                tax: {
                    amount: parseFloat(detail.orderTax) || 0,
                    type: detail.taxType === 'inclusive' ? 'inclusive' as const : 'exclusive' as const
                }
            }))

            return {
                ...basePayload,
                productType: 'Variation' as const,
                variations: variationDetails
            }
        }
    }

    const handleSubmit = async (data: ProductFormData) => {
        if (!product) return

        try {
            
            const existingImages: ProductImage[] = product.images?.map(img => ({
                url: img.image_url,
                public_id: ''
            })) || []

            const payload = await transformFormDataToPayload(data, existingImages)

            // ================================
            // Update product
            // ================================
            updateProductMutation.mutate(
                { id: product.product_id, productData: payload },
                {
                    onSuccess: () => {
                        goBack()
                    }
                }
            )
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    if (isLoading) {
        return <EditProductSkeleton />
    }

    if (!product || !initialFormData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Product not found</p>
            </div>
        )
    }

    // Extract existing image URLs for display
    const existingImageUrls = product.images?.map(img => img.image_url) || []

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Products', href: '/dashboard/products' },
                    { label: product.name, href: `/dashboard/products/${productId}` },
                    { label: 'Edit Product' }
                ]}
                title='Edit Product'
            />

            <div className="p-3">
                <DashboardCard bodyClassName='p-5'>
                    <ProductForm
                        mode="edit"
                        initialData={initialFormData}
                        existingImages={existingImageUrls}
                        onSubmit={handleSubmit}
                        onCancel={goBack}
                        submitButtonText="Update"
                        isLoading={isUploading || updateProductMutation.isPending}
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default EditProductView

