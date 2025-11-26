'use client'

import React from 'react'
import { Chip } from '@heroui/react'
import { cn } from '@/lib'

type StatusType = 'active' | 'trial' | 'inactive' | 'completed' | 'posted' | 'processed'

type StatusChipProps = {
    status: StatusType
    size?: 'sm' | 'md' | 'lg'
    variant?: 'flat' | 'solid' | 'bordered'
    className?: string
    label?: string
    children?: React.ReactNode
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    active: {
        label: 'Active',
        className: 'bg-success/10 text-success border border-success/20'
    },
    trial: {
        label: 'Trial',
        className: 'bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/20'
    },
    inactive: {
        label: 'Inactive',
        className: 'bg-[#0B99FF]/10 text-[#0B99FF] border border-[#0B99FF]/20'
    },
    completed: {
        label: 'Completed',
        className: 'bg-[#E4FBEF] text-success'
    },
    posted: {
        label: 'Posted',
        className: 'bg-blue-100 text-blue-600'
    },
    processed: {
        label: 'Processed',
        className: 'bg-amber-100 text-amber-600'
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

