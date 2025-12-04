import { DashboardCard, PopupModal } from '@/components'
import { ProductImageGallery } from '../components'
import { formatCurrency } from '@/lib'
import Barcode from 'react-barcode'
import { Chip } from '@heroui/react'

interface ViewProductModalProps {
    isOpen: boolean
    onClose: () => void
    productId?: string
}

const ViewProductModal = ({ isOpen, onClose, productId }: ViewProductModalProps) => {
    const barcodeValue = 'B8D5FZCH'

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

            <div className="space-y-4 p-4">

                <ProductImageGallery
                    images={[
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
                        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
                        'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
                    ]}
                    productName="Wireless Bluetooth Headphones"
                />

                {/* ================================================ */}
                {/* Product Details */}
                {/* ================================================ */}
                <DashboardCard bodyClassName='divide-y divide-gray-200'>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Product Code</p>
                        <p className='font-medium text-gray-700'>B8D5FZCH</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Product Name</p>
                        <p className='font-medium text-gray-700'>cecular-03</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Price</p>
                        <p className='font-medium text-gray-700'> {formatCurrency(100.00)} </p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Tax</p>
                        <p className='font-medium text-gray-700'> {formatCurrency(10.00)} </p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Brand</p>
                        <p className='font-medium text-gray-700'>TechSound</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Product Type</p>
                        <p className='font-medium text-gray-700'>Single</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Category</p>
                        <p className='font-medium text-gray-700'>Electronics</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Unit</p>
                        <p className='font-medium text-gray-700'>Piece</p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-3 first:pt-0 last:pb-0">
                        <p className='text-gray-500'>Stock</p>
                        <p className='font-medium text-gray-700'>100</p>
                    </div>

                </DashboardCard>


                {/* ================================================ */}
                {/* Generate Barcode */}
                {/* ================================================ */}
                <DashboardCard bodyClassName='flex justify-center'>
                    <Barcode
                        value={barcodeValue}
                        format="CODE128"
                        width={2}
                        height={80}
                        displayValue={true}
                        fontSize={14}
                    />
                </DashboardCard>

                {/* ================================================ */}
                {/* Product Variants */}
                {/* ================================================ */}
                <DashboardCard bodyClassName='p-0'>

                    <div className="grid grid-cols-2 gap-3 p-4">
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Warehouse Location</p>
                            <p className="text-lg font-semibold text-secondary mb-1">warehouse</p>
                            <p className="text-xs text-gray-500">Primary storage facility</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Stock Quantity</p>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-lg font-semibold text-secondary">12,228</p>
                                <Chip size="sm" color='success' className="text-white text-[10px]">
                                    units
                                </Chip>
                            </div>
                            <p className="text-xs text-gray-500">Primary storage facility</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <p className="text-lg font-semibold text-secondary mb-1">In Stock</p>
                            <p className="text-xs text-gray-500">Available for order</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                            <p className="text-lg font-semibold text-secondary mb-1">Just now</p>
                            <p className="text-xs text-gray-500">Auto-synced</p>
                        </div>

                    </div>
                    
                </DashboardCard>

            </div>

        </PopupModal>
    )
}

export default ViewProductModal

