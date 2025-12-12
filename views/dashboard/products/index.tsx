'use client'

import { DashboardCard, FilterTabs } from '@/components'
import { DashboardBreadCrumb } from '@/components/dashboard'
import { useQueryParams } from '@/hooks'
import { useState, useRef } from 'react'
import ProductsListView from './product_view'
import ProductCategoryView from './category'
import ProductVariationsView from './variations'
import ProductBrandView from './brand'
import ProductUnitsView from './units'
import ProductBarcodeView from './barcode'
import { Button } from '@heroui/react'

const ProductsView = () => {

    const { searchParams, updateQueryParams } = useQueryParams()
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'products')

    const onClickHandlerRef = useRef<(() => void) | null>(null)

    const handleAddClick = () => {
        onClickHandlerRef.current?.()
    }

    const getTabContent = (tab: string) => {
        
        const registerHandler = (handler: () => void) => {
            onClickHandlerRef.current = handler
        }

        switch (tab) {
            case 'products':
                return <ProductsListView onAddClick={registerHandler} />
            case 'category':
                return <ProductCategoryView onAddClick={registerHandler} />
            case 'variations':
                return <ProductVariationsView onAddClick={registerHandler} />
            case 'brand':
                return <ProductBrandView onAddClick={registerHandler} />
            case 'units':
                return <ProductUnitsView onAddClick={registerHandler} />
            case 'barcode':
                return <ProductBarcodeView />
            default:
                return null
        }
    }

    const getButtonTitle = (tab: string) => {
        switch (tab) {
            case 'products':
                return 'Add Product'
            case 'category':
                return 'Add Category'
            case 'variations':
                return 'Add Variation'
            case 'brand':
                return 'Add Brand'
            case 'units':
                return 'Add Unit'
            default:
                return null
        }
    }
    
    return (
        <>

            <DashboardBreadCrumb
                title='Products'
                description="Manage your products here. Add, edit, and delete products as needed."
                endContent={
                    getButtonTitle(activeTab || '') && (
                    <Button size='sm' className='px-4 bg-primary text-white h-9'
                        onPress={handleAddClick}>
                            {getButtonTitle(activeTab || '')}
                        </Button>
                    )
                }
            />

            <div className="p-3">

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= Tab Navigation ================= */}
                    <div className="flex flex-wrap items-center gap-3 justify-between border-y border-slate-200 py-2">
                        <FilterTabs
                            className='w-full md:w-fit'
                            items={[
                                { label: 'Products', key: 'products' },
                                { label: 'Category', key: 'category' },
                                { label: 'Variations', key: 'variations' },
                                { label: 'Brand', key: 'brand' },
                                { label: 'Units', key: 'units' },
                                { label: 'Barcode', key: 'barcode' }
                            ]}
                            activeKey={activeTab}
                            onTabChange={(key) => {
                                setActiveTab(key)
                                updateQueryParams({ tab: key })
                            }}
                        />

                    </div>

                    {getTabContent(activeTab)}

                </DashboardCard>

            </div>

        </>
    )
}

export default ProductsView

