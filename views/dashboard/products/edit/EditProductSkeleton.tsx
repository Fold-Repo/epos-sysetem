'use client'

import { DashboardCard, DashboardBreadCrumb } from '@/components'

const EditProductSkeleton = () => {
    return (
        <>
            {/* Breadcrumb Skeleton */}
            <div className="animate-pulse px-3">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            </div>

            <div className="p-3">
                <DashboardCard bodyClassName='p-5'>
                    <div className="space-y-6 animate-pulse">
                        {/* Form Title Skeleton */}
                        <div className="h-6 bg-gray-200 rounded w-48"></div>

                        {/* General Product Information - 3 Columns Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Middle Column */}
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Image Upload Skeleton */}
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-32 bg-gray-200 rounded border-2 border-dashed"></div>
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Single Product Fields Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>

                        {/* Variation Fields Skeleton */}
                        <div className="space-y-4">
                            <div className="h-5 bg-gray-200 rounded w-40"></div>
                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <div className="h-5 bg-gray-200 rounded w-32"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <div className="h-10 bg-gray-200 rounded w-24"></div>
                            <div className="h-10 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </>
    )
}

export default EditProductSkeleton

