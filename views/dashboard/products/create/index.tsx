'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import { useGoBack } from '@/hooks'
import ProductForm, { ProductFormData } from '../ProductForm'
import { useCreateProduct, uploadImage } from '@/services'
import { CreateProductPayload, UPLOAD_FOLDER, ProductImage } from '@/types'
import { useState } from 'react'
import { useAppSelector, selectVariations } from '@/store'

const CreateProductView = () => {
    const goBack = useGoBack()
    const createProductMutation = useCreateProduct()
    const [isUploading, setIsUploading] = useState(false)
    const variations = useAppSelector(selectVariations)

    const transformFormDataToPayload = async (data: ProductFormData): Promise<CreateProductPayload> => {
        // ================================
        // Step 1: Upload images first (if any)
        // ================================
        let images: ProductImage[] = []
        if (data.multipleImage && data.multipleImage.length > 0) {
            setIsUploading(true)
            try {
                // Upload images and wait for completion
                const uploadedFiles = await uploadImage({
                    images: data.multipleImage,
                    folders: UPLOAD_FOLDER.PRODUCTS
                })
                
                images = uploadedFiles.map(file => ({
                    url: file.url,
                    public_id: file.public_id
                }))
            } catch (error) {
                setIsUploading(false)
                throw new Error('Failed to upload product images. Please try again.')
            } finally {
                setIsUploading(false)
            }
        }
        
        // ================================
        // Step 2: Create product payload with uploaded image URLs
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
            // Single/Simple product
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
            // Variation product
            // Get the variation name from the selected variation ID
            const selectedVariation = variations.find(v => v.id === Number(data.variations))
            const variationTypeName = selectedVariation?.name || ''

            const variationDetails = data.variationDetails.map(detail => ({
                variationType: variationTypeName, // Variation name (e.g., "Color", "Size")
                value: detail.variationType, // Variation option value (e.g., "Red", "Black", "Small")
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
        try {
            const payload = await transformFormDataToPayload(data)
            createProductMutation.mutate(payload, {
                onSuccess: () => {
                    goBack()
                }
            })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Products', href: '/dashboard/products' },
                    { label: 'Create Product' }
                ]}
                title='Create Product'
            />

            <div className="p-3">
                <DashboardCard bodyClassName='p-5'>
                    <ProductForm
                        mode="create"
                        onSubmit={handleSubmit}
                        onCancel={goBack}
                        submitButtonText="Save"
                        isLoading={isUploading || createProductMutation.isPending}
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default CreateProductView
