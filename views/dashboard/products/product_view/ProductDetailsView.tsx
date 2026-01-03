'use client'

import { DashboardCard, DashboardBreadCrumb } from '@/components'
import { ProductImageGallery } from '../components'
import { formatCurrency } from '@/lib'
import Barcode from 'react-barcode'
import { Chip } from '@heroui/react'
import { useGetProductDetail } from '@/services'
import moment from 'moment'
import ProductDetailsSkeleton from './ProductDetailsSkeleton'
import { notFound } from 'next/navigation'

interface ProductDetailsViewProps {
    productId: string
}

const ProductDetailsView = ({ productId }: ProductDetailsViewProps) => {
    const { data: product, isLoading } = useGetProductDetail(Number(productId))

    const imageUrls = product?.images?.map(img => img.image_url) || []

    // ================================
    // Main Image
    // ================================
    let mainImageUrl: string | undefined = undefined
    if (product?.image_url) {
        try {
            const imageData = JSON.parse(product.image_url)
            if (typeof imageData === 'object' && imageData.url) {
                mainImageUrl = imageData.url
            } else if (typeof imageData === 'string') {
                mainImageUrl = imageData
            }
        } catch {
            mainImageUrl = product.image_url
        }
    }

    // ================================
    // Combine all images (main image + images array, avoiding duplicates)
    // ================================
    const allImages = mainImageUrl && !imageUrls.includes(mainImageUrl)
        ? [mainImageUrl, ...imageUrls]
        : imageUrls.length > 0
            ? imageUrls
            : mainImageUrl
                ? [mainImageUrl]
                : []

    // ================================
    // Format price display
    // ================================
    const priceDisplay = product
        ? product.min_price === product.max_price
            ? formatCurrency(parseFloat(product.min_price))
            : `${formatCurrency(parseFloat(product.min_price))} - ${formatCurrency(parseFloat(product.max_price))}`
        : ''

    if (isLoading) {
        return <ProductDetailsSkeleton />
    }

    if (!product) return notFound()

    return (
        <>
        
            <DashboardBreadCrumb
                items={[
                    { label: 'Products', href: '/dashboard/products' },
                    { label: product.name }
                ]}
                title={product.name}
            />

            <div className="p-3 space-y-4">

                {/* ======================== Product Image Gallery ======================== */}
                <div className="max-w-4xl">
                    {allImages.length > 0 && (
                        <ProductImageGallery
                            images={allImages}
                            productName={product.name}
                        />
                    )}
                </div>

                {/* ======================== Product Information ======================== */}
                <DashboardCard title="Product Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Product Code (SKU)</h6>
                            <p className="text-sm font-medium text-gray-700">{product.sku}</p>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Product Name</h6>
                            <p className="text-sm font-medium text-gray-700">{product.name}</p>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Price</h6>
                            <p className="text-sm font-medium text-gray-700">{priceDisplay}</p>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Product Type</h6>
                            <Chip size="sm" variant="flat"
                                color={product.product_type === 'Simple' ? 'primary' : 'secondary'}>
                                {product.product_type === 'Simple' ? 'Single' : 'Variation'}
                            </Chip>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Category</h6>
                            <p className="text-sm font-medium text-gray-700">{product.category_name}</p>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Brand</h6>
                            <p className="text-sm font-medium text-gray-700">{product.brand_name}</p>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Unit</h6>
                            <Chip size="sm" variant="flat" color="success" className="text-green-700 bg-green-100">
                                {product.product_unit}
                            </Chip>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Quantity Limit</h6>
                            <p className="text-sm font-medium text-gray-700">{product.quantity_limit}</p>
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Status</h6>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={product.status === 'Active' ? 'success' : 'default'}
                            >
                                {product.status}
                            </Chip>
                        </div>

                        {product.expiry_date && (
                            <div className="space-y-2">
                                <h6 className="text-sm text-gray-400">Expiry Date</h6>
                                <p className="text-sm font-medium text-gray-700">
                                    {moment(product.expiry_date).format('lll')}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <h6 className="text-sm text-gray-400">Created At</h6>
                            <p className="text-sm font-medium text-gray-700">
                                {moment(product.created_at).format('lll')}
                            </p>
                        </div>

                        {product.updated_at && (
                            <div className="space-y-2">
                                <h6 className="text-sm text-gray-400">Last Updated</h6>
                                <p className="text-sm font-medium text-gray-700">
                                    {moment(product.updated_at).format('lll')}
                                </p>
                            </div>
                        )}
                    </div>
                </DashboardCard>

                {/* ======================== Variations ======================== */}
                {product.product_type === 'Variation' && product.variations && product.variations.length > 0 && (
                    <DashboardCard title="Variations">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.variations.map((variation, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white space-y-4">

                                    <div className="pb-3 border-b border-gray-100">

                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            {variation.variation_type} - {variation.value}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">SKU</span>
                                            <span className="text-xs font-medium text-gray-700">{variation.sku}</span>
                                        </div>
                                    </div>

                                    {/* Pricing Details */}
                                    <div className="space-y-2">
                                        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pricing Details</h6>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Cost</span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {formatCurrency(parseFloat(variation.product_cost))}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Price</span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {formatCurrency(parseFloat(variation.product_price))}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Tax</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-700">
                                                    {formatCurrency(parseFloat(variation.tax_amount))}
                                                </span>
                                                <Chip size="sm" variant="flat" color="secondary">
                                                    {variation.tax_type}
                                                </Chip>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stock Details */}
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stock Details</h6>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">In Stock</span>
                                            <span className="text-xs font-medium text-gray-700">{variation.product_quantity}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Stock Alert</span>
                                            <span className="text-xs font-medium text-gray-700">{variation.stock_alert}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                )}

                {/* ======================== Barcode ======================== */}
                <DashboardCard title="Barcode" bodyClassName='flex justify-center'>
                    <Barcode
                        value={product.sku}
                        format="CODE128"
                        width={2}
                        height={80}
                        displayValue={true}
                        fontSize={14}
                    />
                </DashboardCard>
            </div>
        </>
    )
}

export default ProductDetailsView

