'use client'

import { Input, Select, TextArea } from '@/components'
import { ReactNode } from 'react'
import { cn } from '@/lib'

export type FieldType = 'input' | 'number' | 'select' | 'textarea'

export interface FormField {
    name: string
    label: string
    type?: FieldType
    placeholder?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    startContent?: ReactNode
    endContent?: ReactNode
    options?: Array<{ value: string; label: string }>
    // For reusable select dropdown in endContent
    endSelectOptions?: Array<{ value: string; label: string }>
    endSelectValue?: string
    onEndSelectChange?: (value: string) => void
    endSelectClassName?: string
    colSpan?: number
    inputSize?: 'sm' | 'md' | 'lg'
    formGroupClass?: string
    className?: string
    disabled?: boolean
    isCurrency?: boolean
}

interface FormFieldsGridProps {
    fields: FormField[]
    columns?: number
    className?: string
}

const FormFieldsGrid = ({ 
    fields, 
    columns = 4,
    className = '' 
}: FormFieldsGridProps) => {
    const gridColsClass = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
        6: 'md:grid-cols-6'
    }[columns] || 'md:grid-cols-4'
    
    return (
        <div className={cn('grid grid-cols-1 sm:grid-cols-2', gridColsClass, 'gap-2 mt-8', className)}>
            {fields.map((field) => {
                const colSpan = field.colSpan || 1
                const colSpanClass = {
                    1: '',
                    2: 'col-span-2',
                    3: 'col-span-3',
                    4: 'col-span-4',
                    5: 'col-span-5',
                    6: 'col-span-6'
                }[colSpan] || ''
                const fieldClassName = cn(colSpanClass, field.className)
                
                if (field.type === 'select') {
                    return (
                        <Select
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            value={field.value as string}
                            onChange={field.onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            inputSize={field.inputSize || 'md'}
                            className={fieldClassName}
                            disabled={field.disabled}>
                            {field.options?.map((option, index) => (
                                <option 
                                    key={option.value || index} 
                                    value={option.value}
                                    disabled={index === 0 && option.value === ''}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    )
                }
                
                if (field.type === 'textarea') {
                    return (
                        <TextArea
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            placeholder={field.placeholder}
                            value={field.value as string}
                            onChange={field.onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                            inputSize={field.inputSize || 'md'}
                            formGroupClass={field.formGroupClass || fieldClassName}
                            className={field.className}
                        />
                    )
                }
                
                const endContent = field.endSelectOptions ? (
                    <Select
                        name={`${field.name}-select`}
                        value={field.endSelectValue || ''}
                        onChange={(e) => field.onEndSelectChange?.(e.target.value)}
                        className={cn('cursor-pointer mt-[8px] ml-3 bg-gray-200 rounded-s-none', field.endSelectClassName)}>
                        {field.endSelectOptions.map((option, index) => (
                            <option key={option.value || index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                ) : field.endContent

                return (
                    <Input
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={String(field.value || '')}
                        onChange={field.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        inputSize={field.inputSize || 'md'}
                        startContent={field.startContent}
                        endContent={endContent}
                        className={fieldClassName}
                        disabled={field.disabled}
                        isCurrency={field.isCurrency}
                    />
                )
            })}
        </div>
    )
}

export default FormFieldsGrid

