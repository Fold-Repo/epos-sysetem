'use client'

import React, { ReactNode } from 'react'
import { Button } from '@heroui/react'
import { StackIcon, AdjustmentIcon } from '../icons'
import SearchInput from './SearchInput'
import FilterContainer from './FilterContainer'
import MenuDropdown from '@/components/ui/MenuDropdown'
import DatePicker from '@/components/ui/DatePicker'

type DropdownFilterItem = {
    label: string
    key: string
}

type DropdownFilter = {
    type: 'dropdown'
    label?: string
    value?: string
    items: DropdownFilterItem[]
    onChange?: (key: string) => void
    startContent?: ReactNode
    showChevron?: boolean
    buttonLabel?: string
    buttonIcon?: ReactNode
}

type DateRangeFilter = {
    type: 'dateRange'
    startDate?: Date
    endDate?: Date
    onChange?: (value: Date | { startDate: Date; endDate: Date }) => void
    buttonLabel?: string
    buttonIcon?: ReactNode
}

type CustomFilter = {
    type: 'custom'
    content: ReactNode
}

type ButtonFilter = {
    type: 'button'
    label: string
    icon?: ReactNode
    onPress?: () => void
    className?: string
}

type FilterConfig = DropdownFilter | DateRangeFilter | CustomFilter | ButtonFilter

type FilterBarProps = {
    items?: FilterConfig[]
    children?: ReactNode
    startContent?: ReactNode
    endContent?: ReactNode
    searchInput?: {
        placeholder?: string
        className?: string
        onSearch?: (value: string) => void
    }
    className?: string
}

const FilterBar: React.FC<FilterBarProps> = ({
    items = [],
    children,
    startContent,
    endContent,
    searchInput,
    className = ''
}) => {
    const renderFilter = (filter: FilterConfig, index: number) => {
        switch (filter.type) {
            case 'dropdown':
                return (
                    <FilterContainer key={index}>
                        {filter.buttonLabel && (
                            <Button
                                disableRipple
                                disableAnimation
                                className='text-[12px] border-0 h-auto text-text-color rounded-lg py-2 px-3 bg-white flex items-center gap-2'>
                                {filter.buttonIcon || <AdjustmentIcon className="text-slate-400" />}
                                <span>{filter.buttonLabel}</span>
                            </Button>
                        )}
                        <MenuDropdown
                            startContent={filter.startContent || <StackIcon className="text-slate-400" />}
                            label={filter.label}
                            showChevron={filter.showChevron ?? false}
                            items={filter.items}
                            value={filter.value}
                            onChange={filter.onChange}
                        />
                    </FilterContainer>
                )

            case 'dateRange':
                return (
                    <FilterContainer key={index}>
                        {filter.buttonLabel && (
                            <Button
                                disableRipple
                                disableAnimation
                                className='text-[12px] border-0 h-auto text-text-color rounded-lg py-2 px-3 bg-white flex items-center gap-2'>
                                {filter.buttonIcon || <AdjustmentIcon className="text-slate-400" />}
                                <span>{filter.buttonLabel}</span>
                            </Button>
                        )}
                        <DatePicker
                            startDate={filter.startDate}
                            endDate={filter.endDate}
                            range={true}
                            onChange={filter.onChange || (() => { })}
                        />
                    </FilterContainer>
                )

            case 'custom':
                return (
                    <FilterContainer key={index}>
                        {filter.content}
                    </FilterContainer>
                )

            case 'button':
                return (
                    <FilterContainer key={index}>
                        <Button
                            onPress={filter.onPress}
                            className={filter.className || 'text-[12px] border-0 h-auto text-text-color rounded-lg py-2 px-3 bg-white flex items-center gap-2'}>
                            {filter.icon && filter.icon}
                            <span>{filter.label}</span>
                        </Button>
                    </FilterContainer>
                )

            default:
                return null
        }
    }

    return (
        <div className={`flex flex-wrap gap-3 items-center ${searchInput ? 'justify-between' : 'justify-end'} ${className}`}>
            {searchInput && (
                <SearchInput
                    className={searchInput.className || 'w-full sm:w-60 md:w-80'}
                    placeholder={searchInput.placeholder || 'Search...'}
                    onSearch={searchInput.onSearch}
                />
            )}

            <div className="flex items-center justify-end flex-wrap gap-2">
                {startContent && (
                    <FilterContainer>
                        {startContent}
                    </FilterContainer>
                )}

                {items.map((filter, index) => renderFilter(filter, index))}
                {children}

                {endContent && (
                    <FilterContainer>
                        {endContent}
                    </FilterContainer>
                )}
            </div>
        </div>
    )
}

export default FilterBar

