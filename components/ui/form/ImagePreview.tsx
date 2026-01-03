'use client'

import React from 'react'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/react'
import { cn } from '@/lib'

interface ImagePreviewProps {
    images: string[]
    onRemove?: (index: number) => void
    className?: string
    imageClassName?: string
    showRemoveButton?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-32 w-32'
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
    images,
    onRemove,
    className,
    imageClassName,
    showRemoveButton = true,
    size = 'md'
}) => {
    if (!images || images.length === 0) {
        return null
    }

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            {images.map((imageUrl, index) => (
                <div
                    key={index}
                    className="relative group"
                >
                    <Image
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        width={size === 'sm' ? 48 : size === 'md' ? 80 : 128}
                        height={size === 'sm' ? 48 : size === 'md' ? 80 : 128}
                        className={cn(
                            'object-cover rounded-md',
                            sizeClasses[size],
                            imageClassName
                        )}
                    />
                    {showRemoveButton && onRemove && (
                        <Button
                            isIconOnly
                            size="sm"
                            variant="solid"
                            color="danger"
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onPress={() => onRemove(index)}
                        >
                            <XMarkIcon className="size-3" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ImagePreview

