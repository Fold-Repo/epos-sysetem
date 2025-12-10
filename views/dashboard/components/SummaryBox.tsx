'use client'

import { TableComponent, TableCell } from '@/components'
import { formatCurrency } from '@/lib'

export interface SummaryItem {
    label: string
    value: string | number
    isTotal?: boolean
    isPercentage?: boolean
}

interface SummaryBoxProps {
    items: SummaryItem[]
    className?: string
}

const SummaryBox = ({ items, className = '' }: SummaryBoxProps) => {
    return (
        <div className={`max-w-md ml-auto mt-8 ${className}`}>
            <TableComponent
                className='border border-gray-200 rounded-xl'
                columns={[
                    { key: 'label', title: '' },
                    { key: 'value', title: '' }
                ]}
                data={items}
                rowKey={(item) => `summary-${item.label}`}
                renderRow={(item: SummaryItem) => (
                    <>
                        <TableCell>
                            <span className={`text-xs ${item.isTotal ? 'font-medium text-primary' : 'text-gray-600'}`}>
                                {item.label}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <span className={`text-xs ${item.isTotal ? 'font-semibold text-primary' : 'font-medium text-gray-900'}`}>
                                {item.isPercentage 
                                    ? `${item.value}%`
                                    : typeof item.value === 'number' 
                                        ? formatCurrency(item.value) 
                                        : item.value}
                            </span>
                        </TableCell>
                    </>
                )}
                withCheckbox={false}
                loading={false}
            />
        </div>
    )
}

export default SummaryBox

