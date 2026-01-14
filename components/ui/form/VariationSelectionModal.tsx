'use client'

import { PopupModal } from '@/components'
import { ProductVariationDetailResponse, ProductDetailResponse } from '@/types'
import { formatCurrency } from '@/lib'
import { Button, Chip } from '@heroui/react'

interface VariationSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    productName: string
    variations: ProductVariationDetailResponse[]
    onSelect: (variation: ProductVariationDetailResponse, productDetail: ProductDetailResponse) => void
    productDetail: ProductDetailResponse
}

const VariationSelectionModal = ({
    isOpen,
    onClose,
    productName,
    variations,
    onSelect,
    productDetail
}: VariationSelectionModalProps) => {
    const handleSelect = (variation: ProductVariationDetailResponse) => {
        onSelect(variation, productDetail)
        onClose()
    }

    return (
        <PopupModal
            size="lg"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title={`Select Variation - ${productName}`}
            description="Choose a variation for this product"
            bodyClassName='p-5'>
            
            <div className="space-y-3">
                {variations.map((variation, index) => (
                    <div key={variation.id || index}
                        className="p-3 border border-gray-200 rounded-xl hover:border-primary cursor-pointer transition-colors divide-y divide-gray-200" onClick={() => handleSelect(variation)}>

                        <div className="flex items-center justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <Chip className='text-[10px]' size="sm" variant="flat">
                                    {variation.variation_type}: {variation.value}
                                </Chip>
                                <span className="text-[11px] text-gray-600">SKU: {variation.sku}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-[11px] py-2">
                            <div>
                                <span className="text-gray-600">Cost:</span>
                                <p className="font-medium">{formatCurrency(parseFloat(variation.product_cost))}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-[11px]">Price:</span>
                                <p className="font-medium">{formatCurrency(parseFloat(variation.product_price))}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-[11px]">Stock:</span>
                                <p className="font-medium">{variation.product_quantity}</p>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-gray-600">Tax:</span>
                        <span className="text-[11px] font-medium">
                                {variation.tax_type === 'percent' 
                                    ? `${variation.tax_amount}%`
                                    : formatCurrency(parseFloat(variation.tax_amount))
                                }
                                <span className="text-gray-600"> ({variation.tax_type})</span>
                            </span>
                        </div>

                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end">
                <Button onPress={onClose} variant='light' color='danger' size="sm" className="px-4 h-9">
                    Cancel
                </Button>
            </div>
        </PopupModal>
    )
}

export default VariationSelectionModal

