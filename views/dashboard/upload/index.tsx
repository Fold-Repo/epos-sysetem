'use client'

import { DashboardBreadCrumb, DashboardCard, Select, createInputLabel, createFileLabel } from '@/components'
import { Button, Progress } from '@heroui/react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { uploadImage } from '@/services'
import { UPLOAD_FOLDER } from '@/types'
import { FileUpload } from '@/components'

// =========================
// VALIDATION SCHEMA
// =========================
const uploadSchema = yup.object({
    folders: yup
        .string()
        .required('Folder is required'),
    images: yup
        .mixed<FileList>()
        .required('Please select at least one image')
        .test('files', 'Please select at least one image', (value) => {
            return value && value.length > 0
        })
}).required()

type UploadFormData = yup.InferType<typeof uploadSchema>

const UploadTestView = () => {
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [uploadTime, setUploadTime] = useState<number | null>(null)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm<UploadFormData>({
        resolver: yupResolver(uploadSchema),
        mode: 'onChange',
        defaultValues: {
            folders: UPLOAD_FOLDER.PRODUCTS
        }
    })

    const selectedFiles = watch('images')

    const onSubmit = async (data: UploadFormData) => {
        if (!data.images || data.images.length === 0) {
            setError('Please select at least one file')
            return
        }

        setIsUploading(true)
        setProgress(0)
        setError(null)
        setUploadedUrls([])
        setUploadTime(null)

        try {
            const files = await uploadImage(
                { 
                    images: data.images, 
                    folders: data.folders as UPLOAD_FOLDER 
                },
                (progressPercent) => {
                    setProgress(progressPercent)
                }
            )

            const urls = files.map(item => item.url)
            setUploadedUrls(urls)
            setProgress(100)
        } catch (err: any) {
            setError(err?.message || 'Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    const handleClear = () => {
        reset()
        setProgress(0)
        setUploadedUrls([])
        setError(null)
        setUploadTime(null)
    }

    const folderOptions = [
        { value: UPLOAD_FOLDER.PRODUCTS, label: 'Products' },
        { value: UPLOAD_FOLDER.CATEGORIES, label: 'Categories' },
    ]

    return (
        <>
            <DashboardBreadCrumb
                title="Upload Test"
                description="Test image upload functionality with progress tracking"
            />

            <div className="p-3 space-y-3">
                <DashboardCard bodyClassName='space-y-4'>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Folder Selection */}
                        <Controller
                            name="folders"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    name="folders"
                                    label={createInputLabel({
                                        name: "Select Folder",
                                        required: true
                                    })}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.folders?.message as string}
                                    disabled={isUploading || isSubmitting}
                                >
                                    {folderOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />

                        {/* File Input */}
                        <Controller
                            name="images"
                            control={control}
                            render={({ field }) => (
                                <FileUpload
                                    name="images"
                                    label={createFileLabel({
                                        name: "Select Images",
                                        required: true
                                    })}
                                    accept="image/*"
                                    multiple
                                    error={errors.images?.message as string}
                                    value={field.value as FileList | null}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            field.onChange(e.target.files)
                                        }
                                    }}
                                />
                            )}
                        />

                        {selectedFiles && selectedFiles.length > 0 && (
                            <p className="text-sm text-gray-600">
                                {selectedFiles.length} file(s) selected
                            </p>
                        )}

                        {/* Progress Bar */}
                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress
                                    value={progress}
                                    color="primary"
                                    className="w-full"
                                />
                            </div>
                        )}

                        {/* Upload Time */}
                        {uploadTime !== null && (
                            <div className="text-sm text-gray-600">
                                Upload completed in: <strong>{uploadTime}ms</strong>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Uploaded URLs */}
                        {uploadedUrls.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Uploaded Images:</h3>
                                <div className="space-y-2">
                                    {uploadedUrls.map((url, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={url}
                                                    alt={`Uploaded ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-600 break-all">
                                                        {url}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                isDisabled={isUploading || isSubmitting}
                                isLoading={isUploading || isSubmitting}
                                color="primary"
                                className="px-6"
                            >
                                {isUploading ? 'Uploading...' : 'Upload Images'}
                            </Button>
                            <Button
                                type="button"
                                onPress={handleClear}
                                variant="bordered"
                                isDisabled={isUploading || isSubmitting}
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </DashboardCard>
            </div>
        </>
    )
}

export default UploadTestView
