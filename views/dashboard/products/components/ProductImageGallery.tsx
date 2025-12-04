'use client'

import Image from 'next/image'
import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface ProductImageGalleryProps {
    images: string[]
    productName?: string
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
    images, 
    productName = 'Product' 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleThumbnailClick = useCallback((index: number) => {
        setCurrentIndex(index)
    }, [])

    return (
        <div className="flex md:flex-row flex-col gap-3">

            <div className="bg-primary w-full aspect-square sm:aspect-9/5 lg:aspect-9/6 
            rounded-2xl overflow-hidden relative group">
                <motion.div
                    className="flex h-full"
                    animate={{ x: `-${currentIndex * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}>
                    {images.map((image, index) => (
                        <div key={index} className="w-full h-full shrink-0">
                            <Image 
                                src={image} 
                                alt={`${productName} image ${index + 1}`}
                                width={1000} 
                                height={1000} 
                                className='w-full h-full object-cover object-top' 
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="flex flex-row md:flex-col gap-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}>
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}>
                        <button
                            onClick={() => handleThumbnailClick(index)}
                            className={`bg-primary size-14 md:size-16 2xl:size-18 rounded-md overflow-hidden cursor-pointer transition duration-150 shrink-0 ${
                                currentIndex === index 
                                    ? "ring ring-offset-2 ring-gray-500" 
                                    : ""
                            }`}>
                            <Image 
                                src={image} 
                                alt={`${productName} thumbnail ${index + 1}`}
                                width={200} 
                                height={200} 
                                className='w-full h-full object-cover' 
                            />
                        </button>
                    </motion.div>
                ))}
            </motion.div>
            
        </div>
    )
}

export default ProductImageGallery

