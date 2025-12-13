'use client'

import React, { useState, useRef } from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib'
import Label from './Label'
import ErrorMessage from './ErrorMessage'

interface ProfilePictureUploadProps {
    label?: string | React.ReactNode
    name: string
    className?: string
    formGroupClass?: string
    labelClassName?: string
    error?: string
    value?: FileList | null
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    defaultImage?: string
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
    label,
    name,
    className,
    formGroupClass,
    labelClassName,
    error,
    value,
    onChange,
    defaultImage
}) => {
    const [preview, setPreview] = useState<string | null>(defaultImage || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (value && value instanceof FileList && value.length > 0) {
            const file = value[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else if (!value && !defaultImage) {
            setPreview(null)
        }
    }, [value, defaultImage])

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
        onChange?.(e)
    }

    return (
        <div className={cn("form-group", formGroupClass)}>

            {label && <Label htmlFor={name} label={label} className={labelClassName} />}

            <input
                ref={fileInputRef}
                id={name}
                name={name}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            <div className="relative inline-block">
                <div
                    onClick={handleClick}
                    className={cn(
                        "relative w-32 h-32 rounded-full cursor-pointer overflow-hidden bg-gray-50",
                        error && "border-2 border-red-500",
                        className
                    )} >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile picture"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    )}

                    <div className="absolute top-5 right-5">
                        <button
                            type="button"
                            className="bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClick()
                            }} >
                            <PencilIcon className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <ErrorMessage error={error} />
            
        </div>
    )
}

export default ProfilePictureUpload

