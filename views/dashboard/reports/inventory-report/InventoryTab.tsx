'use client'

import { FilterBar, Pagination, DashboardCard, StackIcon, ExportButton, TableCell, TableComponent } from '@/components'
import { useQueryParams } from '@/hooks'
import { InventoryReportQueryParams, useGetCategories, useGetInventoryReport } from '@/services'

const InventoryTab = () => {
    const { searchParams, updateQueryParams } = useQueryParams()
    const categoryIdParam = searchParams.get('category_id')
    const parsedCategoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined

    const queryParams: InventoryReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        category_id: parsedCategoryId && !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined,
    }

    const { data, isLoading } = useGetInventoryReport(queryParams)
    const { data: categories } = useGetCategories(1, 200)
    const inventoryData = data?.inventoryReport ?? []
    const pagination = data?.pagination
    const selectedCategory = categories.find((item) => item.category_id === queryParams.category_id)

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: selectedCategory ? `Category: ${selectedCategory.category_name}` : 'Category: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                ...categories.map((category) => ({
                    label: category.category_name,
                    key: String(category.category_id)
                }))
            ],
            value: queryParams.category_id ? String(queryParams.category_id) : 'all',
            onChange: (key: string) => {
                updateQueryParams({
                    category_id: key === 'all' ? null : key,
                    page: 1
                })
            }
        }
    ]

    const columns = [
        { key: 'sku', title: 'SKU' },
        { key: 'productName', title: 'PRODUCT NAME' },
        { key: 'category', title: 'CATEGORY' },
        { key: 'unit', title: 'UNIT' },
        { key: 'instock', title: 'INSTOCK' }
    ]

    const renderRow = (item: (typeof inventoryData)[number]) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{item.sku}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.productName}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.category}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs'>{item.unit}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.instock}</span>
                </TableCell>
            </>
        )
    }

    return (
        <div className="space-y-4">
            
            <FilterBar
                searchInput={{
                    placeholder: 'Search by SKU or product name',
                    className: 'w-full md:w-72',
                    onSearch: (value: string) => {
                        updateQueryParams({
                            search: value || null,
                            page: 1
                        })
                    }
                }}
                items={filterItems}
                endContent={<ExportButton />}
            />

            <TableComponent
                className='border border-gray-200 overflow-hidden rounded-xl'
                columns={columns}
                data={inventoryData}
                rowKey={(item) => item.id}
                renderRow={renderRow}
                withCheckbox={false}
                loading={isLoading}
            />

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={(page) => {
                        updateQueryParams({ page })
                    }}
                    showingText="Products"
                />
            )}
        </div>
    )
}

export default InventoryTab

