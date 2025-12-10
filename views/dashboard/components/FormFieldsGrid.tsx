'use client'

import { Input, Select, TextArea } from '@/components'
import { ReactNode } from 'react'

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
    colSpan?: number
    inputSize?: 'sm' | 'md' | 'lg'
    formGroupClass?: string
    className?: string
    disabled?: boolean
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
        <div className={`grid grid-cols-2 ${gridColsClass} gap-3 mt-8 ${className}`}>
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
                const fieldClassName = field.className ? `${colSpanClass} ${field.className}` : colSpanClass
                
                if (field.type === 'select') {
                    return (
                        <Select
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            value={field.value as string}
                            onChange={field.onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            inputSize={field.inputSize || 'sm'}
                            className={fieldClassName}
                            disabled={field.disabled}
                        >
                            {field.options?.map((option, index) => (
                                <option 
                                    key={option.value || index} 
                                    value={option.value}
                                    disabled={index === 0 && option.value === ''}
                                >
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
                            inputSize={field.inputSize}
                            formGroupClass={field.formGroupClass || fieldClassName}
                            className={field.className}
                        />
                    )
                }
                
                return (
                    <Input
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={String(field.value || '')}
                        onChange={field.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        inputSize={field.inputSize || 'sm'}
                        startContent={field.startContent}
                        endContent={field.endContent}
                        className={fieldClassName}
                        disabled={field.disabled}
                    />
                )
            })}
        </div>
    )
}

export default FormFieldsGrid

