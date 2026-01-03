'use client'

import { DashboardCard, DashboardBreadCrumb } from '@/components'

const ProductDetailsSkeleton = () => {
    return (
        <>
        
            <div className="animate-pulse px-3">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            </div>

            <div className="p-3 space-y-4">
                {/* ======================== Product Image Gallery Skeleton ======================== */}
                <div className="max-w-4xl">
                    <div className="flex md:flex-row flex-col gap-3 animate-pulse">
                        <div className="bg-gray-200 w-full aspect-square sm:aspect-9/5 lg:aspect-9/6 rounded-2xl"></div>
                        <div className="flex flex-row md:flex-col gap-1.5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-200 size-14 md:size-16 rounded-md"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ======================== Product Information Skeleton ======================== */}
                <DashboardCard title="Product Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="space-y-2 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-5 bg-gray-200 rounded w-32"></div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* ======================== Variations Skeleton ======================== */}
                <DashboardCard title="Variations">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white space-y-4 animate-pulse">
                                {/* Header */}
                                <div className="pb-3 border-b border-gray-100">
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>

                                {/* Pricing Details */}
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stock Details */}
                                <div className="space-y-2 pt-2 border-t border-gray-100">
                                    <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* ======================== Barcode Skeleton ======================== */}
                <DashboardCard title="Barcode" bodyClassName='flex justify-center py-6'>
                    <div className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded w-64"></div>
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

export default ProductDetailsSkeleton

