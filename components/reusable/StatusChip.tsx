'use client'

import React from 'react'
import { Chip } from '@heroui/react'
import { cn } from '@/lib'

interface StatusChipProps {
    status?: string
    label?: string
    size?: 'sm' | 'md' | 'lg'
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    variant?: 'flat' | 'solid' | 'bordered'
    className?: string
}

const getStatusColor = (status?: string): string => {
    if (!status) return 'bg-gray-100 text-gray-600'
    
    const normalizedStatus = status.toLowerCase()
    
    switch (normalizedStatus) {
        case 'sent':
            return 'bg-blue-100 text-blue-600'
        case 'draft':
            return 'bg-gray-100 text-gray-600'
        case 'approved':
            return 'bg-green-100 text-green-600'
        case 'rejected':
            return 'bg-red-100 text-red-600'
        case 'pending':
            return 'bg-yellow-100 text-yellow-600'
        case 'paid':
            return 'bg-green-100 text-green-600'
        case 'cancelled':
        case 'canceled':
            return 'bg-red-100 text-red-600'
        case 'completed':
            return 'bg-green-100 text-green-600'
        case 'in-transit':
        case 'in transit':
            return 'bg-blue-100 text-blue-600'
        case 'ongoing':
            return 'bg-blue-100 text-blue-600'
        case 'active':
            return 'bg-green-50 text-green-600'
        case 'inactive':
            return 'bg-gray-100 text-gray-600'
        case 'received':
            return 'bg-green-100 text-green-600'
        case 'orders':
            return 'bg-purple-100 text-purple-600'
        case 'unpaid':
            return 'bg-red-100 text-red-600'
        case 'partial':
            return 'bg-yellow-100 text-yellow-600'
        default:
            return 'bg-gray-100 text-gray-600'
    }
}

const StatusChip = ({ 
    status,
    label,
    size = 'sm',
    radius = 'sm',
    variant = 'flat',
    className
}: StatusChipProps) => {
    
    const displayLabel = label || status || ''
    const colorClass = getStatusColor(status)

    return (
        <Chip 
            size={size}
            radius={radius === 'xl' ? 'lg' : radius}
            variant={variant}
            className={cn('text-[12px] px-2 capitalize', colorClass, className)}>
            {displayLabel}
        </Chip>
    )
}

export default StatusChip
