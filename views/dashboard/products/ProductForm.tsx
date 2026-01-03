'use client'

import { createFileLabel, createInputLabel, FileUpload, Input, Select, TextArea, CustomAutocomplete } from '@/components'
import ImagePreview from '@/components/ui/form/ImagePreview'
import { Button } from '@heroui/react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useState, useEffect, useRef } from 'react'
import { getCurrencySymbol } from '@/lib'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { useAppSelector, selectCategories, selectBrands, selectUnits, selectVariations } from '@/store'

export interface VariationDetail {
    variationType: string
    productCost: string
    skuBarcode: string
    productPrice: string
    stockAlert: string
    orderTax: string
    taxType: string
    addProductQuantity: string
}

export interface ProductFormData {
    name: string
    productCategory: string
    barcodeSymbology: string
    quantityLimitation: number | string
    expiryDate: string
    skuBarcode: string
    brand: string
    productUnit: string
    note: string
    multipleImage: FileList | null
    status: string
    productType: string
    variations: string
    variationTypes: string[]
    variationDetails: VariationDetail[]
    // ================================
    // Single product fields
    // ================================
    productCost: string
    productPrice: string
    stockAlert: string
    orderTax: string
    taxType: string
    addProductQuantity: string
}

interface ProductFormProps {
    mode: 'create' | 'edit'
    initialData?: Partial<ProductFormData>
    existingImages?: string[] // URLs of existing images (for edit mode)
    onSubmit: (data: ProductFormData) => void
    onCancel: () => void
    isLoading?: boolean
    submitButtonText?: string
    cancelButtonText?: string
}

const ProductForm = ({
    mode,
    initialData,
    existingImages = [],
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText = 'Save',
    cancelButtonText = 'Cancel'
}: ProductFormProps) => {

    // ================================
    // UseForm to manage form state
    // ================================
        const { register, handleSubmit, control, watch, setValue, clearErrors, reset, getValues, formState: { errors, isSubmitting } } = useForm<ProductFormData>({ defaultValues: {
            productType: '',
            variationTypes: [],
            variationDetails: [],
            status: 'active',
            stockAlert: '',
            orderTax: '0',
            ...initialData
        }
    })

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'variationDetails'
    })

    // ================================
    // Reset form when initialData changes (for edit mode)
    // ================================
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            isInitializing.current = true
            const resetData = {
                productType: '',
                variationTypes: [],
                variationDetails: [],
                status: 'active',
                stockAlert: '',
                orderTax: '0',
                productCost: initialData.productCost || '',
                productPrice: initialData.productPrice || '',
                ...initialData 
            }
            reset(resetData)

            if (initialData.variations) {
                setSelectedVariation(Number(initialData.variations))
            }
            
            if (initialData.variationDetails && initialData.variationDetails.length > 0) {
                replace(initialData.variationDetails)
            }
            setTimeout(() => {
                isInitializing.current = false
            }, 100)
        }
    }, [initialData, mode, reset, replace])
    
    const productType = watch('productType')
    const selectedVariationId = watch('variations')
    const selectedVariationTypes = watch('variationTypes')
    
    // ================================
    // Get data from Redux state
    // ================================
    const categories = useAppSelector(selectCategories)
    const brands = useAppSelector(selectBrands)
    const units = useAppSelector(selectUnits)
    const variations = useAppSelector(selectVariations)
    
    const [selectedVariation, setSelectedVariation] = useState<number | null>(null)
    const isInitializing = useRef(true)

    // ================================
    // Get variation options when variation is selected
    // ================================
    const selectedVariationData = variations?.find(v => v.id === selectedVariation)

    // ================================
    // Convert variation options to CustomAutocomplete format
    // ================================
    const variationTypeOptions = selectedVariationData?.options.map(option => ({
        value: option.option,
        label: option.option
    })) || []

    // ================================
    // Clear variation data when product type changes
    // ================================
    useEffect(() => {
        if (productType === 'single') {
            setValue('variations', '')
            setValue('variationTypes', [])
            setValue('variationDetails', [])
            setSelectedVariation(null)
            replace([])
        } else if (productType === 'variation') {
            // Clear single product fields only if not in edit mode or during initialization
            if (!isInitializing.current && mode !== 'edit') {
                setValue('productCost', '')
                setValue('productPrice', '')
                setValue('stockAlert', '')
                setValue('orderTax', '0')
                setValue('taxType', '')
                setValue('addProductQuantity', '')
            }
        }
    }, [productType, setValue, replace, mode])

    // ================================
    // Clear variation types when variations dropdown changes
    // ================================
    useEffect(() => {
        // Don't clear during initialization (edit mode)
        if (isInitializing.current) {
            return
        }

        if (selectedVariationId) {
            const id = Number(selectedVariationId)
            const previousId = selectedVariation
            setSelectedVariation(id)
            // Only clear if the variation actually changed
            if (previousId !== null && previousId !== id) {
                setValue('variationTypes', [])
                setValue('variationDetails', [])
                replace([])
            }
        } else {
            setSelectedVariation(null)
            setValue('variationTypes', [])
            setValue('variationDetails', [])
            replace([])
        }
    }, [selectedVariationId, setValue, replace, selectedVariation])

    // ================================
    // Update variation details when variation types change
    // ================================
    useEffect(() => {
        if (productType === 'variation' && selectedVariationTypes) {
            const currentTypes = selectedVariationTypes
            const existingTypes = fields.map(f => f.variationType)
            
            // Add new variation details for newly selected types
            currentTypes.forEach(type => {
                if (!existingTypes.includes(type)) {
                    append({
                        variationType: type,
                        productCost: '',
                        skuBarcode: '',
                        productPrice: '',
                        stockAlert: '',
                        orderTax: '0',
                        taxType: '',
                        addProductQuantity: ''
                    })
                }
            })
            
            // ================================
            // Remove variation details for deselected types
            // ================================
            existingTypes.forEach((type, index) => {
                if (!currentTypes.includes(type)) {
                    remove(index)
                }
            })
        }
    }, [selectedVariationTypes, productType, fields, append, remove])

    const handleVariationTypesChange = (values: string[]) => {
        setValue('variationTypes', values, { shouldValidate: true })
        if (values.length > 0) {
            clearErrors('variationTypes')
        }
    }

    // ================================
    // Generate random SKU/Barcode
    // ================================
    const generateRandomSKU = (fieldPath?: string) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let result = ''
        for (let i = 0; i < 9; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        if (fieldPath) {
            setValue(fieldPath as any, result, { shouldValidate: true })
        } else {
            setValue('skuBarcode', result, { shouldValidate: true })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">

            {/* ================================ */}
            {/* General Product Information - 3 Columns */}
            {/* ================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* ================================ */}
                {/* General Product Information - Left Column */}
                {/* ================================ */}
                <div className="space-y-4">
                    <Input 
                        label={createInputLabel({
                            name: "Name",
                            required: true
                        })}
                        placeholder="Enter Name"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name?.message as string}
                    />

                    <Select 
                        label={createInputLabel({
                            name: "Product Category",
                            required: true
                        })}
                        {...register('productCategory', { required: 'Product category is required' })}
                        error={errors.productCategory?.message as string}>
                        <option value="" disabled selected>Select Category</option>
                        {categories.map((category) => (
                            <option key={category.category_id} value={String(category.category_id)}>
                                {category.category_name}
                            </option>
                        ))}
                    </Select>

                    <Select 
                        label={createInputLabel({
                            name: "Barcode Symbology",
                            required: true
                        })}
                        {...register('barcodeSymbology', { required: 'Barcode symbology is required' })}
                        error={errors.barcodeSymbology?.message as string}>
                        <option value="" disabled selected>Select Barcode Type</option>
                        <option value="code128">Code 128</option>
                        <option value="code39">Code 39</option>
                    </Select>

                    <Input 
                        label={createInputLabel({
                            name: "Quantity Limitation",
                            required: true
                        })}
                        placeholder="Enter Quantity Limitation"
                        type="number"
                        min="1"
                        step="1"
                        {...register('quantityLimitation', {
                            required: 'Quantity limitation is required',
                            valueAsNumber: true,
                            min: { value: 1, message: 'Quantity limitation must be at least 1' }
                        })}
                        error={errors.quantityLimitation?.message as string}
                    />

                    <Input
                        label={createInputLabel({
                            name: "Expiry date",
                            required: false
                        })}
                        type="date"
                        {...register('expiryDate')}
                    />
                </div>

                {/* ================================ */}
                {/* General Product Information - Middle Column */}
                {/* ================================ */}
                <div className="space-y-4">
                    <Input 
                        label={createInputLabel({
                            name: "SKU/Barcode",
                            required: true
                        })}
                        placeholder="Enter Code"
                        {...register('skuBarcode', { required: 'SKU/Barcode is required' })}
                        error={errors.skuBarcode?.message as string}
                        endContent={
                            <button
                                type="button"
                                onClick={() => generateRandomSKU()}
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                title="Generate random SKU/Barcode">
                                <SparklesIcon className="w-4 h-4 text-gray-600" />
                            </button>
                        }
                    />

                    <Select 
                        label={createInputLabel({
                            name: "Brand",
                            required: true
                        })}
                        {...register('brand', { required: 'Brand is required' })}
                        error={errors.brand?.message as string}>
                        <option value="" disabled selected>Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={String(brand.id)}>
                                {brand.name}
                            </option>
                        ))}
                    </Select>

                    <Select label={createInputLabel({
                            name: "Product Unit",
                            required: true
                        })}
                        {...register('productUnit', { required: 'Product unit is required' })}
                        error={errors.productUnit?.message as string}>
                        <option value="" disabled selected>Select Product Unit</option>
                        {units.map((unit) => (
                            <option key={unit.id} value={String(unit.id)}>
                                {unit.name} ({unit.short_name})
                            </option>
                        ))}
                    </Select>

                    <TextArea
                        label={createInputLabel({
                            name: "Note",
                            required: true
                        })}
                        placeholder="Enter Note"
                        rows={4}
                        {...register('note', { required: 'Note is required' })}
                        error={errors.note?.message as string}
                    />
                </div>

                {/* ================================ */}
                {/* General Product Information - Right Column */}
                {/* ================================ */}
                    <div className="space-y-4">

                    {mode === 'edit' && existingImages && existingImages.length > 0 && (
                        <div className="space-y-3">
                            <h6 className="text-xs font-medium text-gray-700">
                                Existing Images
                            </h6>
                            <ImagePreview
                                images={existingImages}
                                size="sm"
                                showRemoveButton={false}
                            />
                        </div>
                    )}
                    
                    <Controller
                        name="multipleImage"
                        control={control}
                        rules={{ 
                            required: mode === 'create' ? 'Product image is required' : false,
                            validate: (value) => {
                                if (mode === 'create' && (!value || value.length === 0)) {
                                    return 'Product image is required'
                                }
                                return true
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <FileUpload
                                formGroupClass='w-full'
                                className='h-32'
                                name="multipleImage"
                                label={createFileLabel({
                                    name: "Product Image",
                                    required: mode === 'create'
                                })}
                                maxFileSize={10}
                                acceptedFileTypes={['jpg', 'jpeg', 'png', 'webp']}
                                accept="image/*"
                                multiple={true}
                                value={field.value as FileList | null}
                                onChange={(e) => {
                                    if (e.target.files) {
                                        field.onChange(e.target.files)
                                    }
                                }}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    <div className="space-y-4 pt-2">
                        <Select 
                            label={createInputLabel({
                                name: "Status",
                                required: true
                            })}
                            {...register('status')}>
                            <option value="" disabled selected>Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </div>

                </div>

            </div>

            {/* ================================ */}
            {/* Product Type and Variations */}
            {/* ================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* ================================ */}
                {/* Product Type and Variations - Product Type Selection */}
                {/* ================================ */}
                <Select 
                    label={createInputLabel({
                        name: "Product Type",
                        required: true
                    })}
                    {...register('productType', { required: 'Product type is required' })}
                    error={errors.productType?.message as string}>
                    <option value="" disabled selected>Select Product Type</option>
                    <option value="single">Single</option>
                    <option value="variation">Variation</option>
                </Select>

                {productType === 'variation' && (
                    <Select 
                        label={createInputLabel({
                            name: "Variations",
                            required: true
                        })}
                        {...register('variations', { required: 'Variation is required' })}
                        error={errors.variations?.message as string}>
                        <option value="" disabled selected>Select Variation</option>
                        {variations.map((variation) => (
                            <option key={variation.id} value={String(variation.id)}>
                                {variation.name}
                            </option>
                        ))}
                    </Select>
                )}

            </div>

            {/* ================================ */}
            {/* Variation Types Selection */}
            {/* ================================ */}
            {productType === 'variation' && selectedVariationData && (
                <div>
                    <CustomAutocomplete
                        name="variationTypes"
                        label={createInputLabel({
                            name: "Variation Types",
                            required: true
                        })}
                        placeholder="Select..."
                        multiple={true}
                        options={variationTypeOptions}
                        value={selectedVariationTypes || []}
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                handleVariationTypesChange(value)
                            }
                        }}
                        error={errors.variationTypes?.message as string}
                    />
                </div>
            )}

            {/* ================================ */}
            {/* Single Product Type Fields */}
            {/* ================================ */}
            {productType === 'single' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Controller
                        name="productCost"
                        control={control}
                        defaultValue=""
                        rules={{ 
                            validate: (value, formValues) => {
                                const currentProductType = (formValues as any).productType || productType
                                if (currentProductType !== 'single') return true
                                if (!value || value === '' || value === null || value === undefined) {
                                    return 'Product cost is required'
                                }
                                const num = parseFloat(String(value))
                                if (isNaN(num) || num < 1) {
                                    return 'Product cost must be at least 1'
                                }
                                return true
                            }
                        }}
                        render={({ field, fieldState }) => {
                            const fieldValue = field.value !== undefined && field.value !== null ? String(field.value) : ''
                            return (
                                <Input 
                                    name="productCost"
                                    label={createInputLabel({
                                        name: "Product Cost",
                                        required: true
                                    })}
                                    placeholder="Enter Product Cost"
                                    isCurrency={true}
                                    startContent={<span className='text-gray-500 text-xs'>{getCurrencySymbol()}</span>}
                                    type="text"
                                    value={fieldValue}
                                    onChange={(e) => {
                                        const newValue = e.target.value
                                        field.onChange(newValue)
                                    }}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message as string}
                                />
                            )
                        }}
                    />

                    <Controller
                        name="productPrice"
                        control={control}
                        defaultValue=""
                        rules={{ 
                            validate: (value, formValues) => {
                                const currentProductType = (formValues as any).productType || productType
                                if (currentProductType !== 'single') return true
                                if (!value || value === '' || value === null || value === undefined) {
                                    return 'Product price is required'
                                }
                                const num = parseFloat(String(value))
                                if (isNaN(num) || num < 1) {
                                    return 'Product price must be at least 1'
                                }
                                return true
                            }
                        }}
                        render={({ field, fieldState }) => {
                            const fieldValue = field.value !== undefined && field.value !== null ? String(field.value) : ''
                            return (
                                <Input 
                                    name="productPrice"
                                    label={createInputLabel({
                                        name: "Product Price",
                                        required: true
                                    })}
                                    placeholder="Enter Product Price"
                                    isCurrency={true}
                                    startContent={<span className='text-gray-500 text-xs'>{getCurrencySymbol()}</span>}
                                    type="text"
                                    value={fieldValue}
                                    onChange={(e) => {
                                        const newValue = e.target.value
                                        field.onChange(newValue)
                                    }}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message as string}
                                />
                            )
                        }}
                    />

                    <Input 
                        label={createInputLabel({
                            name: "Stock Alert",
                            required: false
                        })}
                        placeholder="Enter Stock Alert"
                        type="number"
                        min="1"
                        step="1"
                        {...register('stockAlert', {
                            validate: (value) => {
                                if (value && value !== '' && parseFloat(value) < 1) {
                                    return 'Stock alert must be at least 1'
                                }
                                return true
                            }
                        })}
                        error={errors.stockAlert?.message as string}
                    />

                    <Input 
                        label={createInputLabel({
                            name: "Order Tax",
                            required: false
                        })}
                        placeholder="Enter Order Tax"
                        type="number"
                        step="0.01"
                        min="0"
                        endContent={<span className='text-gray-500 text-xs'>%</span>}
                        defaultValue="0"
                        {...register('orderTax')}
                    />

                    <Select 
                        label={createInputLabel({
                            name: "Tax Type",
                            required: true
                        })}
                        {...register('taxType', { required: 'Tax type is required' })}
                        error={errors.taxType?.message as string}>
                        <option value="" disabled selected>Select Tax Type</option>
                        <option value="inclusive">Inclusive</option>
                        <option value="exclusive">Exclusive</option>
                    </Select>

                    <Input 
                        label={createInputLabel({
                            name: "Add Product Quantity",
                            required: true
                        })}
                        placeholder="Add Product Quantity"
                        type="number"
                        min="1"
                        step="1"
                        {...register('addProductQuantity', { 
                            required: 'Product quantity is required',
                            min: { value: 1, message: 'Product quantity must be at least 1' },
                            valueAsNumber: true
                        })}
                        error={errors.addProductQuantity?.message as string}
                    />
                </div>
            )}

            {/* ================================ */}
            {/* Variation Details - Individual Fields for Each Variation Type */}
            {/* ================================ */}
            {productType === 'variation' && fields.length > 0 && (
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                            <h3 className='text-sm font-medium text-black/80 mb-4'>
                                Variation: {watch(`variationDetails.${index}.variationType`)}
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Input
                                    label={createInputLabel({
                                        name: "Variation Type",
                                        required: true
                                    })}
                                    readOnly
                                    value={watch(`variationDetails.${index}.variationType`)}
                                    
                                    {...register(`variationDetails.${index}.variationType` as const, { required: true })}
                                />

                                <Controller
                                    name={`variationDetails.${index}.productCost` as const}
                                    control={control}
                                    defaultValue=""
                                    rules={{ 
                                        required: 'Product cost is required',
                                        validate: (value) => {
                                            if (!value || value === '' || value === null || value === undefined) {
                                                return 'Product cost is required'
                                            }
                                            const num = parseFloat(String(value))
                                            if (isNaN(num) || num < 1) {
                                                return 'Product cost must be at least 1'
                                            }
                                            return true
                                        }
                                    }}
                                    render={({ field, fieldState }) => {
                                        const fieldValue = field.value !== undefined && field.value !== null ? String(field.value) : ''
                                        return (
                                            <Input 
                                                name={`variationDetails.${index}.productCost`}
                                                label={createInputLabel({
                                                    name: "Product Cost",
                                                    required: true
                                                })}
                                                placeholder="Enter Product Cost"
                                                isCurrency={true}
                                                startContent={<span className='text-gray-500 text-xs'>{getCurrencySymbol()}</span>}
                                                type="text"
                                                value={fieldValue}
                                                onChange={(e) => {
                                                    const newValue = e.target.value
                                                    field.onChange(newValue)
                                                }}
                                                onBlur={field.onBlur}
                                                error={fieldState.error?.message as string}
                                            />
                                        )
                                    }}
                                />

                                <Input label={createInputLabel({
                                        name: "SKU/Barcode",
                                        required: true
                                    })}
                                    placeholder="Enter Code"
                                    {...register(`variationDetails.${index}.skuBarcode` as const, 
                                    { required: 'SKU/Barcode is required' })}
                                    endContent={
                                        <button type="button" onClick={() => generateRandomSKU(`variationDetails.${index}.skuBarcode`)} className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                            title="Generate random SKU/Barcode">
                                            <SparklesIcon className="w-4 h-4 text-gray-600" />
                                        </button>
                                    }
                                />

                                <Controller
                                    name={`variationDetails.${index}.productPrice` as const}
                                    control={control}
                                    defaultValue=""
                                    rules={{ 
                                        required: 'Product price is required',
                                        validate: (value) => {
                                            if (!value || value === '' || value === null || value === undefined) {
                                                return 'Product price is required'
                                            }
                                            const num = parseFloat(String(value))
                                            if (isNaN(num) || num < 1) {
                                                return 'Product price must be at least 1'
                                            }
                                            return true
                                        }
                                    }}
                                    render={({ field, fieldState }) => {
                                        const fieldValue = field.value !== undefined && field.value !== null ? String(field.value) : ''
                                        return (
                                            <Input 
                                                name={`variationDetails.${index}.productPrice`}
                                                label={createInputLabel({
                                                    name: "Product Price",
                                                    required: true
                                                })}
                                                placeholder="Enter Product Price"
                                                isCurrency={true}
                                                startContent={<span className='text-gray-500 text-xs'>{getCurrencySymbol()}</span>}
                                                type="text"
                                                value={fieldValue}
                                                onChange={(e) => {
                                                    const newValue = e.target.value
                                                    field.onChange(newValue)
                                                }}
                                                onBlur={field.onBlur}
                                                error={fieldState.error?.message as string}
                                            />
                                        )
                                    }}
                                />

                                <Input 
                                    label={createInputLabel({
                                        name: "Stock Alert",
                                        required: false
                                    })}
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...register(`variationDetails.${index}.stockAlert` as const, {
                                        validate: (value) => {
                                            if (value && value !== '' && parseFloat(value) < 1) {
                                                return 'Stock alert must be at least 1'
                                            }
                                            return true
                                        }
                                    })}
                                    error={errors.variationDetails?.[index]?.stockAlert?.message as string}
                                />

                                <Input 
                                    label={createInputLabel({
                                        name: "Order Tax",
                                        required: false
                                    })}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    endContent={<span className='text-gray-500 text-xs'>%</span>}
                                    defaultValue="0"
                                    {...register(`variationDetails.${index}.orderTax` as const)}
                                />

                                <Select 
                                    label={createInputLabel({
                                        name: "Tax Type",
                                        required: true
                                    })}
                                    {...register(`variationDetails.${index}.taxType` as const, { required: 'Tax type is required' })}>
                                    <option value="" disabled selected>Select Tax Type</option>
                                    <option value="inclusive">Inclusive</option>
                                    <option value="exclusive">Exclusive</option>
                                </Select>

                                <Input 
                                    label={createInputLabel({
                                        name: "Add Product Quantity",
                                        required: true
                                    })}
                                    placeholder="Add Product Quantity"
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...register(`variationDetails.${index}.addProductQuantity` as const, { 
                                        required: 'Product quantity is required',
                                        min: { value: 1, message: 'Product quantity must be at least 1' },
                                        valueAsNumber: true
                                    })}
                                    error={errors.variationDetails?.[index]?.addProductQuantity?.message as string}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ================================ */}
            {/* Form Actions */}
            {/* ================================ */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button type="button" variant="light" onPress={onCancel} className="px-6">
                    {cancelButtonText}
                </Button>
                <Button type="submit" color="primary" className="px-6" isLoading={isSubmitting || isLoading}>
                    {submitButtonText}
                </Button>
            </div>

        </form>
    )
}

export default ProductForm

