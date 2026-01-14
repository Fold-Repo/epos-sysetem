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
    
    // ================================
    // FETCH PRODUCT DETAILS
    // ================================
    const { data: product, isLoading } = useGetProductDetail(Number(productId))

    // ================================
    // TRANSFORM API PRODUCT DETAIL TO FORM DATA
    // ================================
    const initialFormData = useMemo(() => {
        if (!product) return undefined

        // ================================
        // FIND MATCHING CATEGORY, BRAND, UNIT BY ID
        // ================================
        const category = categories.find(c => c.category_id === product.category.id)
        const brand = brands.find(b => b.id === product.brand.id)
        const unit = units.find(u => u.name === product.unit.name || u.short_name === product.unit.name)

        // ================================
        // DETERMINE IF VARIATION PRODUCT
        // ================================
        const isVariationProduct = product.variations && product.variations.length > 0

        const formData: Partial<ProductFormData> = {
            name: product.name,
            productCategory: category ? String(category.category_id) : '',
            barcodeSymbology: product.barcode_symbology || 'code128', 
            quantityLimitation: product.stock.quantity,
            expiryDate: product.expiry_date ? new Date(product.expiry_date).toISOString().split('T')[0] : '',
            skuBarcode: product.sku,
            brand: brand ? String(brand.id) : '',
            productUnit: unit ? String(unit.id) : product.unit.id || '',
            description: product.description || '',
            status: product.status.toLowerCase() === 'active' ? 'active' : 'inactive',
            productType: isVariationProduct ? 'variation' : 'single',
            variations: '',
            variationTypes: [],
            variationDetails: [],
            multipleImage: null,
            productCost: '',
            productPrice: '',
            stockAlert: '',
            orderTax: '0',
            taxIsPercentage: product.tax.type === 'percent' || !product.tax.type,
            addProductQuantity: ''
        }

        // ================================
        // HANDLE SINGLE PRODUCT FIELDS
        // ================================
        if (!isVariationProduct) {
            // ================================
            // FOR SIMPLE PRODUCTS USE PRICING DATA
            // ================================
            formData.productCost = product.pricing.cost_price || product.pricing.min_price || '0'
            formData.productPrice = product.pricing.selling_price || product.pricing.min_price || '0'
            formData.stockAlert = product.stock.alert_level !== null ? String(product.stock.alert_level) : '0'
            formData.orderTax = product.tax.amount || '0'
            formData.addProductQuantity = String(product.stock.quantity || 0)
        }

        // ================================
        // HANDLE VARIATION PRODUCT
        // ================================
        if (isVariationProduct) {

            // ================================
            // GET VARIATION TYPE FROM FIRST VARIATION
            // ================================
            const firstVariation = product.variations[0]
            const variationType = variations.find(v => v.name === firstVariation.variation_type)
            
            if (variationType) {
                formData.variations = String(variationType.id)
                formData.variationTypes = product.variations.map(v => v.value)
                
                formData.variationDetails = product.variations.map(variation => ({
                    variationType: variation.value,
                    productCost: variation.product_cost,
                    skuBarcode: variation.sku,
                    productPrice: variation.product_price,
                    stockAlert: String(variation.stock_alert),
                    orderTax: variation.tax_amount,
                    taxIsPercentage: variation.tax_type === 'percent' || !variation.tax_type,
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
                
                // ================================
                // COMBINE EXISTING AND NEW IMAGES
                // ================================
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
            description: data.description || '',
            sku: data.skuBarcode,
            barcodeSymbology: data.barcodeSymbology || 'Code 128',
            category_id: Number(data.productCategory),
            brand_id: Number(data.brand),
            product_unit: Number(data.productUnit),
            quantityLimit: Number(data.quantityLimitation) || 0,
            expiryDate: data.expiryDate || undefined,
            status: data.status === 'active' ? 'Active' as const : 'Inactive' as const,
            images
        }

        if (data.productType === 'single') {
            const taxType = data.taxIsPercentage ? 'percent' as const : 'fixed' as const
            return {
                ...basePayload,
                productType: 'Simple' as const,
                productCost: parseFloat(data.productCost) || 0,
                productPrice: parseFloat(data.productPrice) || 0,
                stockAlert: Number(data.stockAlert) || 0,
                tax: {
                    amount: parseFloat(data.orderTax) || 0,
                    type: taxType
                }
            }
        } else {
            const selectedVariation = variations.find(v => v.id === Number(data.variations))
            const variationTypeName = selectedVariation?.name || ''

            const variationDetails = data.variationDetails.map(detail => {
                const taxType = detail.taxIsPercentage ? 'percent' as const : 'fixed' as const
                return {
                    variationType: variationTypeName,
                    value: detail.variationType,
                    sku: detail.skuBarcode,
                    productCost: parseFloat(detail.productCost) || 0,
                    productPrice: parseFloat(detail.productPrice) || 0,
                    productQuantity: Number(detail.addProductQuantity) || 0,
                    stockAlert: Number(detail.stockAlert) || 0,
                    tax: {
                        amount: parseFloat(detail.orderTax) || 0,
                        type: taxType
                    }
                }
            })

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

    // ================================
    // EXTRACT EXISTING IMAGE URLS FOR DISPLAY  
    // ================================
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

