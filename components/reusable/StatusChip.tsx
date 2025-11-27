'use client'

import React from 'react'
import { Chip } from '@heroui/react'
import { cn } from '@/lib'

type StatusType = 'completed' | 'pending' | 'paid' | 'cancelled'

type StatusChipProps = {
    status: StatusType
    size?: 'sm' | 'md' | 'lg'
    variant?: 'flat' | 'solid' | 'bordered'
    className?: string
    label?: string
    children?: React.ReactNode
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    completed: {
        label: 'Completed',
        className: 'bg-[#E4FBEF] text-success'
    },
    pending: {
        label: 'Pending',
        className: 'bg-yellow-50 text-yellow-600'
    },
    paid: {
        label: 'Paid',
        className: 'bg-[#E4FBEF] text-success'
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-600'
    }
}

const StatusChip = ({ 
    status, 
    size = 'sm', 
    variant = 'flat',
    className,
    label,
    children
}: StatusChipProps) => {
    const config = statusConfig[status]
    const displayLabel = children || label || config.label

    return (
        <Chip
            size={size}
            variant={variant}
            className={cn('text-[11px]', config.className, className)}>
            {displayLabel}
        </Chip>
    )
}

export default StatusChip

