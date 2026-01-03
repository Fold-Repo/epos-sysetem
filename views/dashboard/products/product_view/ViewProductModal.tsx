'use client'

import { DashboardCard, PopupModal } from '@/components'
import { ProductImageGallery } from '../components'
import { formatCurrency } from '@/lib'
import Barcode from 'react-barcode'
import { Chip } from '@heroui/react'
import { useGetProductDetail } from '@/services'
import moment from 'moment'
import { Spinner } from '@heroui/react'

interface ViewProductModalProps {
    isOpen: boolean
    onClose: () => void
    productId?: string
}

const ViewProductModal = ({ isOpen, onClose, productId }: ViewProductModalProps) => {
    const { data: product, isLoading } = useGetProductDetail(productId ? Number(productId) : undefined)

    // Parse image URLs from the images array
    const imageUrls = product?.images?.map(img => img.image_url) || []

    // Parse main image_url if it exists
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

    // Combine all images (main image + images array, avoiding duplicates)
    const allImages = mainImageUrl && !imageUrls.includes(mainImageUrl)
        ? [mainImageUrl, ...imageUrls]
        : imageUrls.length > 0
        ? imageUrls
        : mainImageUrl
        ? [mainImageUrl]
        : []

    // Format price display
    const priceDisplay = product
        ? product.min_price === product.max_price
            ? formatCurrency(parseFloat(product.min_price))
            : `${formatCurrency(parseFloat(product.min_price))} - ${formatCurrency(parseFloat(product.max_price))}`
        : ''

    if (isLoading) {
        return (
            <PopupModal
                size="3xl"
                radius="2xl"
                isOpen={isOpen}
                onClose={onClose}
                placement="center"
                className='max-h-[95vh]'
                title="View Product"
                description="View product details">
                <div className="flex items-center justify-center p-8">
                    <Spinner size="lg" />
                </div>
            </PopupModal>
        )
    }

    if (!product) {
        return (
            <PopupModal
                size="3xl"
                radius="2xl"
                isOpen={isOpen}
                onClose={onClose}
                placement="center"
                className='max-h-[95vh]'
                title="View Product"
                description="View product details">
                <div className="flex items-center justify-center p-8">
                    <p className="text-gray-500">Product not found</p>
                </div>
            </PopupModal>
        )
    }

    return (
        <PopupModal
            size="3xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title="View Product"
            description="View product details">

            <div className="space-y-4 p-4 overflow-y-auto max-h-[85vh]">

                {/* ================================================ */}
                {/* Product Images */}
                {/* ================================================ */}
                {allImages.length > 0 && (
                    <ProductImageGallery
                        images={allImages}
                        productName={product.name}
                    />
                )}

                {/* ================================================ */}
                {/* Product Details */}
                {/* ================================================ */}
                <DashboardCard bodyClassName='divide-y divide-gray-200'>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Product Code (SKU)</p>
                        <p className='font-medium text-gray-700'>{product.sku}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Product Name</p>
                        <p className='font-medium text-gray-700'>{product.name}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Price</p>
                        <p className='font-medium text-gray-700'>{priceDisplay}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Brand</p>
                        <p className='font-medium text-gray-700'>{product.brand_name}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Product Type</p>
                        <p className='font-medium text-gray-700'>{product.product_type === 'Simple' ? 'Single' : 'Variation'}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Category</p>
                        <p className='font-medium text-gray-700'>{product.category_name}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Unit</p>
                        <p className='font-medium text-gray-700'>{product.product_unit}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Quantity Limit</p>
                        <p className='font-medium text-gray-700'>{product.quantity_limit}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Status</p>
                        <Chip 
                            size="sm" 
                            color={product.status === 'Active' ? 'success' : 'default'}
                            className={product.status === 'Active' ? 'text-white' : ''}
                        >
                            {product.status}
                        </Chip>
                    </div>

                    {product.expiry_date && (
                        <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                            <p className='text-gray-500'>Expiry Date</p>
                            <p className='font-medium text-gray-700'>{moment(product.expiry_date).format('lll')}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Created At</p>
                        <p className='font-medium text-gray-700'>{moment(product.created_at).format('lll')}</p>
                    </div>

                    {product.updated_at && (
                        <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                            <p className='text-gray-500'>Last Updated</p>
                            <p className='font-medium text-gray-700'>{moment(product.updated_at).format('lll')}</p>
                        </div>
                    )}

                </DashboardCard>

                {/* ================================================ */}
                {/* Generate Barcode */}
                {/* ================================================ */}
                <DashboardCard bodyClassName='flex justify-center'>
                    <Barcode
                        value={product.sku}
                        format="CODE128"
                        width={2}
                        height={80}
                        displayValue={true}
                        fontSize={14}
                    />
                </DashboardCard>

                {/* ================================================ */}
                {/* Product Variations (if Variation type) */}
                {/* ================================================ */}
                {product.product_type === 'Variation' && product.variations && product.variations.length > 0 && (
                    <DashboardCard bodyClassName='p-0'>
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700">Product Variations</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {product.variations.map((variation, index) => (
                                <div key={index} className="p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Chip size="sm" variant="flat" color="primary">
                                                {variation.variation_type}
                                            </Chip>
                                            <span className="text-sm font-medium text-gray-700">{variation.value}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">SKU: {variation.sku}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Cost</p>
                                            <p className="font-medium text-gray-700">{formatCurrency(parseFloat(variation.product_cost))}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Price</p>
                                            <p className="font-medium text-gray-700">{formatCurrency(parseFloat(variation.product_price))}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Quantity</p>
                                            <p className="font-medium text-gray-700">{variation.product_quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Stock Alert</p>
                                            <p className="font-medium text-gray-700">{variation.stock_alert}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Tax Amount</p>
                                            <p className="font-medium text-gray-700">{formatCurrency(parseFloat(variation.tax_amount))}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Tax Type</p>
                                            <Chip size="sm" variant="flat" color="secondary">
                                                {variation.tax_type}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                )}

            </div>

        </PopupModal>
    )
}

export default ViewProductModal
