'use client'

import { ExportButton, FilterBar, Pagination, StackIcon, TableCell, TableComponent } from '@/components'
import { useQueryParams } from '@/hooks'
import { formatCurrency } from '@/lib'
import Image from 'next/image'
import { SoldStockReportQueryParams, useGetCategories, useGetSoldStockReport } from '@/services'

const SoldStockTab = () => {
    const { searchParams, updateQueryParams } = useQueryParams()
    const categoryIdParam = searchParams.get('category_id')
    const parsedCategoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined

    const queryParams: SoldStockReportQueryParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
        search: searchParams.get('search') || undefined,
        category_id: parsedCategoryId && !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
    }

    const { data, isLoading } = useGetSoldStockReport(queryParams)
    const { data: categories } = useGetCategories(1, 200)
    const soldStockData = data?.soldStockReport ?? []
    const pagination = data?.pagination
    const selectedCategory = categories.find((item) => item.category_id === queryParams.category_id)

    const filterItems = [
        {
            type: 'dateRange' as const,
            startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
            endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
            onChange: (value: Date | { startDate: Date; endDate: Date }) => {
                if ('startDate' in value && 'endDate' in value) {
                    updateQueryParams({
                        startDate: value.startDate.toISOString().split('T')[0],
                        endDate: value.endDate.toISOString().split('T')[0],
                        page: 1
                    })
                }
            }
        },
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
        { key: 'unit', title: 'UNIT' },
        { key: 'quantity', title: 'QUANTITY' },
        { key: 'taxValue', title: 'TAX VALUE' },
        { key: 'total', title: 'TOTAL' }
    ]

    const renderRow = (item: (typeof soldStockData)[number]) => {
        return (
            <>
                <TableCell>
                    <span className='text-xs'>{item.sku}</span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Image 
                            src={item.productImage} 
                            alt={item.productName}
                            width={40} 
                            height={40} 
                            className='size-10 rounded-md object-cover' 
                            loading='lazy' 
                        />
                        <span className='text-xs'>{item.productName}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.unit}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>{item.quantity}</span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.taxValue)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className='text-xs font-medium'>
                        {formatCurrency(item.total)}
                    </span>
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
                data={soldStockData}
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

export default SoldStockTab

