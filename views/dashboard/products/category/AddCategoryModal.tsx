'use client'

import { createFileLabel, createInputLabel, FileUpload, Input, PopupModal, TextArea, ImagePreview } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Category, UPLOAD_FOLDER } from '@/types'
import { useEffect, useState } from 'react'
import { useCreateCategory, useUpdateCategory, uploadImage } from '@/services'

// =========================
// VALIDATION SCHEMA FACTORY
// =========================
const createCategorySchema = (isEditMode: boolean) => yup.object({
    category_name: yup
        .string()
        .required('Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(100, 'Category name must not exceed 100 characters'),
    description: yup
        .string()
        .required('Description is required')
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must not exceed 500 characters'),
    image: yup
        .string()
        .url('Image must be a valid URL')
        .notRequired(),
    imageFile: yup
        .mixed<FileList>()
        .test('image-required', 'Category image is required', function(value) {
            if (isEditMode) {
                return true
            }
            return value && value.length > 0
        }),
}).required()

type CategoryFormData = yup.InferType<ReturnType<typeof createCategorySchema>>

interface AddCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Category
}

const AddCategoryModal = ({ isOpen, onClose, initialData }: AddCategoryModalProps) => {

    const createCategoryMutation = useCreateCategory()
    const updateCategoryMutation = useUpdateCategory()
    const [isUploading, setIsUploading] = useState(false)

    const isEditMode = !!initialData
    const categorySchema = createCategorySchema(isEditMode)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
        setValue,
        watch
    } = useForm<CategoryFormData>({
        resolver: yupResolver(categorySchema) as any,
        mode: 'onChange',
        defaultValues: {
            category_name: initialData?.category_name || '',
            description: '',
            image: initialData?.image || '',
            imageFile: undefined
        }
    })

    const imageFile = watch('imageFile')

    useEffect(() => {
        if (isOpen) {
            reset({
                category_name: initialData?.category_name || '',
                description: '',
                image: initialData?.image || '',
                imageFile: undefined
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: CategoryFormData) => {
        try {
            let imageUrl = initialData?.image

            // Upload image if a new file is selected
            if (data.imageFile && data.imageFile.length > 0) {
                setIsUploading(true)
                try {
                    const uploadedFiles = await uploadImage({
                        images: data.imageFile,
                        folders: UPLOAD_FOLDER.CATEGORIES
                    })
                    if (uploadedFiles && uploadedFiles.length > 0) {
                        imageUrl = uploadedFiles[0].url
                    }
                } catch (error: any) {
                    setIsUploading(false)
                    return
                } finally {
                    setIsUploading(false)
                }
            }

            // Validate image requirement for new categories
            if (!initialData && !imageUrl) {
                setValue('imageFile', undefined, { shouldValidate: true })
                return
            }

            const payload = {
                category_name: data.category_name,
                description: data.description || undefined,
                image: imageUrl || undefined
            }

            if (initialData) {
                updateCategoryMutation.mutate({
                    id: initialData.category_id,
                    categoryData: payload
                }, {
                    onSuccess: () => {
                        onClose()
                        reset()
                    }
                })
            } else {
                createCategoryMutation.mutate(payload, {
                    onSuccess: () => {
                        onClose()
                        reset()
                    }
                })
            }
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <PopupModal size="lg" radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title={initialData ? 'Edit Category' : 'Add Category'}
            description={initialData ? 'Update category information' : 'Add a new product category'}
            bodyClassName='p-5'
            footer={
                <Button size='sm' type='submit' className='h-10 px-6'
                    color="primary" isLoading={isSubmitting || isUploading || createCategoryMutation.isPending || updateCategoryMutation.isPending} onPress={() => {
                        const form = document.querySelector('form')
                        if (form) {
                            form.requestSubmit()
                        }
                    }}>
                    {initialData ? 'Update Category' : 'Save Category'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-2">
                <Input label={createInputLabel({
                        name: "Category Name",
                        required: true
                    })}
                    placeholder="Enter category name"
                    {...register('category_name')}
                    error={errors.category_name?.message as string}
                />

                <TextArea
                    label={createInputLabel({
                        name: "Description",
                        required: true
                    })}
                    placeholder="Enter category description"
                    {...register('description')}
                    error={errors.description?.message as string}
                />

                <Controller
                    name="imageFile"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FileUpload
                            formGroupClass='w-full'
                            className='h-32'
                            name="imageFile"
                            label={createFileLabel({
                                name: "Category Image",
                                required: initialData ? false : true
                            })}
                            maxFileSize={2}
                            acceptedFileTypes={['jpg', 'jpeg', 'png', 'webp']}
                            accept="image/*"
                            multiple={false}
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

                {initialData?.image && !imageFile && (
                    <ImagePreview
                        images={[initialData.image]}
                        size="sm"
                        showRemoveButton={false}
                    />
                )}

            </form>

        </PopupModal>
    )
}

export default AddCategoryModal
